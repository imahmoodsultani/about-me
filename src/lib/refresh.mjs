import {
  MAX_RETRIES,
  PROFILE_HANDLE,
  RETRY_BACKOFF_MS,
  SNAPSHOT_PATH
} from "../config.mjs";
import { fetchGitHubProfile } from "../providers/github.mjs";
import { fetchLinkedInProfile } from "../providers/linkedin.mjs";
import {
  mergeProfiles,
  normalizeGitHubProfile,
  normalizeLinkedInProfile,
  validateNormalizedProfile
} from "./profile-schema.mjs";
import { loadSnapshot, logEvent, saveSnapshot } from "./snapshot-store.mjs";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retryProvider(label, fn) {
  let latestError = null;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const result = await fn();
      return { ok: true, result, attempts: attempt + 1 };
    } catch (error) {
      latestError = error;
      await logEvent({
        level: "warn",
        source: label,
        action: "provider_attempt_failed",
        attempt: attempt + 1,
        message: error.message
      });
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_BACKOFF_MS * (attempt + 1));
      }
    }
  }
  return { ok: false, error: latestError, attempts: MAX_RETRIES + 1 };
}

export async function refreshProfile({
  handle = PROFILE_HANDLE,
  storePath = SNAPSHOT_PATH,
  providers
} = {}) {
  const linkedInProvider = providers?.linkedin || fetchLinkedInProfile;
  const gitHubProvider = providers?.github || fetchGitHubProfile;

  const linkedIn = await retryProvider("linkedin", () => linkedInProvider(handle));
  const gitHub = await retryProvider("github", () => gitHubProvider(handle));

  const normalizedInputs = [];
  const sourceErrors = [];
  const sourceStatus = [
    { source: "linkedin", healthy: linkedIn.ok },
    { source: "github", healthy: gitHub.ok }
  ];

  if (linkedIn.ok) {
    normalizedInputs.push(normalizeLinkedInProfile(linkedIn.result));
  } else {
    sourceErrors.push({ source: "linkedin", message: linkedIn.error.message });
  }

  if (gitHub.ok) {
    normalizedInputs.push(normalizeGitHubProfile(gitHub.result));
  } else {
    sourceErrors.push({ source: "github", message: gitHub.error.message });
  }

  if (normalizedInputs.length === 0) {
    const cached = await loadSnapshot(storePath);
    if (cached) {
      await logEvent({
        level: "info",
        action: "fallback_to_cache",
        reason: "all_sources_failed"
      });
      return {
        ...cached,
        sourceErrors,
        sourceStatus,
        cacheStatus: "stale"
      };
    }
    throw new Error("Unable to refresh profile: all sources failed and no snapshot exists");
  }

  const merged = mergeProfiles(normalizedInputs);
  merged.sourceStatus = sourceStatus;
  merged.sourceErrors = sourceErrors;
  merged.cacheStatus = sourceErrors.length > 0 ? "degraded" : "fresh";
  validateNormalizedProfile(merged);

  await saveSnapshot(storePath, merged);
  await logEvent({
    level: "info",
    action: "refresh_complete",
    sourcesHealthy: sourceStatus.filter((s) => s.healthy).length,
    sourcesTotal: sourceStatus.length
  });

  return merged;
}

import { REQUEST_TIMEOUT_MS } from "../config.mjs";

function withTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timeoutId));
}

export async function fetchGitHubProfile(handle) {
  const userRes = await withTimeout(`https://api.github.com/users/${handle}`, {
    headers: { "User-Agent": "about-me-profile-page" }
  });
  if (!userRes.ok) {
    throw new Error(`GitHub user fetch failed: ${userRes.status}`);
  }

  const reposRes = await withTimeout(
    `https://api.github.com/users/${handle}/repos?sort=updated&per_page=6`,
    { headers: { "User-Agent": "about-me-profile-page" } }
  );
  if (!reposRes.ok) {
    throw new Error(`GitHub repos fetch failed: ${reposRes.status}`);
  }

  return {
    user: await userRes.json(),
    repos: await reposRes.json()
  };
}

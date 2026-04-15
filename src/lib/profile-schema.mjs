function toArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function normalizeGitHubProfile(payload) {
  if (!payload || !payload.user) {
    throw new Error("Invalid GitHub payload: missing user");
  }

  const { user, repos = [] } = payload;
  return {
    source: "github",
    identity: {
      name: user.name || user.login,
      headline: user.bio || "Software developer",
      avatarUrl: user.avatar_url || "",
      profileUrl: user.html_url || ""
    },
    bio: user.bio || "",
    skills: [],
    experienceHighlights: [],
    projects: repos.slice(0, 6).map((repo) => ({
      name: repo.name,
      description: repo.description || "",
      url: repo.html_url,
      stars: repo.stargazers_count || 0
    })),
    contactLinks: [
      {
        label: "GitHub",
        url: user.html_url || ""
      }
    ]
  };
}

export function normalizeLinkedInProfile(payload) {
  if (!payload || !payload.handle) {
    throw new Error("Invalid LinkedIn payload: missing handle");
  }

  return {
    source: "linkedin",
    identity: {
      name: payload.name || payload.handle,
      headline: payload.headline || "Professional profile",
      avatarUrl: payload.avatarUrl || "",
      profileUrl: payload.profileUrl || `https://www.linkedin.com/in/${payload.handle}`
    },
    bio: payload.about || "",
    skills: toArray(payload.skills),
    experienceHighlights: toArray(payload.experienceHighlights),
    projects: [],
    contactLinks: [
      {
        label: "LinkedIn",
        url: payload.profileUrl || `https://www.linkedin.com/in/${payload.handle}`
      }
    ]
  };
}

function dedupeLinks(links) {
  const seen = new Set();
  return links.filter((link) => {
    if (!link?.url || seen.has(link.url)) return false;
    seen.add(link.url);
    return true;
  });
}

export function mergeProfiles(inputs) {
  const profiles = inputs.filter(Boolean);
  if (profiles.length === 0) {
    throw new Error("No profiles available to merge");
  }

  const primary = profiles[0];
  const identity = profiles
    .map((profile) => profile.identity)
    .find((candidate) => candidate?.name) || {
    name: "Unknown",
    headline: "",
    avatarUrl: "",
    profileUrl: ""
  };

  return {
    identity,
    bio: profiles.map((profile) => profile.bio).find(Boolean) || "",
    skills: [...new Set(profiles.flatMap((profile) => toArray(profile.skills)))],
    experienceHighlights: profiles.flatMap((profile) => toArray(profile.experienceHighlights)),
    projects: profiles.flatMap((profile) => toArray(profile.projects)).slice(0, 8),
    contactLinks: dedupeLinks(profiles.flatMap((profile) => toArray(profile.contactLinks))),
    sourceStatus: profiles.map((profile) => ({
      source: profile.source,
      healthy: true
    })),
    sourceErrors: [],
    lastUpdated: new Date().toISOString(),
    cacheStatus: "fresh",
    primarySource: primary.source
  };
}

export function validateNormalizedProfile(profile) {
  if (!profile?.identity?.name) {
    throw new Error("Normalized profile is missing identity.name");
  }

  if (!Array.isArray(profile.contactLinks)) {
    throw new Error("Normalized profile is missing contactLinks[]");
  }

  if (!Array.isArray(profile.projects)) {
    throw new Error("Normalized profile is missing projects[]");
  }

  return true;
}

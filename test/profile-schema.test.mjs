import test from "node:test";
import assert from "node:assert/strict";
import {
  mergeProfiles,
  normalizeGitHubProfile,
  normalizeLinkedInProfile,
  validateNormalizedProfile
} from "../src/lib/profile-schema.mjs";

test("normalize providers and merge", () => {
  const linkedIn = normalizeLinkedInProfile({
    handle: "imahmoodsultani",
    name: "Mahmood",
    about: "Bio",
    skills: ["Node.js"],
    experienceHighlights: ["Built APIs"]
  });

  const gitHub = normalizeGitHubProfile({
    user: { login: "imahmoodsultani", html_url: "https://github.com/imahmoodsultani" },
    repos: [{ name: "repo", html_url: "https://github.com/imahmoodsultani/repo", stargazers_count: 3 }]
  });

  const merged = mergeProfiles([linkedIn, gitHub]);
  assert.equal(merged.identity.name, "Mahmood");
  assert.equal(merged.projects.length, 1);
  assert.doesNotThrow(() => validateNormalizedProfile(merged));
});

test("invalid normalized profile throws", () => {
  assert.throws(() => validateNormalizedProfile({ identity: {} }), /identity\.name/);
});

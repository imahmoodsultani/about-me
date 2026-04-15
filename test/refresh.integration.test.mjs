import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { refreshProfile } from "../src/lib/refresh.mjs";

test("refresh works with both providers", async () => {
  const tempDir = await mkdtemp(join(tmpdir(), "about-me-test-"));
  const filePath = join(tempDir, "snapshot.json");
  const profile = await refreshProfile({
    storePath: filePath,
    providers: {
      linkedin: async () => ({
        handle: "imahmoodsultani",
        name: "Mahmood",
        about: "About",
        skills: ["JavaScript"],
        experienceHighlights: ["Built software"]
      }),
      github: async () => ({
        user: {
          login: "imahmoodsultani",
          html_url: "https://github.com/imahmoodsultani"
        },
        repos: []
      })
    }
  });

  assert.equal(profile.cacheStatus, "fresh");
  assert.equal(profile.sourceErrors.length, 0);
});

test("refresh falls back to cached snapshot when all providers fail", async () => {
  const tempDir = await mkdtemp(join(tmpdir(), "about-me-test-"));
  const filePath = join(tempDir, "snapshot.json");

  await refreshProfile({
    storePath: filePath,
    providers: {
      linkedin: async () => ({ handle: "imahmoodsultani", name: "Mahmood" }),
      github: async () => ({
        user: { login: "imahmoodsultani", html_url: "https://github.com/imahmoodsultani" },
        repos: []
      })
    }
  });

  const profile = await refreshProfile({
    storePath: filePath,
    providers: {
      linkedin: async () => {
        throw new Error("linkedin down");
      },
      github: async () => {
        throw new Error("github down");
      }
    }
  });

  assert.equal(profile.cacheStatus, "stale");
  assert.equal(profile.sourceErrors.length, 2);
});

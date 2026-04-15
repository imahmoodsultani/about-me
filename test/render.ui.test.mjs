import test from "node:test";
import assert from "node:assert/strict";
import { renderProfilePage } from "../src/ui/render.mjs";

test("rendered page includes landmarks, headings, and fallback notices", () => {
  const html = renderProfilePage({
    identity: { name: "Mahmood", headline: "Engineer" },
    bio: "Bio",
    experienceHighlights: [],
    projects: [],
    skills: [],
    contactLinks: [{ label: "GitHub", url: "https://github.com/imahmoodsultani" }],
    sourceErrors: [{ source: "github", message: "down" }],
    cacheStatus: "stale",
    lastUpdated: "2026-01-01T00:00:00.000Z"
  });

  assert.match(html, /role="main"/);
  assert.match(html, /<h1>Mahmood<\/h1>/);
  assert.match(html, /Skip to content/);
  assert.match(html, /Some sources are currently unavailable/);
  assert.match(html, /Data is currently served from cache/);
  assert.match(html, /No projects available/);
});

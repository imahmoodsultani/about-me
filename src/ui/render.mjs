function escapeHtml(text) {
  return String(text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderList(items, emptyText) {
  if (!items || items.length === 0) {
    return `<p class="muted">${escapeHtml(emptyText)}</p>`;
  }
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

export function renderProfilePage(profile) {
  const identity = profile?.identity || {};
  const projects = profile?.projects || [];
  const notices = [];

  if (profile?.sourceErrors?.length) {
    notices.push("Some sources are currently unavailable. Showing partial profile data.");
  }
  if (profile?.cacheStatus === "stale") {
    notices.push("Data is currently served from cache due to provider errors.");
  }

  const projectMarkup = projects.length
    ? `<ul>${projects
        .map(
          (project) =>
            `<li><a href="${escapeHtml(project.url)}">${escapeHtml(project.name)}</a> - ${escapeHtml(
              project.description || "No description"
            )}</li>`
        )
        .join("")}</ul>`
    : `<p class="muted">No projects available.</p>`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(identity.name || "About Me")}</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <a class="skip-link" href="#main-content">Skip to content</a>
    <main id="main-content" class="container" role="main">
      <header>
        <h1>${escapeHtml(identity.name || "Profile")}</h1>
        <p>${escapeHtml(identity.headline || "")}</p>
      </header>
      <section aria-labelledby="about-heading">
        <h2 id="about-heading">About</h2>
        <p>${escapeHtml(profile?.bio || "Biography coming soon.")}</p>
      </section>
      <section aria-labelledby="experience-heading">
        <h2 id="experience-heading">Experience Highlights</h2>
        ${renderList(profile?.experienceHighlights, "No experience highlights available.")}
      </section>
      <section aria-labelledby="projects-heading">
        <h2 id="projects-heading">Projects</h2>
        ${projectMarkup}
      </section>
      <section aria-labelledby="skills-heading">
        <h2 id="skills-heading">Skills</h2>
        ${renderList(profile?.skills, "No skills listed yet.")}
      </section>
      <section aria-labelledby="contact-heading">
        <h2 id="contact-heading">Contact</h2>
        <ul>
          ${(profile?.contactLinks || [])
            .map(
              (link) =>
                `<li><a href="${escapeHtml(link.url)}" rel="noreferrer noopener">${escapeHtml(
                  link.label
                )}</a></li>`
            )
            .join("")}
        </ul>
      </section>
      <footer>
        <p>Last updated: ${escapeHtml(profile?.lastUpdated || "Unknown")}</p>
        ${notices.map((notice) => `<p class="notice">${escapeHtml(notice)}</p>`).join("")}
      </footer>
    </main>
  </body>
</html>`;
}

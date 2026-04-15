export async function fetchLinkedInProfile(handle) {
  if (!handle) {
    throw new Error("LinkedIn handle is required");
  }

  // LinkedIn public API access is restricted; this adapter returns
  // curated public profile fields that can be replaced by a real client later.
  return {
    handle,
    name: "Mahmood Sultani",
    headline: "Software Engineer",
    about: "Building practical software products with a focus on reliability and user experience.",
    profileUrl: `https://www.linkedin.com/in/${handle}`,
    skills: ["JavaScript", "TypeScript", "Node.js", "Web Development"],
    experienceHighlights: [
      "Designed and shipped production web applications",
      "Built automation tooling for developer workflows",
      "Improved reliability of data and API integrations"
    ]
  };
}

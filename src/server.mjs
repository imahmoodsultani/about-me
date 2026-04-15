import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { refreshProfile } from "./lib/refresh.mjs";
import { renderProfilePage } from "./ui/render.mjs";

const PORT = Number(process.env.PORT || 3000);

const server = createServer(async (req, res) => {
  try {
    if (req.url === "/styles.css") {
      const css = await readFile("src/ui/styles.css", "utf8");
      res.writeHead(200, { "content-type": "text/css; charset=utf-8" });
      res.end(css);
      return;
    }

    const profile = await refreshProfile();
    const html = renderProfilePage(profile);
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(html);
  } catch (error) {
    res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    res.end(`Failed to render profile: ${error.message}`);
  }
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`About page running at http://localhost:${PORT}`);
});

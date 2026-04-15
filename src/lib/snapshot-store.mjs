import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export async function saveSnapshot(filePath, profile) {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(profile, null, 2), "utf8");
}

export async function loadSnapshot(filePath) {
  try {
    const content = await readFile(filePath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

export async function logEvent(event) {
  await mkdir("logs", { recursive: true });
  const line = `${new Date().toISOString()} ${JSON.stringify(event)}\n`;
  await appendFile("logs/refresh-events.log", line, "utf8");
}

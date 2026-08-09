import { promises as fs } from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const outputPath = path.join(projectRoot, "assets", "data", "youtube-playlists.json");
const contentRoots = ["_posts", "_resources"];
const playlistHosts = new Set(["youtube.com", "m.youtube.com", "music.youtube.com"]);

const walk = async (directory) => {
  let entries;
  try {
    entries = await fs.readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }

  const files = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(entryPath);
    return /\.(?:md|markdown|html)$/i.test(entry.name) ? [entryPath] : [];
  }));
  return files.flat();
};

const playlistIdFromUrl = (value) => {
  try {
    const url = new URL(value.replaceAll("&amp;", "&"));
    const host = url.hostname.replace(/^www\./, "");
    const pathname = url.pathname.replace(/\/+$/, "");
    if (!playlistHosts.has(host) || pathname !== "/playlist") return "";
    const id = url.searchParams.get("list") || "";
    return /^[A-Za-z0-9_-]{10,}$/.test(id) ? id : "";
  } catch {
    return "";
  }
};

const contentFiles = (await Promise.all(contentRoots.map((root) => walk(path.join(projectRoot, root))))).flat();
const playlistIds = new Set();

for (const file of contentFiles) {
  const content = await fs.readFile(file, "utf8");
  const urls = content.match(/https?:\/\/[^\s()<>\[\]'"]+/g) || [];
  urls.forEach((url) => {
    const playlistId = playlistIdFromUrl(url);
    if (playlistId) playlistIds.add(playlistId);
  });
}

await fs.mkdir(path.dirname(outputPath), { recursive: true });

if (!playlistIds.size) {
  await fs.writeFile(outputPath, "{}\n", "utf8");
  console.log("No standalone YouTube playlist links were found.");
  process.exit(0);
}

const apiKey = process.env.YOUTUBE_API_KEY?.trim();
if (!apiKey) throw new Error("YOUTUBE_API_KEY is required to retrieve playlist metadata.");

const metadata = {};
const ids = [...playlistIds];

for (let index = 0; index < ids.length; index += 50) {
  const endpoint = new URL("https://www.googleapis.com/youtube/v3/playlists");
  endpoint.searchParams.set("part", "snippet,contentDetails");
  endpoint.searchParams.set("id", ids.slice(index, index + 50).join(","));
  endpoint.searchParams.set("key", apiKey);

  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`YouTube playlist metadata request failed with status ${response.status}.`);
  const payload = await response.json();

  for (const playlist of payload.items || []) {
    const snippet = playlist.snippet || {};
    const thumbnails = snippet.thumbnails || {};
    const image = thumbnails.maxres?.url
      || thumbnails.standard?.url
      || thumbnails.high?.url
      || thumbnails.medium?.url
      || thumbnails.default?.url
      || "";
    const itemCount = Number(playlist.contentDetails?.itemCount || 0);
    const countLabel = `${itemCount} video${itemCount === 1 ? "" : "s"} in this playlist.`;
    const description = String(snippet.description || "").trim();

    metadata[playlist.id] = {
      title: String(snippet.title || "YouTube playlist").trim().slice(0, 240),
      description: (description || countLabel).slice(0, 520),
      siteName: snippet.channelTitle ? `${snippet.channelTitle} · YouTube` : "YouTube",
      image,
      imageType: "image"
    };
  }
}

await fs.writeFile(outputPath, `${JSON.stringify(metadata, null, 2)}\n`, "utf8");
const generatedCount = Object.keys(metadata).length;
console.log(`Generated metadata for ${generatedCount} YouTube playlist${generatedCount === 1 ? "" : "s"}.`);

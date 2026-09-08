import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const indexPath = path.join(root, "index.html");
const outputPath = path.join(root, "playlist-metrics.json");
const pageSize = 50;

const html = await fs.readFile(indexPath, "utf8");
const playlists = [...html.matchAll(/<a class="playlist-card" href="https:\/\/open\.spotify\.com\/playlist\/([A-Za-z0-9]+)"[^>]*aria-label="Open ([^"]+) on Spotify"/g)]
  .map(([, id, name]) => ({ id, name }));

if (playlists.length !== 64) throw new Error(`Expected 64 playlist cards, found ${playlists.length}.`);

const required = ["SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET", "SPOTIFY_REFRESH_TOKEN"];
const missing = required.filter((name) => !process.env[name]);
if (missing.length) throw new Error(`Missing environment variables: ${missing.join(", ")}`);

async function getAccessToken() {
  const credentials = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64");
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      authorization: `Basic ${credentials}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
    }),
  });
  if (!response.ok) throw new Error(`Spotify authorization failed (${response.status}).`);
  const data = await response.json();
  if (!data.access_token) throw new Error("Spotify did not return an access token.");
  return data.access_token;
}

async function spotifyGet(url, token, attempt = 0) {
  const response = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
  if (response.status === 429 && attempt < 3) {
    const retryAfter = Math.min(Number(response.headers.get("retry-after")) || 2, 30);
    await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
    return spotifyGet(url, token, attempt + 1);
  }
  if (!response.ok) throw new Error(`Spotify request failed (${response.status}).`);
  return response.json();
}

async function getMetrics({ id, name }, position, token) {
  let offset = 0;
  let total = 0;
  let durationMs = 0;

  do {
    const url = new URL(`https://api.spotify.com/v1/playlists/${id}/items`);
    url.searchParams.set("market", "HU");
    url.searchParams.set("limit", String(pageSize));
    url.searchParams.set("offset", String(offset));
    url.searchParams.set("additional_types", "track,episode");
    url.searchParams.set("fields", "items(item(duration_ms),track(duration_ms)),next,total");
    const page = await spotifyGet(url, token);
    total = Number(page.total) || 0;
    for (const row of page.items || []) {
      durationMs += Number(row.item?.duration_ms ?? row.track?.duration_ms) || 0;
    }
    offset += page.items?.length || pageSize;
    if (!page.next) break;
  } while (offset < total);

  const hours = Math.floor(durationMs / 3_600_000);
  const minutes = Math.floor((durationMs % 3_600_000) / 60_000);
  process.stdout.write(`${String(position + 1).padStart(2, "0")}/64  ${name}: ${total} tracks, ${hours}h ${minutes}m\n`);
  return [id, { tracks: total, durationMs, durationLabel: `${hours}h ${minutes}m` }];
}

async function mapWithConcurrency(items, concurrency, task) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next++;
      results[index] = await task(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

const token = await getAccessToken();
const entries = await mapWithConcurrency(playlists, 6, (playlist, index) => getMetrics(playlist, index, token));
const metrics = {
  updatedAt: new Date().toISOString(),
  source: "Spotify Web API",
  playlists: Object.fromEntries(entries),
};

await fs.writeFile(outputPath, `${JSON.stringify(metrics, null, 2)}\n`, "utf8");
process.stdout.write(`Saved ${path.relative(root, outputPath)}\n`);

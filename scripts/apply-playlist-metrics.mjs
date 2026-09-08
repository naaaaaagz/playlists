import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const indexPath = path.join(root, "index.html");
const metricsPath = path.join(root, "playlist-metrics.json");
const metrics = JSON.parse(await fs.readFile(metricsPath, "utf8"));
let html = await fs.readFile(indexPath, "utf8");
let updated = 0;

html = html.replace(/<a class="playlist-card" href="https:\/\/open\.spotify\.com\/playlist\/([A-Za-z0-9]+)"([^>]*data-categories="([^"]+)"[^>]*)>([\s\S]*?)<\/a>/g,
  (card, id, attributes, categories, content) => {
    const playlist = metrics.playlists[id];
    if (!playlist) throw new Error(`Missing metrics for playlist ${id}.`);
    const categoryText = categories.split("|").join(", ");
    const cleanAttributes = attributes.replace(/\sdata-playlist-id="[^"]*"/g, "");
    const opening = `<a class="playlist-card" href="https://open.spotify.com/playlist/${id}"${cleanAttributes} data-playlist-id="${id}">`;
    const meta = `<div class="card-meta" data-track-count="${playlist.tracks}"><span class="playtime">${playlist.durationLabel}</span><span class="meta-separator" aria-hidden="true">·</span><span class="card-categories">${categoryText}</span></div>`;
    let nextContent = content.replace(/(?:<span class="track-count">[^<]*<\/span>|<div class="card-meta"[^>]*>[\s\S]*?<\/div>)/, meta);
    nextContent = nextContent.replace(/\s*<div class="category-tags"[^>]*>(?:<span[^>]*>[^<]*<\/span>)+<\/div>/, "");
    if (!/<\/div>\s*$/.test(nextContent)) nextContent = `${nextContent.trimEnd()}\n  </div>\n`;
    updated += 1;
    return `${opening}${nextContent}</a>`;
  });

if (updated !== 64) throw new Error(`Expected to update 64 cards, updated ${updated}.`);
if (!html.includes('name="playlist-metrics-endpoint"')) {
  html = html.replace('  <meta name="description" content="Explore 64 genre-spanning Spotify playlists curated by Nagz.">',
    '  <meta name="description" content="Explore 64 genre-spanning Spotify playlists curated by Nagz.">\n  <meta name="playlist-metrics-endpoint" content="playlist-metrics.json">');
}

await fs.writeFile(indexPath, html, "utf8");
process.stdout.write(`Applied metrics to ${updated} playlist cards.\n`);

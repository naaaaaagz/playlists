const CACHE_SECONDS = 21_600;
const PAGE_SIZE = 50;
const CONCURRENCY = 6;

function jsonResponse(data, source, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
      "cache-control": `public, max-age=300, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=86400`,
      "x-playlist-metrics-source": source,
    },
  });
}

async function getStaticSnapshot(request) {
  const url = new URL(request.url);
  url.pathname = url.pathname.replace(/\/api\/playlist-metrics\/?$/, "/playlist-metrics.json");
  url.search = "";
  const response = await fetch(url, { headers: { accept: "application/json" } });
  if (!response.ok) throw new Error(`Static metrics snapshot failed (${response.status}).`);
  return response.json();
}

async function getSpotifyAccessToken(env) {
  const credentials = btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`);
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: env.SPOTIFY_REFRESH_TOKEN,
  });
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      authorization: `Basic ${credentials}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!response.ok) throw new Error(`Spotify authorization failed (${response.status}).`);
  const data = await response.json();
  if (!data.access_token) throw new Error("Spotify did not return an access token.");
  return data.access_token;
}

async function getPlaylistMetrics(id, token) {
  let offset = 0;
  let total = 0;
  let durationMs = 0;

  do {
    const url = new URL(`https://api.spotify.com/v1/playlists/${id}/items`);
    url.searchParams.set("market", "HU");
    url.searchParams.set("limit", String(PAGE_SIZE));
    url.searchParams.set("offset", String(offset));
    url.searchParams.set("additional_types", "track,episode");
    url.searchParams.set("fields", "items(item(duration_ms),track(duration_ms)),next,total");
    const response = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
    if (!response.ok) throw new Error(`Spotify playlist ${id} failed (${response.status}).`);
    const page = await response.json();
    total = Number(page.total) || 0;
    for (const row of page.items || []) {
      durationMs += Number(row.item?.duration_ms ?? row.track?.duration_ms) || 0;
    }
    offset += page.items?.length || PAGE_SIZE;
    if (!page.next) break;
  } while (offset < total);

  const hours = Math.floor(durationMs / 3_600_000);
  const minutes = Math.floor((durationMs % 3_600_000) / 60_000);
  return { tracks: total, durationMs, durationLabel: `${hours}h ${minutes}m` };
}

async function mapWithConcurrency(items, concurrency, task) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next++;
      results[index] = await task(items[index]);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

async function refreshMetrics(ids, env) {
  const token = await getSpotifyAccessToken(env);
  const values = await mapWithConcurrency(ids, CONCURRENCY, (id) => getPlaylistMetrics(id, token));
  return {
    updatedAt: new Date().toISOString(),
    source: "Spotify Web API",
    playlists: Object.fromEntries(ids.map((id, index) => [id, values[index]])),
  };
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const cache = caches.default;
  const cacheKey = new Request(new URL(request.url).origin + new URL(request.url).pathname);
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  let snapshot;
  try {
    snapshot = await getStaticSnapshot(request);
  } catch {
    return jsonResponse({ error: "Playlist metrics are temporarily unavailable." }, "unavailable", 503);
  }

  const hasCredentials = env.SPOTIFY_CLIENT_ID && env.SPOTIFY_CLIENT_SECRET && env.SPOTIFY_REFRESH_TOKEN;
  if (!hasCredentials) return jsonResponse(snapshot, "static-snapshot");

  context.waitUntil((async () => {
    try {
      const data = await refreshMetrics(Object.keys(snapshot.playlists || {}), env);
      await cache.put(cacheKey, jsonResponse(data, "spotify-web-api"));
    } catch {
      // Keep serving the verified snapshot until a later refresh succeeds.
    }
  })());

  return jsonResponse(snapshot, "static-refreshing");
}

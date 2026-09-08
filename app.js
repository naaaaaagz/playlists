const filterButtons = Array.from(document.querySelectorAll(".filter[data-filter]"));
const cards = Array.from(document.querySelectorAll(".playlist-card"));
const emptyState = document.querySelector("#empty-state");
const selected = new Set();

function selectedFromUrl() {
  const values = new URLSearchParams(location.search).get("categories");
  if (!values) return;
  const category = values
    .split(",")
    .find((value) => value !== "all" && filterButtons.some((button) => button.dataset.filter === value));
  if (category) selected.add(category);
}

function syncUrl() {
  const url = new URL(location.href);
  if (selected.size) url.searchParams.set("categories", Array.from(selected).join(","));
  else url.searchParams.delete("categories");
  history.replaceState(null, "", url);
}

function applyFilters({ updateUrl = true } = {}) {
  let shown = 0;
  const activeCategory = selected.values().next().value;
  cards.forEach((card) => {
    const cardCategories = card.dataset.categories.split("|");
    const matches = !activeCategory || cardCategories.includes(activeCategory);
    card.hidden = !matches;
    if (matches) shown += 1;
  });

  filterButtons.forEach((button) => {
    const active = button.dataset.filter === "all" ? !selected.size : selected.has(button.dataset.filter);
    button.setAttribute("aria-pressed", String(active));
  });

  emptyState.hidden = shown > 0;
  if (updateUrl) syncUrl();
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.filter;
    if (category === "all") selected.clear();
    else if (selected.has(category)) selected.delete(category);
    else {
      selected.clear();
      selected.add(category);
    }
    applyFilters();
  });
});

selectedFromUrl();
applyFilters({ updateUrl: false });

async function refreshPlaylistMetrics() {
  const endpoint = document.querySelector('meta[name="playlist-metrics-endpoint"]')?.content;
  if (!endpoint) return;

  try {
    const response = await fetch(endpoint, { headers: { accept: "application/json" } });
    if (!response.ok) return;
    const data = await response.json();
    Object.entries(data.playlists || {}).forEach(([id, metrics]) => {
      const card = document.querySelector(`.playlist-card[data-playlist-id="${id}"]`);
      if (!card) return;
      const meta = card.querySelector(".card-meta");
      const playtime = card.querySelector(".playtime");
      if (meta && Number.isFinite(metrics.tracks)) meta.dataset.trackCount = String(metrics.tracks);
      if (playtime && typeof metrics.durationLabel === "string") playtime.textContent = metrics.durationLabel;
    });
  } catch {
    // The baked-in values remain visible if the refresh endpoint is unavailable.
  }
}

window.addEventListener("load", refreshPlaylistMetrics, { once: true });

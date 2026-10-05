const filterButtons = Array.from(document.querySelectorAll(".filter[data-filter]"));
const cards = Array.from(document.querySelectorAll(".playlist-card"));
const emptyState = document.querySelector("#empty-state");
const validCategories = new Set(filterButtons.map((button) => button.dataset.filter).filter((value) => value !== "all"));
let activeCategory = null;

function categoryFromUrl() {
  const params = new URLSearchParams(location.search);
  // "categories" is the older parameter name; keep old shared links working.
  const value = params.get("category") ?? params.get("categories")?.split(",")[0];
  return validCategories.has(value) ? value : null;
}

function syncUrl() {
  const url = new URL(location.href);
  if (activeCategory) url.searchParams.set("category", activeCategory);
  else url.searchParams.delete("category");
  url.searchParams.delete("categories");
  history.replaceState(null, "", url);
}

function applyFilter({ updateUrl = true } = {}) {
  let shown = 0;
  cards.forEach((card) => {
    const matches = !activeCategory || card.dataset.categories.split("|").includes(activeCategory);
    card.hidden = !matches;
    if (matches) shown += 1;
  });

  filterButtons.forEach((button) => {
    const value = button.dataset.filter;
    const active = value === "all" ? !activeCategory : value === activeCategory;
    button.setAttribute("aria-pressed", String(active));
  });

  emptyState.hidden = shown > 0;
  if (updateUrl) syncUrl();
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.dataset.filter;
    activeCategory = value === "all" || value === activeCategory ? null : value;
    applyFilter();
  });
});

activeCategory = categoryFromUrl();
applyFilter({ updateUrl: false });

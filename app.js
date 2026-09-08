const filters = Array.from(document.querySelectorAll(".filter"));
const areas = Array.from(document.querySelectorAll(".area"));
const cards = Array.from(document.querySelectorAll(".playlist-card"));
const resultLabel = document.querySelector("#result-label");

function setFilter(category) {
  let visibleCards = 0;

  filters.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.filter === category));
  });

  if (category === "all") {
    areas.forEach((area) => { area.hidden = false; });
    cards.forEach((card) => { card.hidden = false; });
    visibleCards = cards.length;
  } else {
    areas.forEach((area) => {
      let areaHasCards = false;
      area.querySelectorAll(".playlist-card").forEach((card) => {
        const matches = card.dataset.categories.split("|").includes(category);
        card.hidden = !matches;
        areaHasCards ||= matches;
        if (matches) visibleCards += 1;
      });
      area.hidden = !areaHasCards;
    });
  }

  const current = filters.find((button) => button.dataset.filter === category);
  resultLabel.textContent = category === "all"
    ? `${visibleCards} playlists across every area`
    : `${visibleCards} ${current.textContent.trim()} playlist${visibleCards === 1 ? "" : "s"}`;

  const url = new URL(window.location.href);
  if (category === "all") url.searchParams.delete("area");
  else url.searchParams.set("area", category);
  history.replaceState(null, "", url);
}

filters.forEach((button) => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});

const requestedArea = new URLSearchParams(window.location.search).get("area");
const validArea = filters.some((button) => button.dataset.filter === requestedArea);
setFilter(validArea ? requestedArea : "all");

// =========================
// STATE
// =========================

let currentPart = "glutes";
let currentDim  = null;
let activeTile = null;
let activeLightboxIndex = -1;


// =========================
// IMAGE TILE / METADATA
// =========================

function getPostIdFromSrc(src) {
  const cleanSrc = String(src || "").split("?")[0];
  const fileName = cleanSrc.split("/").pop() || "";
  return fileName.replace(/\.(png|jpe?g|webp|heic)$/i, "");
}

function getMetadataForSrc(src) {
  const postId = getPostIdFromSrc(src);
  if (!postId || typeof ATLAS_METADATA === "undefined") return { postId, hashtags: [] };
  return { postId, ...(ATLAS_METADATA[postId] || { hashtags: [] }) };
}

function createAtlasTile(src, altText) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "atlas-tile";
  button.dataset.src = src;
  button.dataset.postId = getPostIdFromSrc(src);

  const img = document.createElement("img");
  img.src = src;
  img.alt = altText || "";
  img.loading = "lazy";
  button.appendChild(img);

  button.addEventListener("click", () => openLightbox(button));
  return button;
}

function openLightbox(tile) {
  const lightbox = document.getElementById("atlasLightbox");
  const image = document.getElementById("atlasLightboxImage");
  const tags = document.getElementById("atlasLightboxTags");
  if (!lightbox || !image || !tags || !tile) return;

  const visibleTiles = getVisibleAtlasTiles();
  activeLightboxIndex = visibleTiles.indexOf(tile);

  if (activeTile) activeTile.classList.remove("is-active");
  activeTile = tile;
  activeTile.classList.add("is-active");

  const src = tile.dataset.src;
  const meta = getMetadataForSrc(src);

  image.src = src;
  image.alt = tile.querySelector("img")?.alt || "";
  tags.innerHTML = "";

  if (meta.hashtags && meta.hashtags.length) {
    meta.hashtags.forEach(tag => {
      const pill = document.createElement("span");
      pill.className = "atlas-lightbox-tag";
      pill.textContent = tag;
      tags.appendChild(pill);
    });
  } else {
    const empty = document.createElement("p");
    empty.className = "atlas-lightbox-empty";
    empty.textContent = "No hashtags available for this image.";
    tags.appendChild(empty);
  }

  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  updateLightboxNav();
}

function closeLightbox() {
  const lightbox = document.getElementById("atlasLightbox");
  if (!lightbox) return;
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  activeLightboxIndex = -1;
  if (activeTile) {
    activeTile.classList.remove("is-active");
    activeTile = null;
  }
}

function getVisibleAtlasTiles() {
  return Array.from(document.querySelectorAll("#imageArea .atlas-tile"));
}

function navigateLightbox(direction) {
  const visibleTiles = getVisibleAtlasTiles();
  if (!visibleTiles.length) return;

  const currentIndex = activeLightboxIndex >= 0
    ? activeLightboxIndex
    : Math.max(0, visibleTiles.indexOf(activeTile));
  const nextIndex = (currentIndex + direction + visibleTiles.length) % visibleTiles.length;

  openLightbox(visibleTiles[nextIndex]);
}

function updateLightboxNav() {
  const visibleTiles = getVisibleAtlasTiles();
  const prev = document.getElementById("atlasLightboxPrev");
  const next = document.getElementById("atlasLightboxNext");
  const hasMultipleImages = visibleTiles.length > 1;

  if (prev) prev.disabled = !hasMultipleImages;
  if (next) next.disabled = !hasMultipleImages;
}


// =========================
// COLOR HELPERS
// =========================

function setColor(color) {
  document.documentElement.style.setProperty("--atlas-accent", color);
  document.documentElement.style.setProperty("--atlas-accent-contrast", isLight(color) ? "#000" : "#fff");
  document.getElementById("imageArea").style.background = color;
  document.body.classList.remove("atlas-glutes", "atlas-legs", "atlas-feet");
  document.body.classList.add(`atlas-${currentPart}`);

  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  const activeTab = document.querySelector(`.tab[data-part="${currentPart}"]`);
  if (activeTab) activeTab.classList.add("active");

  document.querySelectorAll(".explore-item").forEach(item => {
    item.classList.toggle("active", item.dataset.dim === currentDim);
  });
}

function isLight(hex) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return (r * 0.299 + g * 0.587 + b * 0.114) > 128;
}


// =========================
// AREA SIZE
// =========================

function getAreaSize() {
  const area = document.getElementById("imageArea");
  return { W: area.clientWidth, H: area.clientHeight };
}


// =========================
// FLAT GRID RENDER
// =========================

function renderFlatGrid(area) {
  const images = ATLAS_FLAT[currentPart];
  if (!images || images.length === 0) return;

  const { W, H } = getAreaSize();
  const N = images.length;
  const GAP = 4;

  const size = calcCellSize(N, W, H, GAP);
  const cols = Math.max(1, Math.floor((W + GAP) / (size + GAP)));

  const grid = document.createElement("div");
  grid.className = "flat-grid";
  grid.style.gridTemplateColumns = `repeat(${cols}, ${size}px)`;
  grid.style.gridAutoRows = `${size}px`;

  images.forEach(src => {
    grid.appendChild(createAtlasTile(src, currentPart));
  });

  area.appendChild(grid);
}

// Returns the largest square cell size where all N images fit in W×H including gaps
function calcCellSize(N, W, H, gap = 0) {
  let best = 1;
  for (let cols = 1; cols <= N; cols++) {
    const rows = Math.ceil(N / cols);
    const cellW = (W - gap * (cols - 1)) / cols;
    const cellH = (H - gap * (rows - 1)) / rows;
    const size = Math.min(cellW, cellH);
    if (size > best) best = size;
  }
  return Math.floor(best);
}


// =========================
// SUBCATEGORY GRID RENDER
// =========================

function renderSubcats(area, dimData) {
  if (!dimData) return;

  const entries = Object.entries(dimData).filter(([, s]) => s.images && s.images.length > 0);
  if (entries.length === 0) {
    area.innerHTML = '<p style="padding:40px;opacity:0.5;">No images.</p>';
    return;
  }

  const { W, H } = getAreaSize();
  const GAP = 10;
  const GRID_GAP = 4;
  const GRID_PAD = 8;
  const TITLE_H = 30;
  const customCols = getCustomSubcatColumns(entries);
  const numCols = customCols ? customCols.length : calcGroupCols(entries, W, H, TITLE_H);
  const colW = Math.floor((W - GAP * (numCols - 1)) / numCols);

  const cols = customCols || distributeGroups(entries, numCols);
  const colTitleHeights = cols.map(col =>
    col.reduce((sum) => sum + TITLE_H + GRID_PAD, 0)
  );
  const colImgHeights = cols.map((col, i) => H - colTitleHeights[i]);
  const colCellSizes = cols.map((col, i) => {
    const n = col.reduce((sum, [, s]) => sum + s.images.length, 0);
    const imgH = Math.max(colImgHeights[i], 10);
    return calcCellSize(n, colW - GRID_PAD, imgH, GRID_GAP);
  });

  const cellSize = Math.max(Math.min(...colCellSizes), 4);
  const imgCols = Math.max(1, Math.floor((colW - GRID_PAD + GRID_GAP) / (cellSize + GRID_GAP)));

  const wrapper = document.createElement("div");
  wrapper.className = "subcat-columns";

  cols.forEach(col => {
    const colEl = document.createElement("div");
    colEl.className = "subcat-col";

    col.forEach(([name, subcat]) => {
      const group = document.createElement("div");
      group.className = "subcat-group";

      const title = document.createElement("div");
      title.className = "subcat-title";
      title.style.height = TITLE_H + "px";
      title.innerHTML = `${name.toUpperCase()}<sup>${subcat.count}</sup>`;
      group.appendChild(title);

      const grid = document.createElement("div");
      grid.className = "subcat-grid";
      grid.style.gridTemplateColumns = `repeat(${imgCols}, ${cellSize}px)`;
      grid.style.gridAutoRows = `${cellSize}px`;

      subcat.images.forEach(src => {
        grid.appendChild(createAtlasTile(src, name));
      });

      group.appendChild(grid);
      colEl.appendChild(group);
    });

    wrapper.appendChild(colEl);
  });

  area.appendChild(wrapper);
}

// Editorial grouping for Setting views.
// This keeps related setting categories visually close instead of relying on the automatic weight-based column layout.
function getCustomSubcatColumns(entries) {
  if ((currentPart !== "feet" && currentPart !== "legs") || currentDim !== "setting") return null;

  const byName = new Map(entries);
  const layout = byName.has("Indoor")
    ? [
        ["Indoor"],
        ["Intimate Setting", "Bed", "Sofa"],
        ["Outdoor", "Beach", "Car", "Gym"]
      ]
    : [
        ["Other", "Kitchen", "Floor"],
        ["Intimate Setting", "Bed", "Sofa"],
        ["Outdoor", "Beach", "Car", "Gym"]
      ];

  const used = new Set();
  const cols = layout
    .map(names => names
      .filter(name => byName.has(name))
      .map(name => {
        used.add(name);
        return [name, byName.get(name)];
      })
    )
    .filter(col => col.length > 0);

  const leftovers = entries.filter(([name]) => !used.has(name));
  if (leftovers.length) cols.push(leftovers);

  return cols.length ? cols : null;
}

// How many group-columns to use
function calcGroupCols(entries, W, H, titleH) {
  const n = entries.length;
  if (n <= 2) return 1;
  if (n <= 4) return 2;
  if (n <= 8) return 3;
  return 4;
}

// Distribute groups into numCols columns by greedy weight balancing
function distributeGroups(entries, numCols) {
  const cols = Array.from({ length: numCols }, () => []);
  const weights = new Array(numCols).fill(0);

  // Sort groups descending by image count so big ones go first
  const sorted = [...entries].sort((a, b) => b[1].count - a[1].count);

  sorted.forEach(entry => {
    const minCol = weights.indexOf(Math.min(...weights));
    cols[minCol].push(entry);
    weights[minCol] += entry[1].count;
  });

  return cols;
}


// =========================
// MAIN RENDER
// =========================

function render() {
  const area = document.getElementById("imageArea");
  area.innerHTML = "";
  closeLightbox();

  const partData = ATLAS_DATA[currentPart];
  if (!partData) return;

  setColor(partData.color);

  if (currentDim === null) {
    renderFlatGrid(area);
  } else {
    renderSubcats(area, partData[currentDim]);
  }
}


// =========================
// EVENT LISTENERS
// =========================

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    currentPart = tab.dataset.part;
    render();
  });
});

document.querySelectorAll(".explore-item").forEach(item => {
  item.addEventListener("click", () => {
    const dim = item.dataset.dim;
    if (currentDim === dim) {
      currentDim = null;
    } else {
      currentDim = dim;
    }
    render();
  });
});

const lightboxBackdrop = document.getElementById("atlasLightboxBackdrop");
const lightbox = document.getElementById("atlasLightbox");
const lightboxCard = document.querySelector(".atlas-lightbox-card");
const lightboxPrev = document.getElementById("atlasLightboxPrev");
const lightboxNext = document.getElementById("atlasLightboxNext");

if (lightboxBackdrop) lightboxBackdrop.addEventListener("click", closeLightbox);
if (lightbox) lightbox.addEventListener("click", closeLightbox);
if (lightboxCard) lightboxCard.addEventListener("click", event => event.stopPropagation());
if (lightboxPrev) {
  lightboxPrev.addEventListener("click", event => {
    event.stopPropagation();
    navigateLightbox(-1);
  });
}
if (lightboxNext) {
  lightboxNext.addEventListener("click", event => {
    event.stopPropagation();
    navigateLightbox(1);
  });
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
  if (document.getElementById("atlasLightbox")?.classList.contains("is-open")) {
    if (event.key === "ArrowLeft") navigateLightbox(-1);
    if (event.key === "ArrowRight") navigateLightbox(1);
  }
});

// Re-render on resize
window.addEventListener("resize", render);


// =========================
// INIT
// =========================

// Pre-select body part from URL hash (e.g. #glutes, #legs, #feet)
(function initFromHash() {
  const hash = window.location.hash.replace('#', '').toLowerCase();
  const valid = ['glutes', 'legs', 'feet'];
  if (valid.includes(hash)) {
    currentPart = hash;
    const tab = document.querySelector(`.tab[data-part="${hash}"]`);
    if (tab) {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    }
  }
})();

render();

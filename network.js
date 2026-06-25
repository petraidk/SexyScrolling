/* =========================================
   NETWORK.JS — Interactive hashtag network
   ========================================= */

const CATEGORY_META = {
  'Aesthetic & Lifestyle Tags': {
    label: 'Aesthetic & Lifestyle Tags',
    hex: '#EDA9FF',
    topTags: [['#model',251],['#lifestyle',182],['#aesthetic',91],['#fitness',84],['#femalemodel',78],['#gym',78],['#modeling',68],['#gymgirl',64]],
    subTags: 'fitness / modeling / lifestyle / gym / wellness / influencer',
    desc: 'The female body is presented as part of a curated lifestyle. Sexualisation is subtle and continuous, embedded in poses, outfits and settings rather than explicit acts.'
  },
 
  'Art & Photography': {
    label: 'Art & Photography Tags',
    hex: '#A3FF8D',
    topTags: [['#photography',184],['#photooftheday',159],['#portrait',128],['#picoftheday',89],['#photoshoot',84],['#art',81],['#womanportrait',80],['#selfie',64]],
    subTags: 'portrait / photography / photoshoot / fine art / editing / selfie',
    desc: 'The body is framed as artistic subject. Photography and portraiture aestheticise the female form, placing it within the language of high art or professional imagery.'
  },
  'Fashion & Appearance': {
    label: 'Fashion & Appearance Tags',
    hex: '#B1FAFF',
    topTags: [['#fashion',338],['#ootd',232],['#beauty',231],['#highheels',204],['#style',196],['#fashionblogger',188],['#heels',174],['#garterbeltsaresexy',170]],
    subTags: 'beauty / fashion mainstream / lingerie and bikini / materials and texture / shoes and heels / dresses and skirts',
    desc: 'Focus on styling, clothing and visual presentation, where the body becomes a display surface.'
  },
  'Identity and Beauty Adjectives': {
    label: 'Identity & Beauty Adjectives Tags',
    hex: '#FFA929',
    topTags: [['#beautifulwoman',255],['#beautiful',246],['#beautifulwomen',103],['#pretty',86],['#gorgeous',80],['#stunning',76],['#cute',72],['#happy',59]],
    subTags: 'beautiful / gorgeous / pretty',
    desc: 'The female body is described through aesthetic judgements. Beauty becomes the primary measure of value, reflected in adjectives that define worth through appearance.'
  },
  'Identity & Demographics': {
    label: 'Identity & Demographics Tags',
    hex: '#AC23FF',
    topTags: [['#woman',254],['#girl',190],['#girls',94],['#women',63],['#singlemom',50],['#singlegirls',49],['#polishgirl',47],['#over50',46]],
    subTags: 'woman / girl / nationality / age / relationship status / gender',
    desc: 'Tags that define who the person is — nationality, age, gender. Identity becomes a category, and the body is its container.'
  },
    'Motivational / Empowerment Tags': {
    label: 'Motivational & Empowerment Tags',
    hex: '#FFE449',
    topTags: [['#loveyourself',78],['#womenempowerment',77],['#girlbossenergy',73],['#highvaluewoman',62],['#selflove',51],['#womanpower',42],['#womansupportingwoman',42],['#motivation',38]],
    subTags: 'self-love / empowerment / confidence / girlboss / women power / inspiration',
    desc: 'Language of self-improvement and empowerment. These tags often coexist with sexualised imagery, raising questions about who defines empowerment.'
  },
   'Physical Attributes & Body Parts': {
    label: 'Physical Attributes & Body Parts Tags',
    hex: '#FF55C9',
    topTags: [['#feet',171],['#legs',145],['#celebrityfeet',128],['#baddiesbrowns',100],['#blonde',100],['#thepose',78],['#longlegs',73],['#soles',68]],
    subTags: 'feet / legs / glutes / body parts / close-up / anatomy',
    desc: 'Hashtags that isolate and name specific body parts, reducing the body to its components. Often associated with fetish communities and explicit content.'
  },
  'Sexual & Explicit Tags': {
    label: 'Sexual & Explicit Tags',
    hex: '#FF2529',
    topTags: [['#sexyentertainers',229],['#sëxywoman',98],['#sexy',77],['#sensuousgirl',67],['#hot',62],['#provocative',59],['#sexydancers',53],['#sexystrippers',50]],
    subTags: 'sexy / hot / explicit / erotic / sensual / adult content',
    desc: 'Hashtags that explicitly sexualise the body through erotic language and sexual references.'
  },
   'Social/Algorithmic Visibility Tags': {
    label: 'Social & Algorithmic Visibility Tags',
    hex: '#423CFF',
    topTags: [['#explorepage',222],['#explore',179],['#instagood',170],['#fyp',165],['#instagram',154],['#viral',144],['#trending',134],['#instadaily',100]],
    subTags: 'explore / viral / trending / fyp / instagram / engagement',
    desc: 'Hashtags aimed at maximising reach, engagement and algorithmic circulation rather than describing content.'
  },
  'Other': {
    label: 'Other Tags',
    hex: '#9e9e9eff',
    topTags: [['#love',241],['#cartoon',104],['#rainyseason',100],['#reemshaikh',100],['#me',65],['#summertime',52],['#bajul',50],['#star',50]],
    subTags: 'unclassified / miscellaneous / love / pop culture / seasonal',
    desc: 'Tags that do not fit neatly into other categories. A heterogeneous group revealing the unpredictable associations that accumulate around images of the female body.'
  }
};

/* ---- Build right-panel category buttons ---- */
(function buildButtons() {
  const container = document.getElementById('cat-buttons');
  for (const [catName, meta] of Object.entries(CATEGORY_META)) {
    const btn = document.createElement('div');
    btn.className = 'cat-btn';
    btn.dataset.cat = catName;
    btn.style.setProperty('--cat-color', meta.hex);

    /* Label (always visible) */
    const label = document.createElement('div');
    label.className = 'cat-btn-label';
    label.textContent = meta.label;
    btn.appendChild(label);

    /* Expanded content (only visible when active) */
    const expanded = document.createElement('div');
    expanded.className = 'cat-btn-expanded';

    const collapseIcon = document.createElement('div');
    collapseIcon.className = 'cat-btn-collapse';
    collapseIcon.setAttribute('aria-hidden', 'true');
    collapseIcon.textContent = '−';

    const subTags = document.createElement('div');
    subTags.className = 'cat-btn-subtags';
    subTags.textContent = meta.subTags;

    const desc = document.createElement('p');
    desc.className = 'cat-btn-desc';
    desc.textContent = meta.desc;

    expanded.appendChild(collapseIcon);
    expanded.appendChild(subTags);
    expanded.appendChild(desc);
    btn.appendChild(expanded);

    container.appendChild(btn);
  }
})();

/* ---- State ---- */
let sigmaInst = null;
let theGraph = null;
let selectedCat = null;
let hoveredNode = null;
let hoveredNeighbors = new Set();
const MIN_VISIBLE_OCCURRENCES = 20;
let labelLayer = null;
let labelAnimationFrame = null;
let hoverClearTimeout = null;

function drawDarkNodeHover(context, data) {
  const size = data.size || 1;
  context.save();
  context.beginPath();
  context.arc(data.x, data.y, size * 1.65, 0, Math.PI * 2);
  context.fillStyle = data.baseColor || data.color || 'rgba(255,85,201,0.5)';
  context.globalAlpha = 0.5;
  context.fill();
  context.restore();
}

function drawOccurrenceScaledLabel(context, data, settings) {
  const label = data.label || data.origLabel;
  if (!label) return;

  const font = settings.labelFont || 'Arial, sans-serif';
  const fontWeight = settings.labelWeight || '700';
  const fontSize = data.labelSize || settings.labelSize || 12;
  const color = data.baseColor || data.color || '#FF55C9';

  context.save();
  context.font = `${fontWeight} ${fontSize}px ${font}`;
  const textWidth = context.measureText(label).width;
  const boxX = data.x + (data.size || 1) + 5;
  const boxY = data.y - fontSize / 2 - 4;
  const boxW = textWidth + 10;
  const boxH = fontSize + 8;

  context.globalAlpha = 0.5;
  context.fillStyle = color;
  context.fillRect(boxX, boxY, boxW, boxH);

  context.globalAlpha = 1;
  context.fillStyle = '#ffffff';
  context.textBaseline = 'middle';
  context.fillText(label, boxX + 5, data.y);
  context.restore();
}

function scheduleNetworkLabelsUpdate() {
  if (labelAnimationFrame) cancelAnimationFrame(labelAnimationFrame);
  labelAnimationFrame = requestAnimationFrame(updateNetworkLabels);
}

function updateNetworkLabels() {
  if (!sigmaInst || !theGraph || !labelLayer) return;
  if (typeof sigmaInst.graphToViewport !== 'function') return;

  labelLayer.innerHTML = '';
  const nodesToLabel = [];

  theGraph.forEachNode((node, attrs) => {
    if (attrs.hidden) return;
    const isHovered = node === hoveredNode;
    const isNeighbor = hoveredNeighbors.has(node);
    const shouldLabel = attrs.forceLabel || isHovered || isNeighbor;
    if (!shouldLabel) return;
    nodesToLabel.push({ node, attrs, isHovered, isNeighbor });
  });

  nodesToLabel
    .sort((a, b) => a.attrs.occ - b.attrs.occ)
    .forEach(({ node, attrs, isHovered, isNeighbor }) => {
      const viewport = sigmaInst.graphToViewport({
        x: theGraph.getNodeAttribute(node, 'x'),
        y: theGraph.getNodeAttribute(node, 'y')
      });

      const label = document.createElement('div');
      label.className = 'network-canvas-label';
      if (isHovered) label.classList.add('is-node-hovered');
      if (isNeighbor) label.classList.add('is-neighbor-label');
      label.dataset.node = node;
      label.textContent = attrs.origLabel || attrs.label;
      label.style.left = `${viewport.x}px`;
      label.style.top = `${viewport.y}px`;
      label.style.fontSize = `${attrs.labelSize}px`;
      label.style.setProperty('--label-color', attrs.baseColor || attrs.color || '#FF55C9');
      label.style.transform = `translate(${Math.max(attrs.size + 7, 10)}px, -50%)`;
      label.addEventListener('mouseenter', () => setHoveredNode(node));
      label.addEventListener('mouseleave', clearHoveredNode);
      label.addEventListener('click', () => {
        const cat = theGraph.getNodeAttribute(node, 'category');
        if (cat) setSelectedCategory(cat);
      });
      labelLayer.appendChild(label);
    });
}

function setHoveredNode(node) {
  if (!theGraph || !sigmaInst) return;
  if (hoverClearTimeout) clearTimeout(hoverClearTimeout);
  if (hoveredNode === node) {
    positionHoverTooltip(node);
    return;
  }
  hoveredNode = node;
  hoveredNeighbors = new Set(theGraph.neighbors(node));
  const label = theGraph.getNodeAttribute(node, 'origLabel') || theGraph.getNodeAttribute(node, 'label');
  const occ = theGraph.getNodeAttribute(node, 'occ');
  const color = theGraph.getNodeAttribute(node, 'baseColor') || theGraph.getNodeAttribute(node, 'color') || '#FF55C9';
  const hoverTooltip = document.querySelector('.network-node-tooltip');
  if (hoverTooltip) {
    hoverTooltip.innerHTML = `<strong>${label}</strong><span>${occ} occurrences</span>`;
    hoverTooltip.style.setProperty('--tooltip-color', color);
    hoverTooltip.classList.add('visible');
    hoverTooltip.setAttribute('aria-hidden', 'false');
    positionHoverTooltip(node);
  }
  sigmaInst.refresh();
  scheduleNetworkLabelsUpdate();
}

function positionHoverTooltip(node = hoveredNode) {
  const hoverTooltip = document.querySelector('.network-node-tooltip');
  const container = document.getElementById('graph-container');
  if (!node || !hoverTooltip || !container || !theGraph || !sigmaInst) return;
  if (typeof sigmaInst.graphToViewport !== 'function') return;

  const viewport = sigmaInst.graphToViewport({
    x: theGraph.getNodeAttribute(node, 'x'),
    y: theGraph.getNodeAttribute(node, 'y')
  });
  const nodeSize = Number(theGraph.getNodeAttribute(node, 'size') || 0);
  const offset = Math.max(nodeSize + 18, 24);

  requestAnimationFrame(() => {
    const tooltipWidth = hoverTooltip.offsetWidth || 120;
    const tooltipHeight = hoverTooltip.offsetHeight || 36;
    const minX = tooltipWidth / 2 + 10;
    const maxX = container.clientWidth - tooltipWidth / 2 - 10;
    const x = Math.max(minX, Math.min(maxX, viewport.x));
    let y = viewport.y + offset;

    if (y + tooltipHeight > container.clientHeight - 10) {
      y = viewport.y - offset - tooltipHeight;
    }

    hoverTooltip.style.left = `${x}px`;
    hoverTooltip.style.top = `${Math.max(10, y)}px`;
  });
}

function clearHoveredNode() {
  if (hoverClearTimeout) clearTimeout(hoverClearTimeout);
  hoverClearTimeout = setTimeout(() => {
  hoveredNode = null;
  hoveredNeighbors = new Set();
  const hoverTooltip = document.querySelector('.network-node-tooltip');
  if (hoverTooltip) {
    hoverTooltip.classList.remove('visible');
    hoverTooltip.setAttribute('aria-hidden', 'true');
  }
  if (sigmaInst) sigmaInst.refresh();
  scheduleNetworkLabelsUpdate();
  }, 80);
}

function occurrenceLabelSize(occ, minOcc, maxOcc) {
  const normalized = (occ - minOcc) / Math.max(1, maxOcc - minOcc);
  return 11 + Math.sqrt(Math.max(0, normalized)) * 14;
}

function nodeBaseSize(occ, minOcc, maxOcc) {
  const normalized = (occ - minOcc) / Math.max(1, maxOcc - minOcc);
  return 3 + normalized * 14;
}

/* ---- Build graphology graph from pre-loaded script data ---- */
function buildGraph() {
  const g = new graphology.Graph({ multi: false, type: 'undirected' });

  const visibleNodes = NETWORK_NODES.filter(n => n[6] >= MIN_VISIBLE_OCCURRENCES);
  const occs = visibleNodes.map(n => n[6]);
  const minOcc = Math.min(...occs);
  const maxOcc = Math.max(...occs);

  // [key, label, category, color, x, y, occurrences]
  visibleNodes.forEach(([key, label, category, color, x, y, occ]) => {
    const baseSize = nodeBaseSize(occ, minOcc, maxOcc);
    const labelSize = occurrenceLabelSize(occ, minOcc, maxOcc);
    g.addNode(key, {
      label,
      origLabel: label,   /* preserve — label is overwritten to '' on filter */
      x,
      y,
      size: baseSize,
      baseSize,
      labelSize,
      color,
      baseColor: color,
      category,
      occ,
      forceLabel: occ >= 45
    });
  });

  NETWORK_EDGES.forEach(([src, tgt]) => {
    if (g.hasNode(src) && g.hasNode(tgt) && !g.hasEdge(src, tgt)) {
      try { g.addEdge(src, tgt, { color: '#1c1c1c', size: 0.3 }); } catch (_) {}
    }
  });

  return g;
}

/* ---- Apply category filter by modifying node attributes directly ---- */
function applyFilter(cat) {
  if (!theGraph) return;

  theGraph.forEachNode((node, attrs) => {
    /* FIX: use origLabel (never overwritten) instead of attrs.label which
       gets set to '' for non-category nodes and then is falsy on reset. */
    const lbl = attrs.origLabel || attrs.label;
    if (!cat) {
      theGraph.setNodeAttribute(node, 'color', attrs.baseColor);
      theGraph.setNodeAttribute(node, 'size', attrs.baseSize);
      theGraph.setNodeAttribute(node, 'label', lbl);
      theGraph.setNodeAttribute(node, 'forceLabel', attrs.occ >= 45);
      theGraph.setNodeAttribute(node, 'hidden', false);
    } else if (attrs.category === cat) {
      theGraph.setNodeAttribute(node, 'color', attrs.baseColor);
      theGraph.setNodeAttribute(node, 'size', attrs.baseSize * 1.5);
      theGraph.setNodeAttribute(node, 'label', lbl);
      theGraph.setNodeAttribute(node, 'forceLabel', attrs.occ >= 20);
      theGraph.setNodeAttribute(node, 'hidden', false);
    } else {
      theGraph.setNodeAttribute(node, 'color', '#00000000');
      theGraph.setNodeAttribute(node, 'size', 0);
      theGraph.setNodeAttribute(node, 'label', '');
      theGraph.setNodeAttribute(node, 'forceLabel', false);
      theGraph.setNodeAttribute(node, 'hidden', true);
    }
  });

  theGraph.forEachEdge((edge, attrs, src, tgt) => {
    if (!cat) {
      theGraph.setEdgeAttribute(edge, 'hidden', false);
    } else {
      const srcCat = theGraph.getNodeAttribute(src, 'category');
      const tgtCat = theGraph.getNodeAttribute(tgt, 'category');
      theGraph.setEdgeAttribute(edge, 'hidden', srcCat !== cat || tgtCat !== cat);
    }
  });

  if (sigmaInst) sigmaInst.refresh();
  scheduleNetworkLabelsUpdate();
}

/* ---- Node-size legend ---- */
(function () {
  const occs    = NETWORK_NODES
    .filter(n => n[6] >= MIN_VISIBLE_OCCURRENCES)
    .map(n => n[6]);
  const minOcc  = Math.min(...occs);
  const maxOcc  = Math.max(...occs);

  /* Three representative values: high, mid, low */
  const midOcc = Math.round(minOcc + (maxOcc - minOcc) * 0.5);
  const LEGEND_ITEMS = [maxOcc, midOcc, minOcc].map(occ => ({
    occ,
    size: nodeBaseSize(occ, minOcc, maxOcc)
  }));

  window.updateSizeLegend = function () {
    const el = document.getElementById('nsl-items');
    if (!el) return;

    el.innerHTML = '';
    LEGEND_ITEMS.forEach(({ occ, size }) => {
      const r  = Math.max(3, Math.min(22, size));   /* radius px, same base scale as Sigma nodes */
      const d  = Math.round(r * 2);

      const row    = document.createElement('div');
      row.className = 'nsl-row';

      const circle = document.createElement('div');
      circle.className = 'nsl-circle';
      circle.style.width  = d + 'px';
      circle.style.height = d + 'px';

      const lbl = document.createElement('span');
      lbl.className   = 'nsl-label';
      lbl.textContent = occ + ' occ.';

      row.appendChild(circle);
      row.appendChild(lbl);
      el.appendChild(row);
    });
  };
})();

/* ---- Start Sigma ---- */
function startNetwork() {
  const container = document.getElementById('graph-container');
  if (!container || sigmaInst) return;

  theGraph = buildGraph();

  const hoverTooltip = document.createElement('div');
  hoverTooltip.className = 'network-node-tooltip';
  hoverTooltip.setAttribute('aria-hidden', 'true');
  container.appendChild(hoverTooltip);

  labelLayer = document.createElement('div');
  labelLayer.className = 'network-label-layer';
  container.appendChild(labelLayer);

  sigmaInst = new Sigma(theGraph, container, {
    allowInvalidContainer: true,
    renderEdgeLabels: false,
    labelColor: { color: '#e6e6e6ff' },
    labelSize: 13,
    labelWeight: '700',
    labelFont: '"ABC Diatype", Arial, sans-serif',
    labelRenderedSizeThreshold: 3.2,
    labelDensity: 1.45,
    labelGridCellSize: 92,
    zIndex: true,
    hideEdgesOnMove: true,
    hideLabelsOnMove: false,
    doubleClickZoomingDuration: 420,
    doubleClickZoomingRatio: 1.6,
    zoomDuration: 260,
    defaultNodeColor: '#888888',
    defaultEdgeColor: '#a5a5a5ff',
    defaultDrawNodeHover: drawDarkNodeHover,
    labelRenderer: () => {},
    nodeLabelRenderer: () => {},
    hoverRenderer: drawDarkNodeHover,
    nodeHoverRenderer: drawDarkNodeHover,
    defaultDrawNodeLabel: () => {},
    nodeReducer: (node, data) => {
      if (!hoveredNode) return data;

      const isHovered = node === hoveredNode;
      const isNeighbor = hoveredNeighbors.has(node);

      if (isHovered || isNeighbor) {
        return {
          ...data,
          zIndex: 1,
          size: isHovered ? data.size * 1.12 : data.size,
          label: data.forceLabel ? (data.origLabel || data.label) : '',
          forceLabel: data.forceLabel
        };
      }

      return {
        ...data,
        color: '#00000000',
        label: '',
        size: 0,
        hidden: true,
        forceLabel: false
      };
    },
    edgeReducer: (edge, data) => {
      if (!hoveredNode) return data;

      const source = theGraph.source(edge);
      const target = theGraph.target(edge);
      const isConnected = source === hoveredNode || target === hoveredNode;

      if (isConnected) {
        return {
          ...data,
          color: '#6f6f6fff',
          size: Math.max((data.size || 0.3) * 2, 1),
          zIndex: 1
        };
      }

      return {
        ...data,
        color: '#0d0d0d',
        size: 0,
        hidden: true
      };
    },
    minCameraRatio: 0.02,
    maxCameraRatio: 20
  });

  sigmaInst.refresh();
  scheduleNetworkLabelsUpdate();

  /* Initial legend render + update on every camera move */
  updateSizeLegend();
  sigmaInst.getCamera().on('updated', () => {
    updateSizeLegend();
    scheduleNetworkLabelsUpdate();
    positionHoverTooltip();
  });

  sigmaInst.on('clickNode', ({ node }) => {
    const cat = theGraph.getNodeAttribute(node, 'category');
    if (cat) setSelectedCategory(cat);
  });

  sigmaInst.on('enterNode', ({ node }) => {
    setHoveredNode(node);
    container.style.cursor = 'pointer';
  });

  sigmaInst.on('leaveNode', () => {
    clearHoveredNode();
    container.style.cursor = '';
  });

  initNetworkZoomControls();
}

function zoomNetworkBy(multiplier) {
  if (!sigmaInst) return;
  const camera = sigmaInst.getCamera();
  const state = camera.getState();
  const nextRatio = Math.max(0.02, Math.min(20, state.ratio * multiplier));
  camera.animate({ ratio: nextRatio }, { duration: 220 });
}

function resetNetworkZoom() {
  if (!sigmaInst) return;
  sigmaInst.getCamera().animate({ x: 0.5, y: 0.5, ratio: 1 }, { duration: 320 });
}

function initNetworkZoomControls() {
  document.getElementById('networkZoomIn')?.addEventListener('click', () => zoomNetworkBy(0.72));
  document.getElementById('networkZoomOut')?.addEventListener('click', () => zoomNetworkBy(1.28));
  document.getElementById('networkZoomReset')?.addEventListener('click', resetNetworkZoom);
}


/* ---- Boot: try to init once container has size ---- */
function tryBoot() {
  const container = document.getElementById('graph-container');
  if (!container || sigmaInst) return !!sigmaInst;
  if (container.offsetWidth > 0 && container.offsetHeight > 0) {
    startNetwork();
    return true;
  }
  return false;
}

if (!tryBoot()) {
  const ro = new ResizeObserver(() => { if (tryBoot()) ro.disconnect(); });
  ro.observe(document.getElementById('graph-container'));

  let n = 0;
  const t = setInterval(() => { if (tryBoot() || ++n > 30) clearInterval(t); }, 200);
}

function setSelectedCategory(cat) {
  if (!cat) {
    selectedCat = null;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    showDefaultLeft();
    applyFilter(null);
    return;
  }

  selectedCat = cat;
  document.querySelectorAll('.cat-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.cat === cat);
  });
  showCategoryLeft(cat);
  applyFilter(cat);
}

/* ---- Category button wiring ---- */
document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const cat = btn.dataset.cat;
    if (selectedCat === cat) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(cat);
    }
  });
});

/* ---- Left panel ---- */
function showDefaultLeft() {
  document.getElementById('left-default').style.display = '';
  document.getElementById('left-category').style.display = 'none';
}

function showCategoryLeft(catName) {
  document.getElementById('left-default').style.display = 'none';
  document.getElementById('left-category').style.display = '';

  const meta = CATEGORY_META[catName];
  const nameEl = document.getElementById('left-cat-name');
  nameEl.textContent = 'Click on key hashtags to explore the most engaged images for this category';
  nameEl.style.color = '#ffffffff';

  /* ---- Top 3 hashtags ---- */
  const tagsEl = document.getElementById('left-tags');
  tagsEl.innerHTML = '';
  const topThreeTags = meta.topTags.slice(0, 3);
  const firstTag = topThreeTags[0] ? topThreeTags[0][0].replace(/^#/, '') : null;

  topThreeTags.forEach(([tag, count], index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'network-tag-pill';
    if (index === 0) button.classList.add('active');
    button.style.setProperty('--tag-accent', meta.hex);
    button.dataset.tag = tag.replace(/^#/, '');
    button.innerHTML = `<span class="network-tag-name">${tag}<sup>${count}</sup></span>`;
    button.addEventListener('click', () => {
      tagsEl.querySelectorAll('.network-tag-pill').forEach(el => el.classList.remove('active'));
      button.classList.add('active');
      renderCategoryPosts(catName, button.dataset.tag);
    });
    tagsEl.appendChild(button);
  });

  renderCategoryPosts(catName, firstTag);
}

function renderCategoryPosts(catName, selectedTag) {
  const meta = CATEGORY_META[catName];
  const postsEl = document.getElementById('left-posts');
  postsEl.innerHTML = '';

  const allPosts = (typeof NETWORK_POSTS !== 'undefined' && NETWORK_POSTS[catName]) || [];
  const posts = selectedTag
    ? allPosts.filter(post => (post.hashtag || '').replace(/^#/, '').toLowerCase() === selectedTag.toLowerCase())
    : allPosts;

  if (posts.length === 0) return;

  posts.forEach(post => {
    const card = document.createElement('div');
    card.className = 'post-card';
    card.style.setProperty('--cat-hex', meta.hex);

    /* username */
    const user = document.createElement('div');
    user.className = 'post-card-username';
    user.textContent = post.username;
    card.appendChild(user);

    /* image */
    const imgWrap = document.createElement('div');
    imgWrap.className = 'post-card-img';
    const img = document.createElement('img');
    img.src = encodeURI(post.image);
    img.alt = '';
    img.loading = 'lazy';
    imgWrap.appendChild(img);
    card.appendChild(imgWrap);

    /* metrics row */
    const metrics = document.createElement('div');
    metrics.className = 'post-card-metrics';

    const likesWrap = document.createElement('div');
    likesWrap.className = 'post-card-metric';
    likesWrap.innerHTML = `<span class="metric-num">${post.likes.toLocaleString()}</span><span class="metric-lbl">LIKES</span>`;

    const commWrap = document.createElement('div');
    commWrap.className = 'post-card-metric';
    commWrap.innerHTML = `<span class="metric-num">${post.comments.toLocaleString()}</span><span class="metric-lbl">COMMENTS</span>`;

    metrics.appendChild(likesWrap);
    metrics.appendChild(commWrap);
    card.appendChild(metrics);

    /* caption */
    if (post.caption) {
      const cap = document.createElement('p');
      cap.className = 'post-card-caption';
      cap.textContent = post.caption;
      card.appendChild(cap);
    }

    postsEl.appendChild(card);
  });
}

/* ---- Navbar active state on scroll ---- */
(function initNavScroll() {
  const networkSection = document.getElementById('network');
  const navLinks = document.querySelectorAll('.sidenav-link');
  if (!networkSection) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const networkLink = document.querySelector('.sidenav-link[href="network.html"], .sidenav-link[href="#network"]');
        const introLink   = document.querySelector('.sidenav-link[href="#intro"]');
        if (!networkLink || !introLink) return;
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('active'));
          networkLink.classList.add('active');
        } else {
          /* Only restore intro active if we scrolled above the network */
          const rect = networkSection.getBoundingClientRect();
          if (rect.top > 0) {
            navLinks.forEach(l => l.classList.remove('active'));
            introLink.classList.add('active');
          }
        }
      });
    },
    { threshold: 0.1 }
  );

  observer.observe(networkSection);
})();

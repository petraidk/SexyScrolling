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
let hoverIntentTimeout = null;
let cameraIdleTimeout = null;
let cameraMoving = false;
let pointerDown = false;
let pinnedNode = null;
let showAllConnections = false;
let connectionCanvas = null;
let connectionFrame = null;
let connectionStart = 0;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const FOCUS_CONNECTION_LIMIT = 12;
const labelElements = new Map();
const labelMeasureContext = document.createElement('canvas').getContext('2d');

function drawDarkNodeHover(context, data) {
  if (cameraMoving || pointerDown) return;
  const size = data.size || 1;
  context.save();
  context.beginPath();
  context.arc(data.x, data.y, size * 1.65, 0, Math.PI * 2);
  context.fillStyle = data.baseColor || data.color || 'rgba(255,85,201,0.5)';
  context.globalAlpha = 0.5;
  context.fill();
  context.restore();
}

function scheduleNetworkLabelsUpdate() {
  if (labelAnimationFrame !== null) return;
  labelAnimationFrame = requestAnimationFrame(() => {
    labelAnimationFrame = null;
    updateNetworkLabels();
  });
}

function labelPositions(point, offset, width, height) {
  return [
    { x: point.x + offset, y: point.y - height / 2 },
    { x: point.x - offset - width, y: point.y - height / 2 },
    { x: point.x - width / 2, y: point.y - offset - height },
    { x: point.x - width / 2, y: point.y + offset },
    { x: point.x + offset, y: point.y - offset - height },
    { x: point.x - offset - width, y: point.y - offset - height },
    { x: point.x + offset, y: point.y + offset },
    { x: point.x - offset - width, y: point.y + offset }
  ];
}

function updateNetworkLabels() {
  if (!sigmaInst || !theGraph || !labelLayer) return;
  // Keep the same labels during navigation: only move existing DOM elements.
  // Reconsider density and collisions once the camera settles.
  if (cameraMoving || pointerDown) {
    for (const [node, label] of labelElements) {
      const attrs = theGraph.getNodeAttributes(node);
      if (attrs.hidden) { label.style.visibility = 'hidden'; continue; }
      label.style.visibility = '';
      const point = sigmaInst.graphToViewport(attrs);
      const offset = sigmaInst.scaleSize(sigmaInst.getNodeDisplayData(node)?.size || attrs.size) + 7;
      const position = labelPositions(point, offset, Number(label.dataset.width), Number(label.dataset.height))[Number(label.dataset.side)];
      label.style.transform = `translate(${position.x}px, ${position.y}px)`;
    }
    return;
  }
  const container = document.getElementById('graph-container');
  const width = container.clientWidth;
  const height = container.clientHeight;
  const ratio = sigmaInst.getCamera().getState().ratio;
  // Reveal more names as the user zooms in, with a strict screen-space budget.
  const budget = Math.min(42, Math.max(8, Math.round((selectedCat ? 16 : 12) / Math.sqrt(ratio))));
  const candidates = [];
  theGraph.forEachNode((node, attrs) => {
    if (attrs.hidden || (hoveredNode && node !== hoveredNode && !hoveredNeighbors.has(node))) return;
    candidates.push({ node, attrs });
  });
  candidates.sort((a, b) => Number(b.node === hoveredNode) - Number(a.node === hoveredNode) || b.attrs.occ - a.attrs.occ);
  const boxes = [
    { x: 0, y: 0, w: width, h: 85 },
    { x: 0, y: height - 175, w: 170, h: 175 }
  ];
  const visible = new Set();
  for (const { node, attrs } of candidates) {
    if (visible.size >= (hoveredNode ? Math.min(8, budget) : budget)) break;
    const point = sigmaInst.graphToViewport(attrs);
    if (point.x < 0 || point.y < 0 || point.x > width || point.y > height) continue;
    const isFocused = node === hoveredNode;
    const size = hoveredNode && !isFocused ? 12 : Math.min(17, attrs.labelSize);
    const text = attrs.origLabel || attrs.label;
    labelMeasureContext.font = `700 ${size}px "ABC Diatype", Arial, sans-serif`;
    let w = labelMeasureContext.measureText(text).width + 12;
    const detail = `${attrs.occ} occurrences`;
    if (isFocused) {
      labelMeasureContext.font = '500 10px "ABC Diatype", Arial, sans-serif';
      w = Math.max(w, labelMeasureContext.measureText(detail).width + 12);
    }
    const h = size + 7 + (isFocused ? 16 : 0);
    const displaySize = sigmaInst.getNodeDisplayData(node)?.size || attrs.size;
    const offset = sigmaInst.scaleSize(displaySize) + 7;
    const existing = labelElements.get(node);
    const preferred = Number(existing?.dataset.side || 0);
    const positions = labelPositions(point, offset, w, h);
    const sides = [preferred, ...positions.map((_, index) => index).filter(side => side !== preferred)];
    const side = sides.find(index => {
      const { x, y } = positions[index];
      return x >= 8 && y >= 8 && x + w <= width - 8 && y + h <= height - 8 &&
        !boxes.some(b => x < b.x + b.w + 8 && x + w + 8 > b.x && y < b.y + b.h + 6 && y + h + 6 > b.y);
    });
    if (side === undefined) continue;
    const { x, y } = positions[side];
    boxes.push({ x, y, w, h });
    visible.add(node);
    let label = labelElements.get(node);
    if (!label) {
      label = document.createElement('div');
      label.dataset.node = node;
      const name = document.createElement('span');
      name.className = 'network-label-name';
      name.textContent = text;
      const occurrences = document.createElement('span');
      occurrences.className = 'network-label-occurrences';
      occurrences.textContent = detail;
      label.append(name, occurrences);
      labelLayer.appendChild(label);
      labelElements.set(node, label);
    }
    label.className = 'network-canvas-label' + (node === hoveredNode ? ' is-node-hovered' : hoveredNode ? ' is-neighbor-label' : '');
    label.style.setProperty('--label-color', attrs.baseColor || attrs.color);
    label.dataset.side = side;
    label.dataset.width = w;
    label.dataset.height = h;
    label.style.visibility = '';
    label.style.fontSize = `${size}px`;
    label.style.transform = `translate(${x}px, ${y}px)`;
  }
  for (const [node, label] of labelElements) {
    if (!visible.has(node)) {
      label.remove();
      labelElements.delete(node);
    }
  }
}

function setHoveredNode(node) {
  if (!theGraph || !sigmaInst || cameraMoving || pointerDown) return;
  if (hoveredNode === node) return;
  hoveredNode = node;
  const neighbors = theGraph.neighbors(node).filter(key => !theGraph.getNodeAttribute(key, 'hidden'));
  const origin = theGraph.getNodeAttributes(node);
  neighbors.sort((a, b) => {
    const aa = theGraph.getNodeAttributes(a), bb = theGraph.getNodeAttributes(b);
    return Math.hypot(aa.x - origin.x, aa.y - origin.y) - Math.hypot(bb.x - origin.x, bb.y - origin.y);
  });
  hoveredNeighbors = new Set(showAllConnections ? neighbors : neighbors.slice(0, FOCUS_CONNECTION_LIMIT));
  startConnectionAnimation();
  updateConnectionStatus(neighbors.length);
  sigmaInst.refresh();
  scheduleNetworkLabelsUpdate();
}

function clearHoveredNode(force = false) {
  clearTimeout(hoverIntentTimeout);
  if (pinnedNode && !force) return;
  pinnedNode = null;
  const hadHover = hoveredNode !== null;
  hoveredNode = null;
  hoveredNeighbors.clear();
  stopConnectionAnimation();
  updateConnectionStatus();
  document.getElementById('graph-container').style.cursor = '';
  if (hadHover && sigmaInst) sigmaInst.refresh();
  scheduleNetworkLabelsUpdate();
}

function suspendNetworkHover() {
  cameraMoving = true;
  clearHoveredNode();
  scheduleNetworkLabelsUpdate();
  clearTimeout(cameraIdleTimeout);
  cameraIdleTimeout = setTimeout(() => {
    cameraMoving = false;
    if (!pointerDown) {
      scheduleNetworkLabelsUpdate();
      if (hoveredNode) {
        drawConnections(performance.now());
      }
    }
  }, 160);
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

  // A sparse overview uses only existing, short links, not inferred edge weights.
  const edges = [];
  g.forEachEdge((edge, attrs, source, target) => {
    const a = g.getNodeAttributes(source), b = g.getNodeAttributes(target);
    edges.push({ edge, source, target, distance: Math.hypot(a.x - b.x, a.y - b.y) });
  });
  edges.sort((a, b) => a.distance - b.distance);
  const degree = new Map();
  let count = 0;
  for (const { edge, source, target } of edges) {
    const a = degree.get(source) || 0, b = degree.get(target) || 0;
    if (count >= 220 || a >= 3 || b >= 3) continue;
    g.setEdgeAttribute(edge, 'overview', true);
    degree.set(source, a + 1);
    degree.set(target, b + 1);
    count++;
  }
  return g;
}

/* ---- Apply category filter by modifying node attributes directly ---- */
function applyFilter(cat) {
  if (!theGraph) return;
  clearHoveredNode(true);

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
    renderLabels: false,
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
          size: data.size,
          label: data.forceLabel ? (data.origLabel || data.label) : '',
          forceLabel: data.forceLabel
        };
      }

      return {
        ...data,
        color: '#292929',
        label: '',
        forceLabel: false
      };
    },
    edgeReducer: (edge, data) => ({
      ...data,
      hidden: data.hidden || !!hoveredNode || (!showAllConnections && !data.overview),
      color: showAllConnections ? '#191919' : '#343434',
      size: 0.45
    }),
    minCameraRatio: 0.02,
    maxCameraRatio: 20
  });

  sigmaInst.refresh();
  scheduleNetworkLabelsUpdate();

  updateSizeLegend();
  sigmaInst.getCamera().on('updated', suspendNetworkHover);
  sigmaInst.on('afterRender', () => {
    scheduleNetworkLabelsUpdate();
    if (hoveredNode) drawConnections(performance.now());
  });
  container.addEventListener('wheel', suspendNetworkHover, { passive: true });
  container.addEventListener('pointerdown', event => {
    if (event.target.closest('.network-connection-tools, .network-zoom-tools')) return;
    pointerDown = true;
    suspendNetworkHover();
  });
  const endPointer = () => {
    if (!pointerDown) return;
    pointerDown = false;
    suspendNetworkHover();
  };
  window.addEventListener('pointerup', endPointer);
  window.addEventListener('pointercancel', endPointer);
  window.addEventListener('blur', () => {
    endPointer();
    clearHoveredNode();
  });
  container.addEventListener('pointerleave', () => clearHoveredNode());
  document.fonts.ready.then(scheduleNetworkLabelsUpdate);

  sigmaInst.on('clickNode', ({ node }) => {
    if (pinnedNode === node) { clearHoveredNode(true); return; }
    clearHoveredNode(true);
    cameraMoving = false;
    pointerDown = false;
    setHoveredNode(node);
    pinnedNode = node;
    updateConnectionStatus();
  });

  sigmaInst.on('enterNode', ({ node }) => {
    clearTimeout(hoverIntentTimeout);
    if (cameraMoving || pointerDown || pinnedNode) return;
    hoverIntentTimeout = setTimeout(() => {
      setHoveredNode(node);
      if (hoveredNode === node) container.style.cursor = 'pointer';
    }, 120);
  });

  sigmaInst.on('leaveNode', () => {
    clearHoveredNode();
    container.style.cursor = '';
  });

  container.querySelectorAll('.network-connection-tools, .network-zoom-tools').forEach(control => {
    ['mousedown', 'mouseup', 'click', 'dblclick'].forEach(type => {
      control.addEventListener(type, event => event.stopPropagation());
    });
  });
  sigmaInst.on('clickStage', ({ event }) => {
    if (event.original?.target?.closest?.('.network-connection-tools, .network-zoom-tools')) return;
    clearHoveredNode(true);
  });
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') clearHoveredNode(true);
  });
  connectionCanvas = document.createElement('canvas');
  connectionCanvas.className = 'network-connections';
  connectionCanvas.setAttribute('aria-hidden', 'true');
  container.appendChild(connectionCanvas);
  document.getElementById('networkConnections')?.addEventListener('click', event => {
    showAllConnections = !showAllConnections;
    event.currentTarget.setAttribute('aria-pressed', String(showAllConnections));
    event.currentTarget.textContent = showAllConnections ? 'All links' : 'Essential links';
    const current = hoveredNode;
    if (current) { hoveredNode = null; setHoveredNode(current); }
    sigmaInst.refresh();
    updateConnectionStatus();
  });
  initNetworkZoomControls();
}

function updateConnectionStatus(total) {
  const el = document.getElementById('network-connection-status');
  if (!el) return;
  if (!hoveredNode) {
    el.textContent = showAllConnections ? 'All connections · hover to explore' : 'Essential links · hover to explore · click to hold';
    return;
  }
  const count = total ?? theGraph.neighbors(hoveredNode).filter(n => !theGraph.getNodeAttribute(n, 'hidden')).length;
  el.textContent = `${hoveredNeighbors.size} of ${count} links${showAllConnections ? '' : ' · nearest first'}${pinnedNode ? ' · click background to release' : ' · click to hold'}`;
}

function stopConnectionAnimation() {
  cancelAnimationFrame(connectionFrame);
  connectionFrame = null;
  if (connectionCanvas) connectionCanvas.getContext('2d').clearRect(0, 0, connectionCanvas.width, connectionCanvas.height);
}

function startConnectionAnimation() {
  stopConnectionAnimation();
  connectionStart = performance.now();
  const tick = time => {
    if (!hoveredNode || !connectionCanvas) return;
    drawConnections(time);
    // Animate only the small overlay; never reprocess the graph on each frame.
    if (!reducedMotion.matches && !document.hidden) connectionFrame = requestAnimationFrame(tick);
  };
  connectionFrame = requestAnimationFrame(tick);
}

function drawConnections(time) {
  if (!connectionCanvas || !hoveredNode) return;
  const container = document.getElementById('graph-container');
  const width = container.clientWidth, height = container.clientHeight;
  const dpr = window.devicePixelRatio || 1;
  if (connectionCanvas.width !== Math.round(width * dpr) || connectionCanvas.height !== Math.round(height * dpr)) {
    connectionCanvas.width = Math.round(width * dpr);
    connectionCanvas.height = Math.round(height * dpr);
  }
  const ctx = connectionCanvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  if (cameraMoving || pointerDown) return;
  const origin = theGraph.getNodeAttributes(hoveredNode);
  const a = sigmaInst.graphToViewport(origin);
  const progress = reducedMotion.matches ? 1 : Math.min(1, (time - connectionStart) / 380);
  ctx.lineWidth = 1;
  ctx.strokeStyle = origin.baseColor;
  ctx.fillStyle = origin.baseColor;
  for (const node of hoveredNeighbors) {
    const b = sigmaInst.graphToViewport(theGraph.getNodeAttributes(node));
    ctx.globalAlpha = 0.42 * progress;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(a.x + (b.x - a.x) * progress, a.y + (b.y - a.y) * progress);
    ctx.stroke();
    if (!reducedMotion.matches && !showAllConnections) {
      const t = ((time - connectionStart) % 2400) / 2400;
      ctx.globalAlpha = 0.85 * progress;
      ctx.beginPath();
      ctx.arc(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, 1.7, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 0.65;
  ctx.beginPath();
  ctx.arc(a.x, a.y, sigmaInst.scaleSize(origin.size) + 5, 0, Math.PI * 2);
  ctx.stroke();
}

function frameCategory(cat) {
  const points = [];
  theGraph.forEachNode((node, attrs) => {
    if (attrs.category === cat) points.push(sigmaInst.getNodeDisplayData(node));
  });
  if (!points.length) return;
  const xs = points.map(p => p.x), ys = points.map(p => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const container = document.getElementById('graph-container');
  const shortest = Math.min(container.clientWidth, container.clientHeight);
  const ratio = Math.max(0.18, Math.min(1.4, Math.max((maxX - minX) * shortest / container.clientWidth, (maxY - minY) * shortest / container.clientHeight) * 1.35));
  suspendNetworkHover();
  sigmaInst.getCamera().animate({ x: (minX + maxX) / 2, y: (minY + maxY) / 2, ratio }, { duration: reducedMotion.matches ? 0 : 650 });
}

function zoomNetworkBy(multiplier) {
  if (!sigmaInst) return;
  const camera = sigmaInst.getCamera();
  const state = camera.getState();
  const nextRatio = Math.max(0.02, Math.min(20, state.ratio * multiplier));
  suspendNetworkHover();
  camera.animate({ ratio: nextRatio }, { duration: 220 });
}

function resetNetworkZoom() {
  if (!sigmaInst) return;
  suspendNetworkHover();
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
    resetNetworkZoom();
    return;
  }

  selectedCat = cat;
  document.querySelectorAll('.cat-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.cat === cat);
  });
  showCategoryLeft(cat);
  applyFilter(cat);
  frameCategory(cat);
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

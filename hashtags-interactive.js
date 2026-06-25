(function () {
  /*
    Interactive bipartite network for hashtags and images.

    The data comes from Gephi/GEXF preprocessing:
    - image nodes are rendered as HTML thumbnails on top of Sigma's canvas
    - hashtag nodes and edges are rendered by Sigma
    - Gephi x/y coordinates are kept, so the spatial organization is preserved
  */
  const data = window.HASHTAG_BIPARTITE_DATA;
  const container = document.getElementById('hashtagsGraph');
  const thumbnailLayer = document.getElementById('hashtagsThumbnails');
  const labelLayer = document.createElement('div');
  const inspector = document.getElementById('hashtagsInspector');
  const inspectorTitle = document.getElementById('hashtagsInspectorTitle');
  const inspectorText = document.getElementById('hashtagsInspectorText');
  const inspectorTags = document.getElementById('hashtagsInspectorTags');
  const inspectorImages = document.getElementById('hashtagsInspectorImages');
  const recurringToggle = document.getElementById('hashtagsRecurring');

  if (!data || !container || !thumbnailLayer || typeof graphology === 'undefined' || typeof Sigma === 'undefined') return;
  labelLayer.className = 'hashtags-label-overlay';

  // Fragment colors. Change these values if you want a different color system.
  const FRAGMENT_META = {
    Feet: { label: 'Feet', color: '#ccff00' },
    Legs: { label: 'Legs', color: '#ff009d' },
    Butt: { label: 'Glutes', color: '#ff2529' },
    Other: { label: 'Other', color: '#777777' }
  };

  const graph = new graphology.Graph({ type: 'undirected', multi: false });
  const visibleState = { fragment: 'All', recurringOnly: false };
  let hoveredNode = null;
  let selectedNode = null;
  let hoveredNeighborhood = new Set();
  let visibleNodes = new Set();
  let renderer = null;

  // Utility: in this dataset, image nodes are marked with attr_type=image_id.
  function isImage(node) {
    return node.type === 'image_id';
  }

  function fragmentColor(fragment) {
    return (FRAGMENT_META[fragment] || FRAGMENT_META.Other).color;
  }

  function displayFragment(fragment) {
    return (FRAGMENT_META[fragment] || FRAGMENT_META.Other).label;
  }

  function connectedImageIds(nodeId) {
    if (!graph.hasNode(nodeId)) return [];
    return graph.neighbors(nodeId).filter(id => graph.getNodeAttribute(id, 'kind') === 'image');
  }

  function getImageSource(attrs) {
    const filename = attrs.image || '';
    const fragment = String(attrs.fragment || '').toLowerCase();

    if (fragment === 'butt' || fragment === 'glutes') return 'image%20atlas/butt/BUTT/' + encodeURIComponent(filename);
    if (fragment === 'legs') return 'image%20atlas/Legs/legs/' + encodeURIComponent(filename);
    if (fragment === 'feet') return 'image%20atlas/Feet/feet/' + encodeURIComponent(filename);

    return 'hashtag-images/' + encodeURIComponent(filename);
  }

  function connectedHashtagIds(nodeId) {
    if (!graph.hasNode(nodeId)) return [];
    return graph.neighbors(nodeId).filter(id => graph.getNodeAttribute(id, 'kind') === 'hashtag');
  }

  // Decides whether a node should remain visible after filters are applied.
  function nodePassesFilters(nodeId) {
    const attrs = graph.getNodeAttributes(nodeId);
    if (attrs.kind === 'image') {
      if (visibleState.fragment !== 'All' && attrs.fragment !== visibleState.fragment) return false;
      if (!visibleState.recurringOnly) return true;
      return connectedHashtagIds(nodeId).some(tagId => graph.getNodeAttribute(tagId, 'occ') >= 20);
    }

    if (!visibleState.recurringOnly) return true;
    return attrs.occ >= 20;
  }

  function recomputeVisibleNodes() {
    visibleNodes = new Set();
    graph.forEachNode(node => {
      if (nodePassesFilters(node)) visibleNodes.add(node);
    });
  }

  // Converts the exported GEXF data into a Graphology graph used by Sigma.
  function buildGraph() {
    data.nodes.forEach(node => {
      const kind = isImage(node) ? 'image' : 'hashtag';
      const size = kind === 'image' ? 4.5 : Math.max(2, Math.min(10, 2 + Math.sqrt(node.occ || 1) * 0.7));
      graph.addNode(node.id, {
        label: kind === 'hashtag' ? node.label : '',
        fullLabel: node.label,
        kind,
        fragment: node.fragment || 'Other',
        image: node.image || '',
        occ: Number(node.occ || 1),
        x: Number(node.x || 0),
        y: Number(node.y || 0),
        size,
        baseSize: size,
        color: kind === 'image' ? fragmentColor(node.fragment) : '#f2f2f2'
      });
    });

    data.edges.forEach(edge => {
      if (!graph.hasNode(edge.source) || !graph.hasNode(edge.target)) return;
      if (graph.hasEdge(edge.source, edge.target)) return;
      graph.addEdgeWithKey(edge.id, edge.source, edge.target, { color: '#353535', size: 0.22 });
    });
  }

  /*
    Places HTML thumbnails over the Sigma canvas.
    This is what makes image nodes visible as actual images while Sigma still
    handles pan, zoom, hover, labels and edges.
  */
  function updateThumbnailLayer() {
    if (!renderer) return;
    const ratio = renderer.getCamera().ratio;
    const active = hoveredNode || selectedNode;
    const activeSet = active ? new Set([active, ...graph.neighbors(active)]) : null;
    const viewport = container.getBoundingClientRect();
    const viewportCenter = { x: viewport.width / 2, y: viewport.height / 2 };

    /*
      Image spread / faux 3D effect.

      This does NOT move graph nodes or edges. It only offsets the HTML image
      thumbnails away from the viewport center as the user zooms in, so dense
      image clusters open up and overlap less.

      Tweak these two values:
      - THUMBNAIL_SPREAD_STRENGTH: higher = images separate more
      - THUMBNAIL_SPREAD_MAX: maximum pixel offset so the effect stays controlled
    */
    const THUMBNAIL_SPREAD_STRENGTH = 46;
    const THUMBNAIL_SPREAD_MAX = 72;
    const zoomDepth = Math.max(0, Math.min(1, (1 / Math.max(ratio, 0.05) - 1) / 5));

    graph.forEachNode((node, attrs) => {
      if (attrs.kind !== 'image' || !attrs.thumbEl) return;
      const hiddenByFilter = !visibleNodes.has(node);
      const hiddenByHover = activeSet && !activeSet.has(node);
      const pos = renderer.graphToViewport({ x: attrs.x, y: attrs.y });
      const base = active === node ? 76 : 38;
      const width = Math.max(24, Math.min(98, base / Math.sqrt(Math.max(ratio, 0.04))));
      const imageRatio = attrs.imageRatio || 1;
      const height = Math.max(22, Math.min(112, width / imageRatio));
      const dx = pos.x - viewportCenter.x;
      const dy = pos.y - viewportCenter.y;
      const distance = Math.max(1, Math.sqrt(dx * dx + dy * dy));
      const spread = Math.min(THUMBNAIL_SPREAD_MAX, THUMBNAIL_SPREAD_STRENGTH * zoomDepth);
      const spreadX = (dx / distance) * spread;
      const spreadY = (dy / distance) * spread;

      attrs.thumbEl.style.width = width + 'px';
      attrs.thumbEl.style.height = height + 'px';
      attrs.thumbEl.style.transform = `translate(${pos.x + spreadX - width / 2}px, ${pos.y + spreadY - height / 2}px)`;
      attrs.thumbEl.classList.toggle('is-muted', Boolean(hiddenByHover));
      attrs.thumbEl.classList.toggle('is-hidden', hiddenByFilter);
      attrs.thumbEl.classList.toggle('is-active', active === node);
    });
  }

  /*
    HTML label overlay for hashtags.
    Images are HTML thumbnails layered above Sigma. This separate label layer
    sits above the thumbnails, so hashtag text remains readable without moving
    the hashtag node dots above the images.
  */
  function updateHashtagLabels() {
    if (!renderer) return;

    const active = hoveredNode || selectedNode;
    const activeSet = active ? new Set([active, ...graph.neighbors(active)]) : null;

    graph.forEachNode((node, attrs) => {
      if (attrs.kind !== 'hashtag' || !attrs.labelEl) return;

      const hiddenByFilter = !visibleNodes.has(node);
      const hiddenByHover = activeSet && !activeSet.has(node);
      const pos = renderer.graphToViewport({ x: attrs.x, y: attrs.y });

      attrs.labelEl.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      attrs.labelEl.classList.toggle('is-hidden', hiddenByFilter);
      attrs.labelEl.classList.toggle('is-muted', Boolean(hiddenByHover));
      attrs.labelEl.classList.toggle('is-active', active === node);
    });
  }

  // Creates the DOM thumbnail element for every image node.
  function createThumbnails() {
    graph.forEachNode((node, attrs) => {
      if (attrs.kind !== 'image' || !attrs.image) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'hashtag-thumb';
      button.dataset.node = node;
      button.style.setProperty('--fragment-color', fragmentColor(attrs.fragment));

      const img = document.createElement('img');
      img.src = getImageSource(attrs);
      img.alt = '';
      img.loading = 'lazy';
      img.addEventListener('load', () => {
        const imageRatio = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1;
        graph.setNodeAttribute(node, 'imageRatio', imageRatio);
        updateThumbnailLayer();
      });
      button.appendChild(img);

      button.addEventListener('mouseenter', () => setHover(node));
      button.addEventListener('mouseleave', clearHover);
      button.addEventListener('click', event => {
        event.stopPropagation();
        inspectNode(node);
      });

      thumbnailLayer.appendChild(button);
      graph.setNodeAttribute(node, 'thumbEl', button);
    });
  }

  // Creates one HTML label for every hashtag node.
  function createHashtagLabels() {
    graph.forEachNode((node, attrs) => {
      if (attrs.kind !== 'hashtag') return;

      const label = document.createElement('span');
      label.className = 'hashtag-label';
      label.textContent = attrs.fullLabel;
      labelLayer.appendChild(label);
      graph.setNodeAttribute(node, 'labelEl', label);
    });
  }

  // Hover isolates the selected node and its direct neighbors.
  function setHover(node) {
    hoveredNode = node;
    hoveredNeighborhood = new Set(graph.neighbors(node));
    renderer.refresh();
    updateThumbnailLayer();
    updateHashtagLabels();
  }

  function clearHover() {
    hoveredNode = null;
    hoveredNeighborhood = new Set();
    renderer.refresh();
    updateThumbnailLayer();
    updateHashtagLabels();
  }

  // Click opens the side inspector with connected hashtags/images.
  function inspectNode(node) {
    selectedNode = node;
    const attrs = graph.getNodeAttributes(node);
    inspector.classList.add('is-active');

    if (attrs.kind === 'image') {
      const tags = connectedHashtagIds(node)
        .map(id => graph.getNodeAttributes(id))
        .sort((a, b) => b.occ - a.occ)
        .slice(0, 18);

      inspectorTitle.textContent = displayFragment(attrs.fragment) + ' image';
      inspectorText.textContent = `${tags.length} connected hashtags in this view.`;
      renderTags(tags);
      renderImages([attrs]);
    } else {
      const images = connectedImageIds(node)
        .map(id => graph.getNodeAttributes(id))
        .filter(attrs => visibleState.fragment === 'All' || attrs.fragment === visibleState.fragment)
        .slice(0, 24);
      const coTags = new Map();

      connectedImageIds(node).forEach(imageId => {
        connectedHashtagIds(imageId).forEach(tagId => {
          if (tagId === node) return;
          const attrs = graph.getNodeAttributes(tagId);
          coTags.set(tagId, { ...attrs, shared: (coTags.get(tagId)?.shared || 0) + 1 });
        });
      });

      inspectorTitle.textContent = attrs.fullLabel;
      inspectorText.textContent = `${attrs.occ} occurrences · ${images.length} connected images shown.`;
      renderTags([...coTags.values()].sort((a, b) => b.shared - a.shared || b.occ - a.occ).slice(0, 18));
      renderImages(images);
    }

    renderer.refresh();
    updateThumbnailLayer();
    updateHashtagLabels();
  }

  // Renders co-occurring hashtags in the inspector.
  function renderTags(tags) {
    inspectorTags.innerHTML = '';
    tags.forEach(tag => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = 'hashtags-inspector-tag';
      pill.textContent = tag.fullLabel || tag.label;
      pill.title = `${tag.occ || tag.shared || 1} occurrences`;
      inspectorTags.appendChild(pill);
    });
  }

  // Renders connected image previews in the inspector.
  function renderImages(images) {
    inspectorImages.innerHTML = '';
    images.forEach(image => {
      if (!image.image) return;
      const img = document.createElement('img');
      img.src = getImageSource(image);
      img.alt = '';
      img.loading = 'lazy';
      inspectorImages.appendChild(img);
    });
  }

  function applyFilters() {
    recomputeVisibleNodes();
    renderer.refresh();
    updateThumbnailLayer();
    updateHashtagLabels();
  }

  // Programmatic zoom used by the + / - buttons.
  function zoomBy(delta) {
    const camera = renderer.getCamera();
    const ratio = camera.ratio * delta;
    camera.animate({ ratio: Math.max(0.08, Math.min(8, ratio)) }, { duration: 220 });
  }

  // Custom hover label. Sigma's default hover box is white; this keeps it softer.
  function drawSoftHoverLabel(context, data, settings) {
    const label = data.fullLabel || data.label || '';
    if (!label) return;

    const size = data.size || 1;
    const fontSize = settings.labelSize || 12;
    const font = settings.labelFont || 'Arial, sans-serif';
    const fontWeight = settings.labelWeight || '700';
    const paddingX = 8;
    const paddingY = 6;

    context.save();
    context.font = `${fontWeight} ${fontSize}px ${font}`;

    const textWidth = context.measureText(label).width;
    const boxX = data.x + size + 7;
    const boxY = data.y - fontSize / 2 - paddingY;
    const boxW = textWidth + paddingX * 2;
    const boxH = fontSize + paddingY * 2;

    context.fillStyle = 'rgba(255, 255, 255, 0.82)';
    context.strokeStyle = 'rgba(255, 255, 255, 0.28)';
    context.lineWidth = 1;
    context.beginPath();
    context.roundRect(boxX, boxY, boxW, boxH, 4);
    context.fill();
    context.stroke();

    context.fillStyle = '#ffffff';
    context.textBaseline = 'middle';
    context.fillText(label, boxX + paddingX, boxY + boxH / 2 + 0.5);
    context.restore();
  }

  buildGraph();
  recomputeVisibleNodes();

  renderer = new Sigma(graph, container, {
    allowInvalidContainer: true,
    renderEdgeLabels: false,
    labelFont: '"ABC Diatype Variable Unlicensed Trial", Arial, sans-serif',
    labelSize: 12,
    labelWeight: '700',
    labelColor: { color: '#ffffffff' },
    labelRenderedSizeThreshold: 0,
    labelDensity: 2.2,
    defaultDrawNodeHover: drawSoftHoverLabel,
    defaultEdgeColor: '#3a3a3a',
    minCameraRatio: 0.08,
    maxCameraRatio: 8,
    nodeReducer: (node, data) => {
      if (!visibleNodes.has(node)) return { ...data, hidden: true };

      // While hovering/clicking, unrelated nodes fade and lose their labels.
      const active = hoveredNode || selectedNode;
      const connected = active && (node === active || hoveredNeighborhood.has(node) || graph.hasEdge(node, active));
      if (active && !connected) {
        return { ...data, label: '', color: '#232323', size: Math.max(0.8, data.baseSize * 0.55), zIndex: 0 };
      }

      if (data.kind === 'image') {
        return { ...data, label: '', color: fragmentColor(data.fragment), size: active === node ? data.baseSize * 1.9 : data.baseSize * 0.9, zIndex: 2 };
      }

      return {
        ...data,
        label: '',
        color: active && connected ? fragmentColor(data.fragment) : data.color,
        size: active === node ? data.baseSize * 1.6 : data.baseSize,
        zIndex: active && connected ? 3 : 1
      };
    },
    edgeReducer: (edge, data) => {
      const source = graph.source(edge);
      const target = graph.target(edge);
      if (!visibleNodes.has(source) || !visibleNodes.has(target)) return { ...data, hidden: true };

      const active = hoveredNode || selectedNode;
      if (!active) return data;
      const connected = source === active || target === active;
      return connected
        ? { ...data, color: '#ffffffff', size: 0.85, zIndex: 2 }
        : { ...data, color: '#111111', size: 0.08, zIndex: 0 };
    }
  });

  container.appendChild(thumbnailLayer);
  container.appendChild(labelLayer);
  createThumbnails();
  createHashtagLabels();

  // Sigma interaction hooks.
  renderer.on('enterNode', ({ node }) => setHover(node));
  renderer.on('leaveNode', clearHover);
  renderer.on('clickNode', ({ node }) => inspectNode(node));
  renderer.on('clickStage', () => {
    selectedNode = null;
    inspector.classList.remove('is-active');
    renderer.refresh();
    updateThumbnailLayer();
    updateHashtagLabels();
  });
  renderer.getCamera().on('updated', updateThumbnailLayer);
  renderer.getCamera().on('updated', updateHashtagLabels);
  renderer.on('afterRender', () => {
    updateThumbnailLayer();
    updateHashtagLabels();
  });

  // Fragment filter buttons: All, Feet, Legs, Glutes.
  document.querySelectorAll('.hashtags-filter').forEach(button => {
    button.addEventListener('click', () => {
      visibleState.fragment = button.dataset.fragment;
      document.querySelectorAll('.hashtags-filter').forEach(el => el.classList.toggle('active', el === button));
      selectedNode = null;
      applyFilters();
    });
  });

  // Density mode: keeps only hashtags with many occurrences and their images.
  if (recurringToggle) {
    recurringToggle.addEventListener('change', () => {
      visibleState.recurringOnly = recurringToggle.checked;
      applyFilters();
    });
  }

  document.getElementById('hashtagsZoomIn')?.addEventListener('click', () => zoomBy(0.72));
  document.getElementById('hashtagsZoomOut')?.addEventListener('click', () => zoomBy(1.28));
  document.getElementById('hashtagsZoomReset')?.addEventListener('click', () => {
    renderer.getCamera().animate({ x: 0.5, y: 0.5, ratio: 1.15 }, { duration: 320 });
  });

  // Initial camera position. Increase ratio to start farther away; decrease it to start closer.
  renderer.getCamera().setState({ x: 0.5, y: 0.5, ratio: 1.15 });
  updateThumbnailLayer();
  updateHashtagLabels();
})();

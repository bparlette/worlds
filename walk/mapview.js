/* Back Roms — World Map overlay (Lane B)
 *
 * Self-contained module. Exposes:
 *   window.BackRomsMap = { open(), close(), toggle(), isOpen(), onTravel }
 * The host sets BackRomsMap.onTravel = function(id) { ... } to rift the player
 * to a world (id is the worlds.json id string, e.g. "007"). The module reads
 * the ring from worlds.json, thumbnails from thumbs/<id>.png, and player state
 * from the shared localStorage store. It WRITES only the favorites / routes /
 * activeRoute fields of that store and preserves every other key verbatim
 * (including the v1 per-world journal entries the walker depends on).
 *
 * Integration: one <script src="mapview.js"></script> tag + one
 * <button id="mapBtn"> in the HUD — the module auto-binds #mapBtn if present
 * and also toggles on the M key. All styles are embedded (injected at runtime)
 * so no stylesheet link is needed.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "backroms-journal-v1"; // the walker's Journal key (walker.html, main)
  var CSS_ID = "brmap-style";
  var TILE_W = 208, TILE_H = 196, GAP = 18, COLS = 3;

  var api = {
    onTravel: null,          // host-set: function(id)
    worldsUrl: "worlds.json",
    thumbsBase: "thumbs/",
    storageKey: STORAGE_KEY,
    open: open,
    close: close,
    toggle: toggle,
    isOpen: function () { return state.open; }
  };
  window.BackRomsMap = api;

  var state = {
    open: false,
    worlds: null,            // defs from worlds.json (cached)
    worldsPromise: null,
    view: { x: 0, y: 0, k: 1 },
    pointers: new Map(),
    pinch: null,
    downInfo: null,
    buildMode: false,
    draft: [],               // route draft: canonical ids in tap order
    save: null,              // last-read derived snapshot for rendering
    fitted: false,
    currentOverride: null    // optional current-world id passed to open(id)
  };

  /* ------------------------------------------------------------------ */
  /* Styles (embedded so integration stays at one script tag)            */
  /* ------------------------------------------------------------------ */
  var CSS = [
    "#brmap{position:fixed;inset:0;z-index:1000;background:radial-gradient(120% 120% at 50% 30%,rgba(24,17,10,.97),rgba(8,5,3,.99));",
    "color:var(--cream,#f5e6bd);font-family:\"Courier New\",Courier,monospace;display:flex;flex-direction:column;",
    "touch-action:none;-webkit-user-select:none;user-select:none;overscroll-behavior:none}",
    "#brmap[hidden]{display:none}",
    "#brmap *{box-sizing:border-box}",
    ".brm-head{display:flex;align-items:center;gap:10px;padding:12px 14px 8px;flex:none;flex-wrap:wrap}",
    ".brm-title{font-size:17px;letter-spacing:.12em;color:var(--amber,#f3b744);font-weight:bold}",
    ".brm-strip{font-size:12.5px;letter-spacing:.08em;opacity:.92}",
    ".brm-strip b{color:var(--amber,#f3b744)}",
    ".brm-spacer{flex:1}",
    ".brm-btn{pointer-events:auto;cursor:pointer;font-family:inherit;font-size:12.5px;letter-spacing:.07em;",
    "color:var(--cream,#f5e6bd);background:rgba(12,8,5,.72);border:1px solid rgba(245,230,189,.35);border-radius:8px;",
    "padding:10px 14px;min-height:44px}",
    ".brm-btn:hover:not(:disabled){border-color:var(--amber,#f3b744);color:var(--amber,#f3b744)}",
    ".brm-btn:disabled{opacity:.38;cursor:default}",
    ".brm-btn.on{background:rgba(243,183,68,.25);border-color:var(--amber,#f3b744);color:var(--amber,#f3b744)}",
    ".brm-btn.primary{background:rgba(243,183,68,.28);border-color:var(--amber,#f3b744);color:#ffe9b0}",
    ".brm-bar{display:flex;align-items:center;gap:8px;padding:0 14px 10px;flex:none;flex-wrap:wrap}",
    ".brm-hint{font-size:12px;letter-spacing:.06em;opacity:.75}",
    ".brm-view{position:relative;flex:1;overflow:hidden;touch-action:none;cursor:grab}",
    ".brm-view:active{cursor:grabbing}",
    ".brm-plane{position:absolute;left:0;top:0;transform-origin:0 0}",
    ".brm-grid{display:grid;gap:" + GAP + "px}",
    ".brm-path{position:absolute;left:0;top:0;pointer-events:none;overflow:visible}",
    ".brm-tile{position:relative;width:" + TILE_W + "px;border-radius:12px;overflow:hidden;cursor:pointer;",
    "background:rgba(12,8,5,.72);border:1px solid rgba(245,230,189,.28)}",
    ".brm-tile.here{border-color:var(--amber,#f3b744);box-shadow:0 0 0 2px rgba(243,183,68,.55),0 0 26px rgba(243,183,68,.25)}",
    ".brm-tile.unvisited{cursor:default}",
    ".brm-art{position:relative;height:132px;display:flex;align-items:center;justify-content:center;overflow:hidden}",
    ".brm-art img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;image-rendering:auto}",
    ".brm-artfallback{padding:10px;text-align:center;font-size:16px;font-weight:bold;letter-spacing:.1em;line-height:1.35;",
    "color:rgba(245,230,189,.92);text-shadow:0 2px 10px rgba(0,0,0,.7);word-break:break-word}",
    ".brm-tile.unvisited .brm-art{filter:brightness(.42) saturate(.45)}",
    ".brm-tile.unvisited .brm-cap{opacity:.55}",
    ".brm-fogtag{position:absolute;left:0;right:0;bottom:0;padding:3px 0;text-align:center;font-size:10px;letter-spacing:.18em;",
    "background:rgba(5,3,2,.66);color:rgba(245,230,189,.75);text-transform:uppercase}",
    ".brm-badge{position:absolute;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:3}",
    ".brm-star{top:6px;left:8px;font-size:21px;color:#ffd94d;text-shadow:0 1px 6px #000,0 0 12px rgba(255,217,77,.6)}",
    ".brm-relic{top:6px;right:8px;font-size:19px;text-shadow:0 1px 6px #000}",
    ".brm-here{top:6px;left:50%;transform:translateX(-50%);background:rgba(243,183,68,.92);color:#241703;",
    "font-size:10px;font-weight:bold;letter-spacing:.14em;padding:3px 8px;border-radius:20px;white-space:nowrap}",
    ".brm-rnum{right:8px;bottom:8px;width:30px;height:30px;border-radius:50%;background:var(--amber,#f3b744);color:#241703;",
    "font-size:15px;font-weight:bold;box-shadow:0 2px 8px rgba(0,0,0,.55)}",
    ".brm-tile.inroute{border-color:rgba(243,183,68,.65)}",
    ".brm-tile.buildpick{outline:2px dashed rgba(245,230,189,.35);outline-offset:-6px}",
    ".brm-cap{padding:8px 10px 10px}",
    ".brm-cap .t{display:block;font-size:13.5px;font-weight:bold;letter-spacing:.06em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".brm-cap .s{display:block;font-size:11px;opacity:.65;letter-spacing:.05em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}",
    ".brm-toast{position:absolute;left:50%;bottom:22px;transform:translateX(-50%) translateY(8px);background:rgba(12,8,5,.92);",
    "border:1px solid rgba(243,183,68,.6);color:var(--cream,#f5e6bd);font-size:12.5px;letter-spacing:.06em;",
    "padding:9px 16px;border-radius:20px;opacity:0;pointer-events:none;transition:opacity .25s ease,transform .25s ease;z-index:5;white-space:nowrap}",
    ".brm-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}",
    ".brm-msg{padding:26px;text-align:center;font-size:13px;letter-spacing:.08em;opacity:.8}",
    "@keyframes brmshake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}",
    ".brm-shake{animation:brmshake .28s ease 2}"
  ].join("\n");

  function injectCss() {
    if (document.getElementById(CSS_ID)) return;
    var st = document.createElement("style");
    st.id = CSS_ID;
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  /* ------------------------------------------------------------------ */
  /* Save store: read (dual v1/v2 tolerant), write (owned fields only)   */
  /* ------------------------------------------------------------------ */
  function readRawSave() {
    try {
      var raw = JSON.parse(localStorage.getItem(api.storageKey) || "{}");
      if (raw && typeof raw === "object" && !Array.isArray(raw)) return raw;
    } catch (e) { /* fall through */ }
    return {};
  }

  // Canonical id lookup: defs use "001"-style strings; save files may too,
  // but tolerate numbers / unpadded forms ("7" vs "007").
  function canonMap(defs) {
    var m = new Map();
    (defs || []).forEach(function (d) {
      var id = String(d.id);
      m.set(id, id);
      var n = parseInt(id, 10);
      if (!isNaN(n)) { m.set(String(n), id); m.set(n, id); }
    });
    return m;
  }
  function canon(m, id) {
    if (id === null || id === undefined) return null;
    return m.get(String(id)) || m.get(id) || null;
  }
  function idSet(m, arr) {
    var s = new Set();
    if (Array.isArray(arr)) arr.forEach(function (x) { var c = canon(m, x); if (c) s.add(c); });
    return s;
  }

  function deriveState(defs) {
    var raw = readRawSave();
    var m = canonMap(defs);
    var relics = idSet(m, raw.relics);           // v2 shape
    var visited = idSet(m, raw.visited);         // v2 shape
    // v1 shape: per-world entries { "<id>": { found, name } }
    defs.forEach(function (d) {
      var e = raw[d.id];
      if (e && typeof e === "object" && e.found) {
        relics.add(d.id);
        visited.add(d.id); // you cannot have the relic without having been there
      }
    });
    var current = canon(m, raw.world) || canon(m, state.currentOverride);
    if (current) visited.add(current);
    return {
      raw: raw,
      relics: relics,
      visited: visited,
      favorites: idSet(m, raw.favorites),
      favoritesRaw: Array.isArray(raw.favorites) ? raw.favorites.slice() : [],
      routes: Array.isArray(raw.routes) ? raw.routes : [],
      activeRoute: (raw.activeRoute === undefined ? null : raw.activeRoute),
      current: current
    };
  }

  function resolveActiveRoute(save) {
    var a = save.activeRoute;
    if (a === null || a === undefined) return null;
    if (typeof a === "number" && save.routes[a]) return { index: a, route: save.routes[a] };
    if (typeof a === "string") {
      for (var i = 0; i < save.routes.length; i++)
        if (save.routes[i] && save.routes[i].name === a) return { index: i, route: save.routes[i] };
    }
    if (typeof a === "object" && Array.isArray(a.worlds)) return { index: -1, route: a };
    return null;
  }

  // Read-modify-write at action time (never from a stale copy). Only the
  // contract-owned fields are touched; all other keys are preserved verbatim.
  function writeOwned(patch) {
    var raw = readRawSave();
    ["favorites", "routes", "activeRoute"].forEach(function (k) {
      if (Object.prototype.hasOwnProperty.call(patch, k)) raw[k] = patch[k];
    });
    try { localStorage.setItem(api.storageKey, JSON.stringify(raw)); } catch (e) { /* quota/blocked: non-fatal */ }
    return raw;
  }

  /* ------------------------------------------------------------------ */
  /* DOM                                                                 */
  /* ------------------------------------------------------------------ */
  var els = null;
  function buildDom() {
    if (els) return els;
    injectCss();
    var root = document.createElement("div");
    root.id = "brmap";
    root.hidden = true;
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-label", "Back Roms world map");
    root.innerHTML =
      '<div class="brm-head">' +
        '<span class="brm-title">🗺 WORLD MAP</span>' +
        '<span class="brm-strip" id="brmStrip"></span>' +
        '<span class="brm-spacer"></span>' +
        '<button class="brm-btn" id="brmClose" type="button" aria-label="Close map">✕ Close</button>' +
      '</div>' +
      '<div class="brm-bar" id="brmBar"></div>' +
      '<div class="brm-view" id="brmView">' +
        '<div class="brm-plane" id="brmPlane">' +
          '<svg class="brm-path" id="brmPath"></svg>' +
          '<div class="brm-grid" id="brmGrid"></div>' +
        '</div>' +
        '<div class="brm-toast" id="brmToast"></div>' +
      '</div>';
    document.body.appendChild(root);
    els = {
      root: root,
      strip: root.querySelector("#brmStrip"),
      bar: root.querySelector("#brmBar"),
      view: root.querySelector("#brmView"),
      plane: root.querySelector("#brmPlane"),
      path: root.querySelector("#brmPath"),
      grid: root.querySelector("#brmGrid"),
      toast: root.querySelector("#brmToast")
    };
    root.querySelector("#brmClose").addEventListener("click", function () { close(); });
    // The overlay is full-screen and topmost; swallow pointer/wheel events at
    // the root as well so nothing can leak through to the walker beneath.
    ["pointerdown", "wheel", "touchstart", "touchmove"].forEach(function (t) {
      root.addEventListener(t, function (e) { e.stopPropagation(); }, { passive: true });
    });
    attachGestures(els.view);
    return els;
  }

  var toastTimer = null;
  function toast(msg) {
    if (!els) return;
    els.toast.textContent = msg;
    els.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { els.toast.classList.remove("show"); }, 2200);
  }

  /* ------------------------------------------------------------------ */
  /* Worlds data                                                         */
  /* ------------------------------------------------------------------ */
  function loadWorlds() {
    if (state.worlds) return Promise.resolve(state.worlds);
    if (!state.worldsPromise) {
      state.worldsPromise = fetch(api.worldsUrl)
        .then(function (r) { if (!r.ok) throw new Error("worlds " + r.status); return r.json(); })
        .then(function (defs) {
          state.worlds = Array.isArray(defs) ? defs : [];
          return state.worlds;
        })
        .catch(function () { state.worlds = []; state.worldsPromise = null; return state.worlds; });
    }
    return state.worldsPromise;
  }

  /* ------------------------------------------------------------------ */
  /* Rendering                                                           */
  /* ------------------------------------------------------------------ */
  function tileHue(id) {
    var n = parseInt(id, 10);
    if (isNaN(n)) { n = 0; for (var i = 0; i < String(id).length; i++) n += String(id).charCodeAt(i); }
    return (n * 47) % 360;
  }
  function planeSize(defs) {
    var rows = Math.max(1, Math.ceil(defs.length / COLS));
    return { w: COLS * TILE_W + (COLS - 1) * GAP, h: rows * TILE_H + (rows - 1) * GAP };
  }

  function render() {
    if (!els || !state.worlds) return;
    var defs = state.worlds;
    var save = deriveState(defs);
    state.save = save;
    var total = defs.length;

    els.strip.innerHTML =
      "🏆 Relics <b>" + save.relics.size + " / " + total + "</b> · 👣 Visited <b>" + save.visited.size + "</b> · ★ Favorites <b>" + save.favorites.size + "</b>";

    renderBar(save);
    renderTiles(defs, save);
    fitView(false);
  }

  function renderBar(save) {
    var bar = els.bar;
    bar.innerHTML = "";
    var active = resolveActiveRoute(save);

    if (state.buildMode) {
      var hint = document.createElement("span");
      hint.className = "brm-hint";
      hint.textContent = "⭐ Route builder — tap favorites in walking order (tap again to remove) · " + state.draft.length + " picked";
      var saveBtn = document.createElement("button");
      saveBtn.className = "brm-btn primary";
      saveBtn.type = "button";
      saveBtn.textContent = "💾 Save route";
      saveBtn.disabled = state.draft.length < 2;
      saveBtn.addEventListener("click", saveRoute);
      var cancelBtn = document.createElement("button");
      cancelBtn.className = "brm-btn";
      cancelBtn.type = "button";
      cancelBtn.textContent = "Cancel";
      cancelBtn.addEventListener("click", function () { state.buildMode = false; state.draft = []; render(); });
      bar.appendChild(hint); bar.appendChild(saveBtn); bar.appendChild(cancelBtn);
      return;
    }

    var buildBtn = document.createElement("button");
    buildBtn.className = "brm-btn";
    buildBtn.type = "button";
    buildBtn.textContent = "⭐ Build route";
    buildBtn.disabled = save.favorites.size < 2;
    buildBtn.title = save.favorites.size < 2 ? "Star at least 2 favorite worlds first" : "Order your favorites into a walking route";
    buildBtn.addEventListener("click", function () {
      state.buildMode = true; state.draft = []; render();
    });

    var ringBtn = document.createElement("button");
    ringBtn.className = "brm-btn" + (active ? "" : " on");
    ringBtn.type = "button";
    ringBtn.textContent = "🏠 Back Roms ring";
    ringBtn.title = "Walk the worlds in the standard ring order";
    ringBtn.addEventListener("click", function () {
      writeOwned({ activeRoute: null });
      toast("Back Roms ring active");
      render();
    });

    var note = document.createElement("span");
    note.className = "brm-hint";
    if (active) note.textContent = "Active route: " + (active.route.name || "route") + " — follow the numbers";
    else if (save.favorites.size < 2) note.textContent = "Star 2+ worlds (★ in the walker) to build a favorites route · tap a visited world to rift there";
    else note.textContent = "Tap a visited world to rift there · drag to pan, pinch or scroll to zoom";

    bar.appendChild(buildBtn); bar.appendChild(ringBtn); bar.appendChild(note);
  }

  function renderTiles(defs, save) {
    var grid = els.grid;
    grid.innerHTML = "";
    grid.style.gridTemplateColumns = "repeat(" + COLS + ", " + TILE_W + "px)";
    var size = planeSize(defs);
    els.plane.style.width = size.w + "px";
    els.plane.style.height = size.h + "px";
    els.path.setAttribute("width", size.w);
    els.path.setAttribute("height", size.h);
    els.path.setAttribute("viewBox", "0 0 " + size.w + " " + size.h);

    var active = state.buildMode ? null : resolveActiveRoute(save);
    var routeOrder = new Map(); // canonical id -> 1-based position
    if (state.buildMode) {
      state.draft.forEach(function (id, i) { routeOrder.set(id, i + 1); });
    } else if (active && Array.isArray(active.route.worlds)) {
      var m = canonMap(defs);
      active.route.worlds.forEach(function (id, i) { var c = canon(m, id); if (c && !routeOrder.has(c)) routeOrder.set(c, i + 1); });
    }

    if (!defs.length) {
      grid.innerHTML = '<div class="brm-msg">No worlds found in the manifest.</div>';
      return;
    }

    defs.forEach(function (d) {
      var id = String(d.id);
      var visited = save.visited.has(id);
      var tile = document.createElement("div");
      tile.className = "brm-tile" +
        (visited ? "" : " unvisited") +
        (save.current === id ? " here" : "") +
        (routeOrder.has(id) ? " inroute" : "") +
        (state.buildMode && save.favorites.has(id) ? " buildpick" : "");
      tile.dataset.id = id;

      var art = document.createElement("div");
      art.className = "brm-art";
      art.style.background = "linear-gradient(150deg, hsl(" + tileHue(id) + ",46%,30%), hsl(" + ((tileHue(id) + 40) % 360) + ",52%,17%))";
      var fb = document.createElement("div");
      fb.className = "brm-artfallback";
      fb.textContent = d.title || ("#" + id);
      art.appendChild(fb);
      var img = document.createElement("img");
      img.alt = "";
      img.draggable = false;
      img.src = api.thumbsBase + encodeURIComponent(id) + ".png";
      img.addEventListener("error", function () { img.remove(); });
      img.addEventListener("load", function () { fb.style.display = "none"; });
      art.appendChild(img);

      if (save.favorites.has(id)) {
        var star = document.createElement("span");
        star.className = "brm-badge brm-star"; star.textContent = "★";
        art.appendChild(star);
      }
      if (save.relics.has(id)) {
        var rel = document.createElement("span");
        rel.className = "brm-badge brm-relic"; rel.textContent = "🏆";
        art.appendChild(rel);
      }
      if (save.current === id) {
        var here = document.createElement("span");
        here.className = "brm-badge brm-here"; here.textContent = "📍 YOU ARE HERE";
        art.appendChild(here);
      }
      if (routeOrder.has(id)) {
        var rn = document.createElement("span");
        rn.className = "brm-badge brm-rnum"; rn.textContent = routeOrder.get(id);
        art.appendChild(rn);
      }
      if (!visited) {
        var fog = document.createElement("div");
        fog.className = "brm-fogtag"; fog.textContent = "· not visited ·";
        art.appendChild(fog);
      }
      tile.appendChild(art);

      var cap = document.createElement("div");
      cap.className = "brm-cap";
      var t = document.createElement("span"); t.className = "t"; t.textContent = "#" + id + " " + (d.title || "");
      var s = document.createElement("span"); s.className = "s"; s.textContent = (d.sub || "") + (d.system ? " · " + d.system : "");
      cap.appendChild(t); cap.appendChild(s);
      tile.appendChild(cap);

      grid.appendChild(tile);
    });

    drawPath(defs, routeOrder);
  }

  function drawPath(defs, routeOrder) {
    var svg = els.path;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    if (!routeOrder.size) return;
    var tiles = els.grid.querySelectorAll(".brm-tile");
    var centers = new Map();
    tiles.forEach(function (tile) {
      centers.set(tile.dataset.id, {
        x: tile.offsetLeft + tile.offsetWidth / 2,
        y: tile.offsetTop + tile.offsetHeight / 2
      });
    });
    var pts = [];
    Array.from(routeOrder.entries()).sort(function (a, b) { return a[1] - b[1]; }).forEach(function (e) {
      var c = centers.get(e[0]); if (c) pts.push(c.x + "," + c.y);
    });
    if (pts.length < 2) return;
    var pl = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    pl.setAttribute("points", pts.join(" "));
    pl.setAttribute("fill", "none");
    pl.setAttribute("stroke", "rgba(243,183,68,.75)");
    pl.setAttribute("stroke-width", "3");
    pl.setAttribute("stroke-dasharray", "9 7");
    pl.setAttribute("stroke-linecap", "round");
    svg.appendChild(pl);
  }

  /* ------------------------------------------------------------------ */
  /* Pan / zoom gestures + tap                                           */
  /* ------------------------------------------------------------------ */
  function applyView() {
    var v = state.view;
    els.plane.style.transform = "translate(" + v.x + "px," + v.y + "px) scale(" + v.k + ")";
  }
  function fitView(force) {
    if (!els || !state.worlds) return;
    if (state.fitted && !force) { applyView(); return; }
    var size = planeSize(state.worlds);
    var vw = els.view.clientWidth, vh = els.view.clientHeight;
    if (!vw || !vh) return;
    var k = Math.min(vw / (size.w + 32), vh / (size.h + 32), 1.15);
    state.view.k = Math.max(0.3, k);
    state.view.x = (vw - size.w * state.view.k) / 2;
    state.view.y = (vh - size.h * state.view.k) / 2;
    state.fitted = true;
    applyView();
  }
  function clampK(k) { return Math.min(3, Math.max(0.3, k)); }
  function zoomAt(cx, cy, factor) {
    var v = state.view;
    var nk = clampK(v.k * factor);
    if (nk === v.k) return;
    // keep the plane point under (cx, cy) stationary
    v.x = cx - (cx - v.x) * (nk / v.k);
    v.y = cy - (cy - v.y) * (nk / v.k);
    v.k = nk;
    applyView();
  }

  function attachGestures(view) {
    view.addEventListener("pointerdown", function (e) {
      try { view.setPointerCapture(e.pointerId); } catch (err) {}
      state.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (state.pointers.size === 1) {
        state.downInfo = { x: e.clientX, y: e.clientY, t: Date.now(), moved: false };
        state.pinch = null;
      } else if (state.pointers.size === 2) {
        var p = Array.from(state.pointers.values());
        state.pinch = {
          d0: Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y),
          k0: state.view.k,
          mx: (p[0].x + p[1].x) / 2, my: (p[0].y + p[1].y) / 2,
          vx: state.view.x, vy: state.view.y
        };
        state.downInfo = null; // two fingers down is never a tap
      }
    });
    view.addEventListener("pointermove", function (e) {
      if (!state.pointers.has(e.pointerId)) return;
      var prev = state.pointers.get(e.pointerId);
      var dx = e.clientX - prev.x, dy = e.clientY - prev.y;
      state.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (state.pinch && state.pointers.size === 2) {
        var p = Array.from(state.pointers.values());
        var d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
        var mx = (p[0].x + p[1].x) / 2, my = (p[0].y + p[1].y) / 2;
        var nk = clampK(state.pinch.k0 * (state.pinch.d0 ? d / state.pinch.d0 : 1));
        // plane point that was under the original midpoint stays under the current midpoint
        var px = (state.pinch.mx - state.pinch.vx) / state.pinch.k0;
        var py = (state.pinch.my - state.pinch.vy) / state.pinch.k0;
        state.view.k = nk;
        state.view.x = mx - px * nk;
        state.view.y = my - py * nk;
        applyView();
      } else if (state.pointers.size === 1) {
        if (state.downInfo && Math.hypot(e.clientX - state.downInfo.x, e.clientY - state.downInfo.y) > 9) {
          state.downInfo.moved = true;
        }
        if (state.downInfo && state.downInfo.moved) {
          state.view.x += dx; state.view.y += dy;
          applyView();
        }
      }
    });
    function endPointer(e) {
      var wasTap = false, tx = 0, ty = 0;
      if (state.downInfo && state.pointers.size === 1 && state.pointers.has(e.pointerId)) {
        if (!state.downInfo.moved && Date.now() - state.downInfo.t < 600) { wasTap = true; tx = e.clientX; ty = e.clientY; }
      }
      state.pointers.delete(e.pointerId);
      if (state.pointers.size < 2) state.pinch = null;
      if (state.pointers.size === 0) state.downInfo = null;
      if (wasTap) handleTap(tx, ty);
    }
    view.addEventListener("pointerup", endPointer);
    view.addEventListener("pointercancel", endPointer);
    view.addEventListener("wheel", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var r = view.getBoundingClientRect();
      zoomAt(e.clientX - r.left, e.clientY - r.top, Math.exp(-e.deltaY * 0.0016));
    }, { passive: false });
  }

  function handleTap(x, y) {
    var node = document.elementFromPoint(x, y);
    var tile = node && node.closest ? node.closest(".brm-tile") : null;
    if (!tile || !els.root.contains(tile)) return;
    var id = tile.dataset.id;
    var save = state.save || deriveState(state.worlds || []);

    if (state.buildMode) {
      if (!save.favorites.has(id)) { toast("Only ★ favorites can join a route"); shake(tile); return; }
      var i = state.draft.indexOf(id);
      if (i >= 0) state.draft.splice(i, 1); else state.draft.push(id);
      render();
      return;
    }

    if (!save.visited.has(id)) {
      toast("Not visited yet — find it on foot first");
      shake(tile);
      return;
    }
    if (typeof api.onTravel === "function") {
      var cb = api.onTravel;
      close();
      cb(id);
    } else {
      toast("Travel is not connected in the host yet");
    }
  }
  function shake(tile) {
    tile.classList.remove("brm-shake");
    void tile.offsetWidth;
    tile.classList.add("brm-shake");
  }

  function saveRoute() {
    if (state.draft.length < 2) return;
    var save = state.save || deriveState(state.worlds || []);
    var routes = (save.routes || []).slice();
    var base = "My route", name = base, n = 2;
    var names = new Set(routes.map(function (r) { return r && r.name; }));
    while (names.has(name)) { name = base + " " + n; n++; }
    routes.push({ name: name, worlds: state.draft.slice() });
    writeOwned({ routes: routes, activeRoute: routes.length - 1 });
    state.buildMode = false;
    state.draft = [];
    render();
    toast("Route saved — follow the numbers");
  }

  /* ------------------------------------------------------------------ */
  /* Open / close                                                        */
  /* ------------------------------------------------------------------ */
  function open(currentId) {
    buildDom();
    state.open = true;
    state.buildMode = false;
    state.draft = [];
    state.fitted = false;
    if (currentId !== undefined && currentId !== null) state.currentOverride = currentId;
    els.root.hidden = false;
    var mb = document.getElementById("mapBtn");
    if (mb) mb.classList.add("on");
    loadWorlds().then(function () { if (state.open) render(); });
  }
  function close() {
    if (!els) { state.open = false; return; }
    state.open = false;
    state.buildMode = false;
    state.draft = [];
    state.pointers.clear();
    state.pinch = null;
    els.root.hidden = true;
    var mb = document.getElementById("mapBtn");
    if (mb) mb.classList.remove("on");
  }
  function toggle() { state.open ? close() : open(); }

  /* ------------------------------------------------------------------ */
  /* Wiring: #mapBtn auto-bind, ESC (capture, so the walker's own ESC    */
  /* handler does not also fire), M toggle.                              */
  /* ------------------------------------------------------------------ */
  function bind() {
    var mb = document.getElementById("mapBtn");
    if (mb && !mb.dataset.brmBound) {
      mb.dataset.brmBound = "1";
      mb.addEventListener("click", function () { toggle(); });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();

  window.addEventListener("keydown", function (e) {
    if (e.code === "Escape" && state.open) {
      e.preventDefault();
      e.stopPropagation();
      close();
    } else if (e.code === "KeyM" && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.stopPropagation();
      toggle();
    }
  }, true);

  window.addEventListener("resize", function () { if (state.open) fitView(false); });
})();

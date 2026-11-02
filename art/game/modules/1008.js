// @world {"id": "1008", "title": "Kingdom Hearts", "sub": "Traverse Town", "system": "3D Render"}
// Converted from 1008-kingdom_hearts_traverse_town.html into a Back Roms World Walker module.

import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js";

export function createWorld(THREE) {
  const group = new THREE.Group();

  let scene = {
    add: (...objs) => objs.forEach(o => o && group.add(o)),
    remove: (...objs) => objs.forEach(o => o && group.remove(o)),
    traverse: (cb) => group.traverse(cb),
    updateMatrixWorld: () => {},
    background: null,
    fog: null
  };

  let updateHook = null;

  function dummyRenderer() {
    return {
      setPixelRatio: () => {},
      setSize: () => {},
      outputColorSpace: null,
      toneMapping: null,
      toneMappingExposure: null,
      shadowMap: { enabled: false },
      capabilities: { getMaxAnisotropy: () => 16 },
      domElement: {
        style: {},
        setAttribute: () => {},
        addEventListener: () => {},
        removeEventListener: () => {}
      },
      render: () => {},
      setAnimationLoop: (cb) => { updateHook = cb; },
    };
  }

  function dummyVec() {
    const v = { x: 0, y: 0, z: 0,
      set: (x, y, z) => { v.x = x || 0; v.y = y || 0; v.z = z || 0; return v; },
      copy: (o) => { if (o) { v.x = o.x || 0; v.y = o.y || 0; v.z = o.z || 0; } return v; },
      add: (o) => { if (o) { v.x += o.x || 0; v.y += o.y || 0; v.z += o.z || 0; } return v; },
      sub: (o) => { if (o) { v.x -= o.x || 0; v.y -= o.y || 0; v.z -= o.z || 0; } return v; },
      addScaledVector: (o, s) => { if (o) { v.x += (o.x || 0) * s; v.y += (o.y || 0) * s; v.z += (o.z || 0) * s; } return v; },
      setFromSpherical: () => v,
      setFromSphericalCoords: () => v,
      length: () => Math.hypot(v.x, v.y, v.z),
      normalize: () => v,
      clone: () => { const c = dummyVec(); c.x = v.x; c.y = v.y; c.z = v.z; return c; }
    };
    return v;
  }

  function dummyCamera() {
    return {
      position: dummyVec(),
      up: dummyVec(),
      rotation: { x: 0, y: 0, z: 0, set: () => {} },
      quaternion: { set: () => {}, copy: () => {} },
      fov: 60, aspect: 16 / 9, near: 0.1, far: 2000,
      lookAt: () => {},
      getWorldDirection: (target) => { const t = target || dummyVec(); if (t.set) t.set(0, 0, -1); return t; },
      updateProjectionMatrix: () => {},
      updateMatrixWorld: () => {}
    };
  }

  let renderer = dummyRenderer();
  let camera = dummyCamera();
  const addEventListener = () => {};
  const devicePixelRatio = 1;
  const innerWidth = 1920;
  const innerHeight = 1080;
  const dummyEl = () => {
    const node = {
      style: {},
      classList: { add: () => {}, remove: () => {} },
      appendChild: () => {},
      prepend: () => {},
      setAttribute: () => {},
      addEventListener: () => {},
      removeEventListener: () => {}
    };
    return node;
  };
  let container = dummyEl();
  let stage = dummyEl();
  let app = dummyEl();
  const window = typeof globalThis.window !== "undefined" ? globalThis.window : {
    innerWidth: 1920, innerHeight: 1080, devicePixelRatio: 1, addEventListener: () => {}
  };
  const document = typeof globalThis.document !== "undefined" ? globalThis.document : {
    body: dummyEl(),
    querySelector: () => dummyEl(),
    querySelectorAll: () => [],
    getElementById: () => dummyEl(),
    createElement: () => {
      const ctx = new Proxy({}, { get: () => () => ctx, set: () => true });
      return { getContext: () => ctx, width: 64, height: 64, style: {}, appendChild: () => {}, setAttribute: () => {} };
    }
  };
  const requestAnimationFrame = (fn) => { updateHook = fn; };

  // --- Scoped Diorama Build Code ---
  // Converter repair: declared identifier(s) the scene used undeclared
  // (strict modules throw where sloppy scripts did not): barrels, crates
  let barrels = 0;
  let crates = 0;

    

    // -------------------------------------------------------------------------
    // Renderer and scene
    // -------------------------------------------------------------------------
    // scene redirect
    scene.background = new THREE.Color(0x1b1b24);
    scene.fog = new THREE.Fog(0x1b1b24, 28, 68);

    camera = dummyCamera();

    renderer = dummyRenderer();
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    

    const hemi = new THREE.HemisphereLight(0x9bb7d1, 0x5b3820, 1.4);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xffc77c, 2.8);
    sun.position.set(-14, 22, 12);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -28;
    sun.shadow.camera.right = 28;
    sun.shadow.camera.top = 25;
    sun.shadow.camera.bottom = -25;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 65;
    sun.shadow.bias = -0.0004;
    scene.add(sun);

    const rim = new THREE.DirectionalLight(0x789bd1, 1.15);
    rim.position.set(15, 10, -18);
    scene.add(rim);

    // -------------------------------------------------------------------------
    // Materials
    // -------------------------------------------------------------------------
    const mat = {
      cobble: new THREE.MeshStandardMaterial({
        color: 0x8a6844, roughness: .93
      }),
      cobbleDark: new THREE.MeshStandardMaterial({
        color: 0x654b32, roughness: .96
      }),
      stone: new THREE.MeshStandardMaterial({
        color: 0x9a896b, roughness: .92
      }),
      stoneDark: new THREE.MeshStandardMaterial({
        color: 0x6f6656, roughness: .95
      }),
      plaster: new THREE.MeshStandardMaterial({
        color: 0xc9a86c, roughness: .9
      }),
      plasterWarm: new THREE.MeshStandardMaterial({
        color: 0xe0b979, roughness: .88
      }),
      plasterCool: new THREE.MeshStandardMaterial({
        color: 0x9b8670, roughness: .9
      }),
      wood: new THREE.MeshStandardMaterial({
        color: 0x70452d, roughness: .88
      }),
      woodLight: new THREE.MeshStandardMaterial({
        color: 0x9b6338, roughness: .83
      }),
      woodDark: new THREE.MeshStandardMaterial({
        color: 0x452c20, roughness: .9
      }),
      roof: new THREE.MeshStandardMaterial({
        color: 0x55302c, roughness: .88
      }),
      roofDark: new THREE.MeshStandardMaterial({
        color: 0x352324, roughness: .92
      }),
      gold: new THREE.MeshStandardMaterial({
        color: 0xf2b84b,
        metalness: .55,
        roughness: .38
      }),
      red: new THREE.MeshStandardMaterial({
        color: 0x9f3028, roughness: .78
      }),
      green: new THREE.MeshStandardMaterial({
        color: 0x2e6545, roughness: .8
      }),
      black: new THREE.MeshStandardMaterial({
        color: 0x242229, roughness: .72
      }),
      glass: new THREE.MeshStandardMaterial({
        color: 0xffb55f,
        emissive: 0xff7b24,
        emissiveIntensity: 1.8,
        roughness: .35
      }),
      window: new THREE.MeshStandardMaterial({
        color: 0xffb65c,
        emissive: 0xff7a24,
        emissiveIntensity: 1.25,
        roughness: .45
      }),
      lamp: new THREE.MeshStandardMaterial({
        color: 0xffd78b,
        emissive: 0xffa63d,
        emissiveIntensity: 2.2,
        roughness: .35
      }),
      sign: new THREE.MeshStandardMaterial({
        color: 0xe8b651,
        emissive: 0x8a4c08,
        emissiveIntensity: .35,
        roughness: .75
      }),
      signDark: new THREE.MeshStandardMaterial({
        color: 0x253b32,
        emissive: 0x162b23,
        roughness: .8
      }),
      topHat: new THREE.MeshStandardMaterial({
        color: 0x263d3b,
        roughness: .72
      }),
      hatBand: new THREE.MeshStandardMaterial({
        color: 0xd1a65c,
        roughness: .7
      }),
      trunk: new THREE.MeshStandardMaterial({
        color: 0x4d2c1d, roughness: 1
      }),
      leaf: new THREE.MeshStandardMaterial({
        color: 0x355f3b, roughness: .9
      }),
      leafLight: new THREE.MeshStandardMaterial({
        color: 0x5b7c43, roughness: .9
      })
    };

    // -------------------------------------------------------------------------
    // Geometry helpers
    // -------------------------------------------------------------------------
    function box(w, h, d, material, x, y, z, cast = true, receive = true) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
      mesh.position.set(x, y, z);
      mesh.castShadow = cast;
      mesh.receiveShadow = receive;
      scene.add(mesh);
      return mesh;
    }

    function voxelCylinder(radius, height, material, x, y, z, segments = 12) {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(radius, radius, height, segments),
        material
      );
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      return mesh;
    }

    function addTextSprite(text, options = {}) {
      const {
        color = "#ffe3a0",
        background = "rgba(28,20,20,.82)",
        fontSize = 48,
        width = 512,
        height = 128
      } = options;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = color;
      ctx.lineWidth = 8;
      ctx.strokeRect(7, 7, width - 14, height - 14);
      ctx.fillStyle = color;
      ctx.font = `800 ${fontSize}px Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, width / 2, height / 2 + 2);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;

      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: true
      }));
      sprite.scale.set(options.width || 4.5, options.height || 1.125, 1);
      return sprite;
    }

    function sign(text, width, height, x, y, z, color = "#ffe3a0") {
      const group = new THREE.Group();
      const board = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height),
        new THREE.MeshBasicMaterial({ color })
      );
      board.position.z = 0.012;
      group.add(board);
      const backing = new THREE.Mesh(
        new THREE.BoxGeometry(width + .12, height + .12, .14),
        mat.signDark
      );
      backing.position.z = -.07;
      backing.castShadow = true;
      group.add(backing);
      group.position.set(x, y, z);
      scene.add(group);
      return group;
    }

    function poleLamp(x, z, height = 5.2, armDirection = 1) {
      const group = new THREE.Group();

      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(.42, .52, .45, 10),
        mat.stoneDark
      );
      base.position.y = .22;
      base.castShadow = true;
      group.add(base);

      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(.105, .14, height, 8),
        mat.black
      );
      pole.position.y = height / 2;
      pole.castShadow = true;
      group.add(pole);

      const arm = new THREE.Mesh(
        new THREE.BoxGeometry(1.35, .11, .12),
        mat.black
      );
      arm.position.set(armDirection * .55, height, 0);
      arm.rotation.y = armDirection > 0 ? 0 : Math.PI;
      arm.castShadow = true;
      group.add(arm);

      const lamp = new THREE.Mesh(
        new THREE.BoxGeometry(.62, .72, .42),
        mat.lamp
      );
      lamp.position.set(armDirection * 1.2, height - .12, 0);
      group.add(lamp);

      const cap = new THREE.Mesh(
        new THREE.ConeGeometry(.47, .35, 4),
        mat.black
      );
      cap.rotation.y = Math.PI / 4;
      cap.position.set(armDirection * 1.2, height + .42, 0);
      cap.castShadow = true;
      group.add(cap);

      group.position.set(x, 0, z);
      scene.add(group);
      return group;
    }

    function roofTile(x, y, z, width, depth, color = mat.roof) {
      const tile = new THREE.Mesh(new THREE.BoxGeometry(width, .28, depth), color);
      tile.position.set(x, y, z);
      tile.castShadow = true;
      tile.receiveShadow = true;
      scene.add(tile);
      return tile;
    }

    // -------------------------------------------------------------------------
    // Ground
    // -------------------------------------------------------------------------
    box(52, .35, 42, mat.cobble, 0, -.2, 0, false, true);

    for (let x = -24; x <= 24; x += 2) {
      for (let z = -18; z <= 18; z += 2) {
        if (Math.abs(x) < 2.1 && Math.abs(z) < 2.1) continue;
        const shade = Math.random() > .5 ? mat.cobble : mat.cobbleDark;
        box(1.88, .035, 1.88, shade, x, -.015, z, false, true);
      }
    }

    // Central steps
    for (let i = 0; i < 4; i++) {
      box(8.2 - i * .35, .34, 1.25, mat.stone, 0, .18 + i * .17, 4.4 + i * 1.15);
    }

    // -------------------------------------------------------------------------
    // Left building: timber house with café and items
    // -------------------------------------------------------------------------
    const leftBuilding = new THREE.Group();
    leftBuilding.position.set(-11, 0, -1);
    scene.add(leftBuilding);

    function buildingPart(parent, w, h, d, material, x, y, z, roof = false) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        material
      );
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    }

    const b = (parent, w, h, d, material, x = 0, y = 0, z = 0) =>
      buildingPart(parent, w, h, d, material, x, y, z);

    b(leftBuilding, 11.5, 8.4, 7.2, mat.plaster, 0, 4.2, 0);
    b(leftBuilding, 12.4, .35, 8.0, mat.stone, 0, .18, 0);
    b(leftBuilding, 12.7, .35, 8.2, mat.roof, 0, 8.6, 0);

    // Exposed timber framing
    const frameMat = mat.wood;
    for (const x of [-5.8, -1.9, 2.0, 5.8]) {
      b(leftBuilding, .28, 8.1, .32, frameMat, x, 4.15, 3.55);
    }
    for (const x of [-4.8, -2.8, -.8, 1.2, 3.2, 5.2]) {
      b(leftBuilding, .18, 8.0, .22, frameMat, x, 4.1, 3.62);
    }
    b(leftBuilding, 11.8, .28, .34, frameMat, 0, 8.0, 3.62);

    // Upper balcony
    b(leftBuilding, 8.7, .28, 1.45, mat.wood, -.5, 6.35, 3.15);
    for (let x = -4.7; x <= 3.9; x += 1.05) {
      b(leftBuilding, .13, 1.25, .13, mat.wood, x, 6.95, 3.15);
    }
    b(leftBuilding, 8.8, .14, .14, mat.wood, -.5, 7.55, 3.15);

    // Ground-floor windows
    for (const x of [-4.2, -1.4, 1.4, 4.2]) {
      b(leftBuilding, .28, 2.1, .28, mat.woodDark, x, 2.7, 3.65);
      b(leftBuilding, .35, 1.55, .08, mat.window, x, 2.7, 3.82);
      for (let y = 2.15; y <= 3.25; y += .42) {
        b(leftBuilding, .05, .055, .1, mat.wood, x, y, 3.87);
      }
    }

    // Upper windows
    for (const x of [-4.3, -1.4, 1.4, 4.3]) {
      b(leftBuilding, .3, 1.35, .3, mat.woodDark, x, 6.65, 3.65);
      b(leftBuilding, .38, .88, .08, mat.window, x, 6.65, 3.83);
    }

    // Café awning
    const awning = new THREE.Group();
    awning.position.set(-2.2, 4.85, 3.75);
    leftBuilding.add(awning);
    b(awning, 5.0, .18, 1.5, mat.red, 0, 0, 0);
    for (let x = -2.3; x <= 2.3; x += .5) {
      b(awning, .08, .75, .08, mat.wood, x, -.38, .65);
    }
    sign("CAFÉ", 2.3, .62, -2.2, 4.85, 3.78, "#ffd18a");

    // Items stall
    const items = new THREE.Group();
    items.position.set(5.0, 0, 2.3);
    leftBuilding.add(items);

    for (const x of [-1.55, 1.55]) {
      for (const z of [-.75, .75]) {
        const leg = new THREE.Mesh(
          new THREE.CylinderGeometry(.09, .12, 1.65, 8),
          mat.wood
        );
        leg.position.set(x, .82, z);
        leg.castShadow = true;
        items.add(leg);
      }
    }
    b(items, 3.4, .16, 1.8, mat.wood, 0, 1.65, 0);
    b(items, 3.55, .18, 1.95, mat.woodLight, 0, 1.8, 0);

    const itemColors = [mat.red, mat.green, mat.gold, mat.leaf, mat.plasterWarm];
    for (let i = 0; i < 9; i++) {
      const item = new THREE.Mesh(
        new THREE.SphereGeometry(.28, 8, 6),
        itemColors[i % itemColors.length]
      );
      item.position.set(-1.2 + i * .42, 2.18, (i % 2) * .35);
      item.scale.y = .78;
      item.castShadow = true;
      items.add(item);
    }

    sign("ITEMS", 2.35, .68, 5.0, 2.45, 2.3, "#ffcf66");

    // Hanging lanterns
    for (const x of [-6.1, 6.1]) {
      const lantern = new THREE.Mesh(
        new THREE.SphereGeometry(.28, 10, 8),
        mat.lamp
      );
      lantern.position.set(x, 3.0, 3.75);
      scene.add(lantern);
      b(scene, .08, 1.0, .08, mat.black, x, 3.7, 3.75);
    }

    // -------------------------------------------------------------------------
    // Center jewelry building
    // -------------------------------------------------------------------------
    const jewelry = new THREE.Group();
    jewelry.position.set(0, 0, 0);
    scene.add(jewelry);

    b(jewelry, 10.8, 7.0, 7.0, mat.plasterWarm, 0, 3.5, 0);
    b(jewelry, 11.7, .35, 8.0, mat.stone, 0, .18, 0);
    b(jewelry, 12.0, .35, 8.25, mat.roof, 0, 7.25, 0);

    // Central gabled roof
    const gable = new THREE.Mesh(
      new THREE.ConeGeometry(7.1, 4.8, 4),
      mat.roof
    );
    gable.rotation.y = Math.PI / 4;
    gable.position.y = 9.65;
    gable.scale.z = .76;
    gable.castShadow = true;
    gable.receiveShadow = true;
    jewelry.add(gable);

    // Timber facade
    for (const x of [-4.8, -2.4, 0, 2.4, 4.8]) {
      b(jewelry, .25, 6.8, .3, mat.wood, x, 3.45, 3.55);
    }
    for (const x of [-3.7, -1.8, .1, 2.0, 3.9]) {
      b(jewelry, .18, 6.6, .22, mat.wood, x, 3.35, 3.62);
    }
    b(jewelry, 10.8, .26, .34, mat.wood, 0, 6.8, 3.62);

    // Main doorway
    b(jewelry, 2.7, 3.8, .35, mat.woodDark, 0, 1.9, 3.65);
    b(jewelry, 2.85, .22, .5, mat.gold, 0, 3.85, 3.7);
    const door = new THREE.Mesh(
      new THREE.PlaneGeometry(2.45, 3.45),
      new THREE.MeshStandardMaterial({
        color: 0x243a34,
        emissive: 0x10241f,
        roughness: .7
      })
    );
    door.position.set(0, 1.8, 3.84);
    jewelry.add(door);

    // Side windows
    for (const x of [-3.6, 3.6]) {
      b(jewelry, .3, 2.2, .3, mat.woodDark, x, 2.55, 3.65);
      b(jewelry, .38, 1.65, .08, mat.window, x, 2.55, 3.83);
    }

    // Upper windows
    for (const x of [-3.4, 3.4]) {
      b(jewelry, .32, 1.45, .32, mat.woodDark, x, 5.7, 3.65);
      b(jewelry, .4, .98, .08, mat.window, x, 5.7, 3.84);
    }

    // Fleur-de-lis sign
    const fleurCanvas = document.createElement("canvas");
    fleurCanvas.width = 256;
    fleurCanvas.height = 256;
    const fctx = fleurCanvas.getContext("2d");
    fctx.fillStyle = "#f2bd55";
    fctx.fillRect(0, 0, 256, 256);
    fctx.strokeStyle = "#263b32";
    fctx.lineWidth = 18;
    fctx.strokeRect(12, 12, 232, 232);
    fctx.fillStyle = "#263b32";
    fctx.textAlign = "center";
    fctx.textBaseline = "middle";
    fctx.font = "bold 92px Georgia";
    fctx.fillText("JEWELRY", 128, 126);
    const fleurTexture = new THREE.CanvasTexture(fleurCanvas);
    fleurTexture.colorSpace = THREE.SRGBColorSpace;

    const fleur = new THREE.Mesh(
      new THREE.CircleGeometry(2.25, 48),
      new THREE.MeshBasicMaterial({ map: fleurTexture })
    );
    fleur.position.set(0, 6.75, 3.88);
    jewelry.add(fleur);

    sign("JEWELRY", 4.2, 1.1, 0, 7.65, 3.95, "#ffd37a");

    // Small side shops
    b(jewelry, 3.4, 4.2, 4.7, mat.plasterCool, -5.4, 2.1, 0);
    b(jewelry, 3.5, .28, 5.0, mat.roof, -5.4, 4.35, 0);
    b(jewelry, 3.4, 4.2, 4.7, mat.plaster, 5.4, 2.1, 0);
    b(jewelry, 3.5, .28, 5.0, mat.roof, 5.4, 4.35, 0);

    b(jewelry, .26, 2.1, .26, mat.woodDark, -7.1, 2.6, 2.35);
    b(jewelry, .34, 1.55, .08, mat.window, -7.1, 2.6, 2.49);
    b(jewelry, .26, 2.1, .26, mat.woodDark, 7.1, 2.6, 2.35);
    b(jewelry, .34, 1.55, .08, mat.window, 7.1, 2.6, 2.49);

    sign("ACCESSORIES", 3.0, .68, -5.4, 3.25, 2.42, "#e9c47b");
    sign("GOLD", 2.3, .62, 5.4, 3.25, 2.42, "#e9c47b");

    // -------------------------------------------------------------------------
    // Right building and mail stand
    // -------------------------------------------------------------------------
    const rightBuilding = new THREE.Group();
    rightBuilding.position.set(11.5, 0, 1.5);
    scene.add(rightBuilding);

    b(rightBuilding, 10.5, 8.0, 7.0, mat.plaster, 0, 4.0, 0);
    b(rightBuilding, 11.4, .35, 8.0, mat.stone, 0, .18, 0);
    b(rightBuilding, 11.8, .35, 8.2, mat.roof, 0, 8.25, 0);

    for (const x of [-4.7, 4.7]) {
      b(rightBuilding, .28, 7.9, .32, mat.wood, x, 3.95, 3.55);
    }
    for (const x of [-3.7, -1.8, .1, 2.0, 3.9]) {
      b(rightBuilding, .18, 7.7, .22, mat.wood, x, 3.85, 3.62);
    }
    b(rightBuilding, 10.8, .25, .34, mat.wood, 0, 7.9, 3.62);

    for (const x of [-3.4, 3.4]) {
      b(rightBuilding, .3, 1.4, .3, mat.woodDark, x, 6.45, 3.65);
      b(rightBuilding, .38, .95, .08, mat.window, x, 6.45, 3.84);
    }

    for (const x of [-4.3, 4.3]) {
      b(rightBuilding, .3, 2.2, .3, mat.woodDark, x, 2.65, 3.65);
      b(rightBuilding, .38, 1.6, .08, mat.window, x, 2.65, 3.84);
    }

    sign("POST", 2.4, .7, 0, 6.95, 3.9, "#d7e3d0");
    sign("EAST", 1.7, .55, 4.3, 3.1, 3.9, "#d7e3d0");

    // Mail stand
    const mail = new THREE.Group();
    mail.position.set(8.8, 0, 3.8);
    scene.add(mail);

    for (const x of [-.72, .72]) {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(.08, .11, 1.6, 8),
        mat.wood
      );
      leg.position.set(x, .8, 0);
      leg.castShadow = true;
      mail.add(leg);
    }
    b(mail, 1.95, .16, .85, mat.topHat, 0, 1.65, 0);
    b(mail, 2.15, .18, .95, mat.hatBand, 0, 1.8, 0);

    const mailTube = new THREE.Mesh(
      new THREE.CylinderGeometry(.28, .32, 1.25, 16),
      mat.topHat
    );
    mailTube.position.y = 2.55;
    mailTube.castShadow = true;
    mail.add(mailTube);

    const mailOpening = new THREE.Mesh(
      new THREE.CylinderGeometry(.19, .19, .08, 16, 1, true),
      new THREE.MeshStandardMaterial({
        color: 0x3d1711,
        emissive: 0x160804,
        roughness: .8
      })
    );
    mailOpening.rotation.z = Math.PI;
    mailOpening.position.y = 2.97;
    mail.add(mailOpening);

    const mailLabel = addTextSprite("mail", {
      color: "#ffe0a0",
      width: 1.8,
      height: .48
    });
    mailLabel.position.set(8.8, 2.15, 4.25);
    mailLabel.scale.multiplyScalar(.72);
    scene.add(mailLabel);

    // -------------------------------------------------------------------------
    // Street lamps
    // -------------------------------------------------------------------------
    poleLamp(-5.1, 2.1, 5.1, 1);
    poleLamp(5.1, 2.1, 5.1, 1);
    poleLamp(-10.2, 7.0, 5.4, -1);
    poleLamp(10.2, 7.0, 5.4, 1);

    // -------------------------------------------------------------------------
    // Trees
    // -------------------------------------------------------------------------
    function tree(x, z, scale = 1) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      group.scale.setScalar(scale);
      scene.add(group);

      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(.22, .34, 2.6, 8),
        mat.trunk
      );
      trunk.position.y = 1.3;
      trunk.castShadow = true;
      group.add(trunk);

      const crown = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.75, 1),
        mat.leaf
      );
      crown.position.y = 3.35;
      crown.scale.set(1, 1.15, .9);
      crown.castShadow = true;
      crown.receiveShadow = true;
      group.add(crown);

      const crown2 = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.25, 1),
        mat.leafLight
      );
      crown2.position.set(.55, 4.05, .15);
      crown2.castShadow = true;
      group.add(crown2);

      const crown3 = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.1, 1),
        mat.leaf
      );
      crown3.position.set(-.65, 3.75, -.2);
      crown3.castShadow = true;
      group.add(crown3);

      return group;
    }

    tree(-7.2, 6.2, .95);
    tree(7.1, 6.4, 1.05);
    tree(-13.0, -4.0, .85);
    tree(13.0, -4.2, .9);

    // -------------------------------------------------------------------------
    // Benches, crates, barrels, and small props
    // -------------------------------------------------------------------------
    function bench(x, z, rotation = 0) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      group.rotation.y = rotation;
      scene.add(group);

      for (const dx of [-.75, .75]) {
        const leg = new THREE.Mesh(
          new THREE.BoxGeometry(.18, .65, .55),
          mat.woodDark
        );
        leg.position.set(dx, .32, 0);
        leg.castShadow = true;
        group.add(leg);
      }

      for (const y of [.65, 1.05]) {
        const seat = new THREE.Mesh(
          new THREE.BoxGeometry(2.05, .16, .55),
          mat.wood
        );
        seat.position.set(0, y, 0);
        seat.castShadow = true;
        group.add(seat);
      }

      const back = new THREE.Mesh(
        new THREE.BoxGeometry(2.05, .72, .14),
        mat.wood
      );
      back.position.set(0, 1.4, -.24);
      back.rotation.x = -.12;
      back.castShadow = true;
      group.add(back);

      return group;
    }

    bench(-3.6, 3.7, -.25);
    bench(3.7, 3.7, .25);
    bench(-10.8, -2.0, .35);

    function barrel(x, z) {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(.48, .48, 1.0, 14),
        mat.wood
      );
      mesh.position.set(x, .5, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);

      for (const y of [.25, .75]) {
        const band = new THREE.Mesh(
          new THREE.CylinderGeometry(.5, .5, .08, 14),
          mat.woodDark
        );
        band.position.set(x, y, z);
        band.castShadow = true;
        scene.add(band);
      }
    }

    barrel(-6.6, 1.2);
    barrel(6.7, 1.0);

    // A few crates
    for (const [x, z, rot] of [[-8.8, 2.2, .1], [9.2, 2.0, -.15]]) {
      const crate = new THREE.Group();
      crate.position.set(x, 0, z);
      crate.rotation.y = rot;
      scene.add(crate);
      b(crate, 1.1, .65, .9, mat.wood, 0, .32, 0);
      b(crate, 1.2, .08, .98, mat.woodLight, 0, .65, 0);
      for (const dx of [-.45, .45]) {
        b(crate, .08, .65, .95, mat.woodDark, dx, .32, 0);
      }
    }

    // Small fountain at the front
    const fountain = new THREE.Group();
    fountain.position.set(0, 0, 11.5);
    scene.add(fountain);

    const basin = new THREE.Mesh(
      new THREE.CylinderGeometry(1.65, 1.85, .48, 24),
      mat.stone
    );
    basin.position.y = .24;
    basin.castShadow = true;
    basin.receiveShadow = true;
    fountain.add(basin);

    const water = new THREE.Mesh(
      new THREE.CylinderGeometry(1.38, 1.38, .08, 24),
      new THREE.MeshStandardMaterial({
        color: 0x79aeb2,
        roughness: .22,
        metalness: .08
      })
    );
    water.position.y = .51;
    fountain.add(water);

    const fountainStem = new THREE.Mesh(
      new THREE.CylinderGeometry(.13, .22, 1.8, 10),
      mat.stone
    );
    fountainStem.position.y = 1.4;
    fountainStem.castShadow = true;
    fountain.add(fountainStem);

    const fountainBowl = new THREE.Mesh(
      new THREE.CylinderGeometry(.72, .42, .35, 16),
      mat.stone
    );
    fountainBowl.position.y = 2.35;
    fountainBowl.castShadow = true;
    fountain.add(fountainBowl);

    // Small street sign
    const streetSign = new THREE.Group();
    streetSign.position.set(-2.8, 0, 6.4);
    scene.add(streetSign);

    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(.09, .12, 2.2, 8),
      mat.woodDark
    );
    post.position.y = 1.1;
    post.castShadow = true;
    streetSign.add(post);

    const streetPlate = new THREE.Mesh(
      new THREE.PlaneGeometry(1.45, .72),
      new THREE.MeshStandardMaterial({
        color: 0x263b32,
        roughness: .8
      })
    );
    streetPlate.position.set(0, 1.85, .08);
    streetSign.add(streetPlate);

    const streetText = addTextSprite("MARKET", {
      color: "#ffd88a",
      width: 2.2,
      height: 1.1
    });
    streetText.position.set(-2.8, 1.85, 6.48);
    streetText.scale.multiplyScalar(.75);
    scene.add(streetText);

    // -------------------------------------------------------------------------
    // Floating dust / fireflies
    // -------------------------------------------------------------------------
    const particleCount = 140;
    const particlePositions = new Float32Array(particleCount * 3);
    const particlePhases = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - .5) * 34;
      particlePositions[i * 3 + 1] = Math.random() * 8 + .3;
      particlePositions[i * 3 + 2] = (Math.random() - .5) * 28;
      particlePhases[i] = Math.random() * Math.PI * 2;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: 0xffcf76,
        size: .09,
        transparent: true,
        opacity: .55,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    );
    scene.add(particles);

    // -------------------------------------------------------------------------
    // Camera controls implemented directly
    // -------------------------------------------------------------------------
    const controls = {
      target: new THREE.Vector3(0, 3.0, 0),
      radius: 27,
      theta: 0,
      phi: 1.18,
      minRadius: 13,
      maxRadius: 42,
      minPhi: .45,
      maxPhi: 1.48
    };

    const initial = {
      target: controls.target.clone(),
      radius: controls.radius,
      theta: controls.theta,
      phi: controls.phi
    };

    function updateCamera() {
      controls.phi = THREE.MathUtils.clamp(controls.phi, controls.minPhi, controls.maxPhi);
      controls.radius = THREE.MathUtils.clamp(controls.radius, controls.minRadius, controls.maxRadius);

      const sinPhi = Math.sin(controls.phi);
      camera.position.set(
        controls.target.x + controls.radius * sinPhi * Math.sin(controls.theta),
        controls.target.y + controls.radius * Math.cos(controls.phi),
        controls.target.z + controls.radius * sinPhi * Math.cos(controls.theta)
      );
      camera.lookAt(controls.target);
    }

    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    renderer.domElement.addEventListener("pointerdown", event => {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
    });

    renderer.domElement.addEventListener("pointermove", event => {
      if (!dragging) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;

      controls.theta -= dx * .006;
      controls.phi -= dy * .005;
      updateCamera();
    });

    function endDrag(event) {
      dragging = false;
      if (event.pointerId !== undefined && renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
    }

    renderer.domElement.addEventListener("pointerup", endDrag);
    renderer.domElement.addEventListener("pointercancel", endDrag);

    renderer.domElement.addEventListener("wheel", event => {
      event.preventDefault();
      controls.radius += event.deltaY * .012;
      updateCamera();
    }, { passive: false });

    addEventListener("keydown", event => {
      if (event.key.toLowerCase() === "r") {
        controls.target.copy(initial.target);
        controls.radius = initial.radius;
        controls.theta = initial.theta;
        controls.phi = initial.phi;
        updateCamera();
      }
    });

    addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    });

    updateCamera();

    // -------------------------------------------------------------------------
    // Animation
    // -------------------------------------------------------------------------
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      particles.rotation.y = t * .018;
      particles.position.y = Math.sin(t * .28) * .12;

      for (let i = 0; i < particleCount; i++) {
        const yIndex = i * 3 + 1;
        particlePositions[yIndex] += Math.sin(t * .55 + particlePhases[i]) * .0018;
        if (particlePositions[yIndex] > 8.5) particlePositions[yIndex] = .3;
      }
      particleGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    }

    animate();
  

  // --- Walker Update Protocol ---
  function update(t, dt) {
    if (typeof updateHook === "function") {
      try {
        updateHook(t, dt);
      } catch (e) {}
    }
  }

  return {
    group,
    update,
    spawn: { x: 0.0, z: 14.0, yaw: 0 },
    relic: { id: "generic", name: "Kingdom Hearts Relic", x: -10.0, z: -12.0 },
    env:   { background: 0x1b1b24, fogColor: 0x1b1b24, fogDensity: 0.025 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 },
      east: { x: 12.0, z: 10.0 },
      west: { x: -12.0, z: -10.0 }
    }
  };
}

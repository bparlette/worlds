// @world {"id": "1031", "title": "The Legend of Zelda: Link's Awakening", "sub": "Koholint Island", "system": "3D Render"}
// Converted from 1031-the_legend_of_zelda_linkx27s_awakening_koholint_island.html into a Back Roms World Walker module.

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
  // (strict modules throw where sloppy scripts did not): ly, lz, py, pz
  let ly = 0;
  let lz = 0;
  let py = 0;
  let pz = 0;

    

    // -------------------------------------------------------------------------
    // Scene
    // -------------------------------------------------------------------------

    // scene redirect
    scene.background = new THREE.Color(0x8fdcff);
    scene.fog = new THREE.Fog(0x8fdcff, 22, 42);

    camera = dummyCamera();

    renderer = dummyRenderer();

    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    

    const hemi = new THREE.HemisphereLight(0xe9fbff, 0x6e8b49, 2.1);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xfff4d6, 3.2);
    sun.position.set(8, 14, 7);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -12;
    sun.shadow.camera.right = 12;
    sun.shadow.camera.top = 12;
    sun.shadow.camera.bottom = -12;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 35;
    sun.shadow.bias = -0.0005;
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0x8bdfff, 0.8);
    fill.position.set(-8, 5, -7);
    scene.add(fill);

    // -------------------------------------------------------------------------
    // Voxel materials
    // -------------------------------------------------------------------------

    const mat = {
      blue: new THREE.MeshStandardMaterial({
        color: 0x287da8,
        roughness: 0.72
      }),
      darkBlue: new THREE.MeshStandardMaterial({
        color: 0x184c73,
        roughness: 0.78
      }),
      teal: new THREE.MeshStandardMaterial({
        color: 0x25b8a3,
        roughness: 0.68
      }),
      orange: new THREE.MeshStandardMaterial({
        color: 0xf28b38,
        roughness: 0.7
      }),
      red: new THREE.MeshStandardMaterial({
        color: 0xe84e43,
        roughness: 0.7
      }),
      yellow: new THREE.MeshStandardMaterial({
        color: 0xf4d44d,
        roughness: 0.72
      }),
      green: new THREE.MeshStandardMaterial({
        color: 0x49b65e,
        roughness: 0.8
      }),
      darkGreen: new THREE.MeshStandardMaterial({
        color: 0x267949,
        roughness: 0.85
      }),
      leaf: new THREE.MeshStandardMaterial({
        color: 0x65c96a,
        roughness: 0.82
      }),
      trunk: new THREE.MeshStandardMaterial({
        color: 0x8b5331,
        roughness: 0.9
      }),
      sand: new THREE.MeshStandardMaterial({
        color: 0xf2d18a,
        roughness: 0.95
      }),
      path: new THREE.MeshStandardMaterial({
        color: 0xd9a75d,
        roughness: 0.95
      }),
      water: new THREE.MeshStandardMaterial({
        color: 0x36b9d0,
        roughness: 0.32,
        metalness: 0.05
      }),
      waterLight: new THREE.MeshStandardMaterial({
        color: 0x8de9ee,
        roughness: 0.4
      }),
      egg: new THREE.MeshStandardMaterial({
        color: 0xf5e8ca,
        roughness: 0.7,
        emissive: 0x4b3a16,
        emissiveIntensity: 0.08
      }),
      cloud: new THREE.MeshStandardMaterial({
        color: 0xf6fbff,
        roughness: 1
      }),
      black: new THREE.MeshStandardMaterial({
        color: 0x202933,
        roughness: 0.6
      }),
      white: new THREE.MeshStandardMaterial({
        color: 0xf8faf5,
        roughness: 0.72
      })
    };

    // -------------------------------------------------------------------------
    // Voxel helpers
    // -------------------------------------------------------------------------

    const V = (x, y, z, sx = 1, sy = 1, sz = 1, material = mat.white) =>
      new THREE.Mesh(
        new THREE.BoxGeometry(sx, sy, sz),
        material
      );

    const voxelBox = (
      x, y, z,
      sx, sy, sz,
      material = mat.white,
      castShadow = true,
      receiveShadow = true
    ) => {
      const mesh = V(x, y, z, sx, sy, sz, material);
      mesh.castShadow = castShadow;
      mesh.receiveShadow = receiveShadow;
      scene.add(mesh);
      return mesh;
    };

    const voxels = [];

    function addVoxel(x, y, z, sx = 1, sy = 1, sz = 1, material = mat.white) {
      voxels.push({ x, y, z, sx, sy, sz, material });
    }

    function buildVoxels() {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const materialMap = new Map();

      for (const voxel of voxels) {
        const key = voxel.material?.id || voxel.material;
        if (!materialMap.has(key)) {
          materialMap.set(key, new THREE.MeshStandardMaterial(voxel.material));
        }

        const mesh = new THREE.Mesh(geometry, materialMap.get(key));
        mesh.position.set(voxel.x, voxel.y, voxel.z);
        mesh.scale.set(voxel.sx, voxel.sy, voxel.sz);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);
      }
    }

    // -------------------------------------------------------------------------
    // Console base: stylized split-screen handheld
    // -------------------------------------------------------------------------

    addVoxel(-4.35, 0.2, 0, 7.1, 0.35, 5.3, mat.darkBlue);
    addVoxel(4.35, 0.2, 0, 7.1, 0.35, 5.3, mat.red);
    addVoxel(0, 0.2, 0, 8.7, 0.35, 5.3, mat.darkBlue);

    // Raised screen bezel around the island.
    addVoxel(-4.3, 0.48, 2.65, 7.0, 0.25, 0.35, mat.black);
    addVoxel(-4.3, 0.48, -2.65, 7.0, 0.25, 0.35, mat.black);
    addVoxel(4.3, 0.48, 2.65, 7.0, 0.25, 0.35, mat.black);
    addVoxel(4.3, 0.48, -2.65, 7.0, 0.25, 0.35, mat.black);
    addVoxel(0, 0.48, 2.65, 8.6, 0.25, 0.35, mat.black);
    addVoxel(0, 0.48, -2.65, 8.6, 0.25, 0.35, mat.black);

    // Left controller buttons.
    voxelBox(-6.25, 0.48, 1.8, 0.85, 0.32, 0.85, mat.black);
    voxelBox(-6.25, 0.48, 0.15, 0.85, 0.32, 0.85, mat.black);
    voxelBox(-6.25, 0.48, -1.55, 0.85, 0.32, 0.85, mat.black);

    voxelBox(-5.55, 0.48, 1.9, 0.38, 0.25, 0.38, mat.yellow);
    voxelBox(-5.55, 0.48, 0.1, 0.38, 0.25, 0.38, mat.yellow);
    voxelBox(-5.55, 0.48, -1.55, 0.38, 0.25, 0.38, mat.yellow);

    // Small left analog stick.
    voxelBox(-6.95, 0.48, 0.15, 0.5, 0.2, 0.5, mat.black);
    voxelBox(-6.95, 0.48, 0.15, 0.25, 0.12, 0.25, mat.white);

    // Right controller buttons.
    voxelBox(6.25, 0.48, 1.8, 0.85, 0.32, 0.85, mat.black);
    voxelBox(6.25, 0.48, 0.15, 0.85, 0.32, 0.85, mat.black);
    voxelBox(6.25, 0.48, -1.55, 0.85, 0.32, 0.85, mat.black);

    voxelBox(5.55, 0.48, 1.9, 0.38, 0.25, 0.38, mat.yellow);
    voxelBox(5.55, 0.48, 0.1, 0.38, 0.25, 0.38, mat.yellow);
    voxelBox(5.55, 0.48, -1.55, 0.38, 0.25, 0.38, mat.yellow);

    // Right analog stick.
    voxelBox(6.95, 0.48, 0.15, 0.5, 0.2, 0.5, mat.black);
    voxelBox(6.95, 0.48, 0.15, 0.25, 0.12, 0.25, mat.white);

    // Screen glass / subtle panel divisions.
    addVoxel(-3.5, 0.66, 0, 0.08, 0.08, 4.9, mat.blue);
    addVoxel(3.5, 0.66, 0, 0.08, 0.08, 4.9, mat.blue);

    // -------------------------------------------------------------------------
    // Ocean and island
    // -------------------------------------------------------------------------

    // Broad ocean platform under the island.
    addVoxel(0, 0.1, 0, 12.8, 0.35, 10.8, mat.water);
    addVoxel(0, -0.15, 0, 13.0, 0.3, 11.0, mat.waterLight);

    // Animated-looking ocean tiles.
    const oceanTiles = [
      [-3.8, 0.35, 2.1, 2.0, 0.12, 1.2, mat.waterLight],
      [-2.6, 0.35, 3.0, 1.6, 0.12, 0.9, mat.water],
      [2.4, 0.35, 3.2, 1.7, 0.12, 1.0, mat.waterLight],
      [3.8, 0.35, 1.8, 1.8, 0.12, 0.9, mat.water],
      [0.0, 0.35, -3.2, 4.2, 0.12, 0.8, mat.waterLight],
      [-4.8, 0.35, -1.2, 1.2, 0.12, 2.0, mat.water],
      [4.8, 0.35, -1.2, 1.2, 0.12, 2.0, mat.water]
    ];

    for (const tile of oceanTiles) {
      addVoxel(tile[0], tile[1], tile[2], tile[3], tile[4], tile[5], tile[6]);
    }

    // Island base.
    addVoxel(0, 0.35, 0, 5.8, 0.35, 4.7, mat.sand);
    addVoxel(0, 0.15, 0, 5.4, 0.25, 4.3, mat.path);

    // Beach rim.
    const beach = [
      [-2.3, 0.55, 1.9], [-1.8, 0.55, 2.25], [-0.9, 0.55, 2.4],
      [0.1, 0.55, 2.35], [1.2, 0.55, 2.15], [2.2, 0.55, 1.8],
      [2.65, 0.55, 0.6], [2.55, 0.55, -0.8], [2.25, 0.55, -1.8],
      [1.0, 0.55, -2.05], [-0.4, 0.55, -2.05], [-1.6, 0.55, -1.75],
      [-2.25, 0.55, -0.8], [-2.45, 0.55, 0.55]
    ];

    for (const p of beach) {
      addVoxel(p[0], p[1], p[2], 0.62, 0.22, 0.62, mat.sand);
    }

    // Path leading toward the volcano.
    addVoxel(0, 0.67, 0.9, 0.55, 0.12, 1.4, mat.path);
    addVoxel(0, 0.67, 1.7, 0.55, 0.12, 0.65, mat.path);
    addVoxel(0, 0.67, 2.35, 0.55, 0.12, 0.55, mat.path);

    // -------------------------------------------------------------------------
    // Island vegetation
    // -------------------------------------------------------------------------

    function tree(x, z, scale = 1, variant = 0) {
      const y = 0.7;
      const s = scale;

      addVoxel(x, y + 0.18 * s, z, 0.38 * s, 0.36 * s, 0.38 * s, mat.trunk);
      addVoxel(x, y + 0.62 * s, z, 0.58 * s, 0.54 * s, 0.58 * s, mat.darkGreen);
      addVoxel(x - 0.18 * s, y + 1.0 * s, z + 0.04 * s, 0.7 * s, 0.66 * s, 0.7 * s, mat.leaf);
      addVoxel(x + 0.18 * s, y + 1.0 * s, z - 0.04 * s, 0.66 * s, 0.6 * s, 0.66 * s, mat.leaf);
      addVoxel(x + 0.04 * s, y + 1.38 * s, z, 0.52 * s, 0.5 * s, 0.52 * s, mat.green);
    }

    tree(-1.55, 0.85, 1.05, 0);
    tree(-0.75, -1.05, 0.85, 1);
    tree(1.25, -1.2, 0.9, 0);
    tree(2.0, 0.55, 0.78, 1);
    tree(-2.25, -0.65, 0.72, 0);

    // Palm trees.
    function palm(x, z, scale = 1) {
      const y = 0.65;
      const s = scale;

      addVoxel(x, y + 0.18 * s, z, 0.3 * s, 0.36 * s, 0.3 * s, mat.trunk);
      addVoxel(x, y + 0.62 * s, z, 0.2 * s, 1.2 * s, 0.2 * s, mat.trunk);

      const leaves = [
        [-0.3, 1.35, 0.1, -0.55],
        [0.3, 1.4, 0.05, 0.55],
        [-0.15, 1.65, -0.1, 0.05]
      ];

      for (const [lx, ly, lz, angle] of leaves) {
        addVoxel(
          x + lx * s,
          y + ly * s,
          z + lz * s,
          0.9 * s,
          0.22 * s,
          0.35 * s,
          mat.leaf
        );
        addVoxel(
          x + lx * s + Math.cos(angle) * 0.25 * s,
          y + ly * s,
          z + lz * s + Math.sin(angle) * 0.25 * s,
          0.72 * s,
          0.18 * s,
          0.28 * s,
          mat.green
        );
      }
    }

    palm(-1.1, -0.35, 0.85);
    palm(1.25, 0.45, 0.78);
    palm(-2.35, 1.45, 0.68);

    // Rocks.
    const rockMaterial = new THREE.MeshStandardMaterial({
      color: 0x73807c,
      roughness: 1
    });

    function rock(x, z, scale = 1) {
      addVoxel(x, 0.55 * scale, z, 0.55 * scale, 0.45 * scale, 0.5 * scale, rockMaterial);
      addVoxel(x + 0.18 * scale, 0.82 * scale, z + 0.08 * scale, 0.38 * scale, 0.28 * scale, 0.35 * scale, rockMaterial);
    }

    rock(-2.75, -1.25, 0.8);
    rock(2.8, -1.55, 0.65);
    rock(0.85, 2.35, 0.45);

    // -------------------------------------------------------------------------
    // Link and Toon Link
    // -------------------------------------------------------------------------

    function createHero(x, z, heroMaterial, hatColor, hatBandColor) {
      const y = 0.72;
      const s = 0.38;

      // Legs
      voxelBox(x - 0.13 * s, y + 0.15 * s, z, 0.22 * s, 0.3 * s, 0.25 * s, heroMaterial);
      voxelBox(x + 0.13 * s, y + 0.15 * s, z, 0.22 * s, 0.3 * s, 0.25 * s, heroMaterial);

      // Torso
      voxelBox(x, y + 0.57 * s, z, 0.58 * s, 0.56 * s, 0.34 * s, heroMaterial);

      // Head
      voxelBox(x, y + 0.98 * s, z, 0.4 * s, 0.4 * s, 0.36 * s, mat.yellow);
      voxelBox(x, y + 1.18 * s, z, 0.34 * s, 0.18 * s, 0.3 * s, mat.yellow);

      // Hair
      voxelBox(x - 0.06 * s, y + 1.1 * s, z + 0.05 * s, 0.4 * s, 0.25 * s, 0.18 * s, mat.orange);
      voxelBox(x + 0.12 * s, y + 0.95 * s, z + 0.1 * s, 0.28 * s, 0.3 * s, 0.18 * s, mat.orange);

      // Hat
      voxelBox(x, y + 1.32 * s, z, 0.66 * s, 0.13 * s, 0.4 * s, hatColor);
      voxelBox(x, y + 1.42 * s, z, 0.5 * s, 0.08 * s, 0.3 * s, hatBandColor);

      // Arms
      voxelBox(x - 0.38 * s, y + 0.61 * s, z, 0.18 * s, 0.42 * s, 0.22 * s, heroMaterial);
      voxelBox(x + 0.38 * s, y + 0.61 * s, z, 0.18 * s, 0.42 * s, 0.22 * s, heroMaterial);

      // Boots
      voxelBox(x - 0.13 * s, y + 0.03 * s, z + 0.08 * s, 0.25 * s, 0.18 * s, 0.38 * s, mat.darkBlue);
      voxelBox(x + 0.13 * s, y + 0.03 * s, z + 0.08 * s, 0.25 * s, 0.18 * s, 0.38 * s, mat.darkBlue);
    }

    createHero(-0.45, 0.15, mat.blue, mat.orange, mat.yellow);
    createHero(0.55, 0.15, mat.green, mat.yellow, mat.red);

    // A small campfire or lantern.
    voxelBox(-1.0, 1.15, 0.1, 0.28, 0.25, 0.28, mat.trunk);
    voxelBox(-1.0, 1.48, 0.1, 0.34, 0.16, 0.34, mat.orange);
    voxelBox(-1.0, 1.65, 0.1, 0.18, 0.18, 0.18, mat.yellow);

    // -------------------------------------------------------------------------
    // Volcano
    // -------------------------------------------------------------------------

    const volcano = new THREE.Group();
    scene.add(volcano);

    // Brown cone made from stacked voxel rings.
    const volcanoRings = [
      { y: 1.2, radius: 2.25 },
      { y: 1.75, radius: 1.9 },
      { y: 2.3, radius: 1.55 },
      { y: 2.85, radius: 1.15 },
      { y: 3.4, radius: 0.75 }
    ];

    for (const ring of volcanoRings) {
      const segments = 12;
      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const x = Math.cos(angle) * ring.radius;
        const z = Math.sin(angle) * ring.radius;
        addVoxel(
          x,
          ring.y,
          z,
          0.72,
          0.72,
          0.72,
          mat.trunk
        );
      }
    }

    // Summit rim.
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      addVoxel(
        Math.cos(angle) * 0.65,
        3.9,
        Math.sin(angle) * 0.65,
        0.65,
        0.65,
        0.65,
        mat.darkGreen
      );
    }

    // Crater.
    addVoxel(0, 4.05, 0, 0.85, 0.5, 0.85, mat.black);
    addVoxel(0, 4.38, 0, 0.48, 0.35, 0.48, mat.egg);

    // Egg markings.
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      addVoxel(
        Math.cos(angle) * 0.27,
        4.38,
        Math.sin(angle) * 0.27,
        0.12,
        0.08,
        0.12,
        mat.red
      );
    }

    // -------------------------------------------------------------------------
    // Clouds
    // -------------------------------------------------------------------------

    function cloud(x, y, z, scale = 1) {
      const pieces = [
        [-0.8, 0, 0, 0.8],
        [-0.2, 0.25, 0, 1.0],
        [0.45, 0.1, 0, 0.85],
        [0.95, -0.05, 0, 0.55],
        [0.15, -0.15, 0, 0.95]
      ];

      for (const [px, py, pz, size] of pieces) {
        addVoxel(
          x + px * scale,
          y + py * scale,
          z + pz * scale,
          size * scale,
          size * scale * 0.7,
          size * scale,
          mat.cloud
        );
      }
    }

    cloud(-4.5, 5.2, -2.2, 1.25);
    cloud(4.7, 5.6, -2.8, 1.05);
    cloud(-1.5, 6.4, -4.4, 0.85);
    cloud(2.8, 6.1, -4.1, 0.9);

    // -------------------------------------------------------------------------
    // Birds
    // -------------------------------------------------------------------------

    const birdMaterial = new THREE.MeshStandardMaterial({
      color: 0xf4f8f5,
      roughness: 0.8
    });

    function bird(x, y, z, scale = 1, direction = 1) {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      group.scale.setScalar(scale);
      group.rotation.y = direction > 0 ? Math.PI / 2 : -Math.PI / 2;

      const body = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.14, 0.12), birdMaterial);
      body.castShadow = true;
      group.add(body);

      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.34), birdMaterial);
      tail.position.z = -0.2;
      tail.rotation.x = -0.35;
      group.add(tail);

      scene.add(group);
      return group;
    }

    const birds = [
      bird(-3.8, 5.8, 0.2, 0.8, 1),
      bird(3.6, 6.1, 0.5, 0.7, -1),
      bird(-1.2, 6.6, -1.8, 0.55, 1),
      bird(1.8, 6.4, -2.0, 0.5, -1)
    ];

    // -------------------------------------------------------------------------
    // Small accessories
    // -------------------------------------------------------------------------

    // Coconuts.
    const coconutMaterial = new THREE.MeshStandardMaterial({
      color: 0x7f4c24,
      roughness: 0.95
    });

    for (const [x, z, sx] of [[-2.5, 1.5, 0.4], [2.45, -0.35, 0.35], [1.85, 1.7, 0.3]]) {
      addVoxel(x, 0.65 * sx, z, sx, sx * 0.75, sx, coconutMaterial);
      addVoxel(x + sx * 0.25, 0.9 * sx, z + sx * 0.1, sx * 0.45, sx * 0.35, sx * 0.45, coconutMaterial);
    }

    // Shell.
    addVoxel(-2.9, 0.75, 1.1, 0.28, 0.16, 0.22, mat.orange);
    addVoxel(-2.9, 0.75, 1.1, 0.2, 0.1, 0.2, mat.yellow);

    // Small log.
    addVoxel(1.95, 0.68, -1.55, 1.3, 0.22, 0.3, mat.trunk);

    // -------------------------------------------------------------------------
    // Build instanced voxel geometry
    // -------------------------------------------------------------------------

    buildVoxels();

    // -------------------------------------------------------------------------
    // Custom camera controls — no addons
    // -------------------------------------------------------------------------

    const target = new THREE.Vector3(0, 2.0, 0);
    const defaultPosition = new THREE.Vector3(11, 9.5, 14);

    let azimuth = Math.acos((defaultPosition.x - target.x) / defaultPosition.length());
    let elevation = Math.asin((defaultPosition.y - target.y) / defaultPosition.length());
    let distance = defaultPosition.length();

    function updateCamera() {
      const x = target.x + distance * Math.sin(azimuth) * Math.cos(elevation);
      const y = target.y + distance * Math.sin(elevation);
      const z = target.z + distance * Math.cos(azimuth) * Math.cos(elevation);

      camera.position.set(x, y, z);
      camera.lookAt(target);
    }

    updateCamera();

    const pointer = new THREE.Vector2();
    let dragging = false;
    let previousX = 0;
    let previousY = 0;

    renderer.domElement.addEventListener("pointerdown", event => {
      dragging = true;
      previousX = event.clientX;
      previousY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
    });

    renderer.domElement.addEventListener("pointermove", event => {
      if (!dragging) return;

      const dx = event.clientX - previousX;
      const dy = event.clientY - previousY;
      previousX = event.clientX;
      previousY = event.clientY;

      azimuth -= dx * 0.006;
      elevation = THREE.MathUtils.clamp(elevation + dy * 0.005, 0.18, 1.25);
      updateCamera();
    });

    renderer.domElement.addEventListener("pointerup", event => {
      dragging = false;
      if (renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
    });

    renderer.domElement.addEventListener("pointercancel", () => {
      dragging = false;
    });

    renderer.domElement.addEventListener("wheel", event => {
      event.preventDefault();
      distance = THREE.MathUtils.clamp(
        distance + event.deltaY * 0.008,
        8,
        24
      );
      updateCamera();
    }, { passive: false });

    // -------------------------------------------------------------------------
    // Resize and animation
    // -------------------------------------------------------------------------

    addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(innerWidth, innerHeight);
    });

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Gentle ocean shimmer.
      scene.fog.density = 0.012 + Math.sin(time * 0.7) * 0.0015;

      // Birds bob and move slightly.
      birds.forEach((bird, i) => {
        bird.position.y += Math.sin(time * 1.1 + i) * 0.0008;
        bird.rotation.z = Math.sin(time * 1.4 + i) * 0.08;
      });

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
    relic: { id: "generic", name: "The Legend of Zelda: Link's Awakening Relic", x: -10.0, z: -12.0 },
    env:   { background: 0x8fdcff, fogColor: 0x8fdcff, fogDensity: 0.025 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 },
      east: { x: 12.0, z: 10.0 },
      west: { x: -12.0, z: -10.0 }
    }
  };
}

// @world {"id": "076", "title": "Super Mario 64", "sub": "Whomp&#x27;s Fortress", "system": "Console"}
// Converted from  into a Back Roms World Walker module.

import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js";

export function createWorld(THREE) {
  const group = new THREE.Group();

  let scene = {
    add: (...objs) => objs.forEach(o => o && group.add(o)),
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
      render: () => {}
    };
  }

  function dummyCamera() {
    return {
      position: (() => { const v = { set: () => v, copy: () => v, add: () => v, sub: () => v, addScaledVector: () => v, clone: () => v }; return v; })(),
      lookAt: () => {},
      updateProjectionMatrix: () => {}
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
  const container = dummyEl();
  const stage = dummyEl();
  const app = dummyEl();
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
  // (strict modules throw where sloppy scripts did not): h, r, windows
  let h = 0;
  let r = 0;
  let windows = 0;

    

    const canvas = dummyEl();

    renderer = dummyRenderer();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    // scene redirect
    scene.background = new THREE.Color(0x9a816c);
    scene.fog = new THREE.Fog(0x9a816c, 18, 42);

    camera = dummyCamera();

    const clock = new THREE.Clock();

    // ---------------------------------------------------------------------
    // Materials
    // ---------------------------------------------------------------------
    const mat = {
      ground: new THREE.MeshStandardMaterial({
        color: 0x83ad55,
        roughness: 0.96
      }),
      groundDark: new THREE.MeshStandardMaterial({
        color: 0x6f9243,
        roughness: 1
      }),
      path: new THREE.MeshStandardMaterial({
        color: 0xb9a77b,
        roughness: 0.95
      }),
      stone: new THREE.MeshStandardMaterial({
        color: 0x807664,
        roughness: 0.98
      }),
      stoneLight: new THREE.MeshStandardMaterial({
        color: 0xa99a7b,
        roughness: 0.96
      }),
      stoneDark: new THREE.MeshStandardMaterial({
        color: 0x4d514e,
        roughness: 1
      }),
      roof: new THREE.MeshStandardMaterial({
        color: 0x526673,
        roughness: 0.88
      }),
      roofRed: new THREE.MeshStandardMaterial({
        color: 0xb94f36,
        roughness: 0.9
      }),
      roofOrange: new THREE.MeshStandardMaterial({
        color: 0xd47a32,
        roughness: 0.88
      }),
      wood: new THREE.MeshStandardMaterial({
        color: 0x705039,
        roughness: 0.94
      }),
      woodLight: new THREE.MeshStandardMaterial({
        color: 0xa57b4e,
        roughness: 0.92
      }),
      water: new THREE.MeshStandardMaterial({
        color: 0x3d91bd,
        roughness: 0.28,
        metalness: 0.12,
        emissive: 0x0c273c,
        emissiveIntensity: 0.25
      }),
      hay: new THREE.MeshStandardMaterial({
        color: 0xe2b968,
        roughness: 1
      }),
      grass: new THREE.MeshStandardMaterial({
        color: 0x75a94b,
        roughness: 1
      }),
      grassDark: new THREE.MeshStandardMaterial({
        color: 0x527b38,
        roughness: 1
      }),
      trunk: new THREE.MeshStandardMaterial({
        color: 0x6f4931,
        roughness: 1
      }),
      leaves: new THREE.MeshStandardMaterial({
        color: 0x4f8b4b,
        roughness: 1
      }),
      leavesLight: new THREE.MeshStandardMaterial({
        color: 0x72a85b,
        roughness: 1
      }),
      gold: new THREE.MeshStandardMaterial({
        color: 0xf4c46d,
        roughness: 0.48,
        metalness: 0.28
      })
    };

    // ---------------------------------------------------------------------
    // Voxel helpers
    // ---------------------------------------------------------------------
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

    function voxel(x, y, z, material, sx = 1, sy = 1, sz = 1) {
      const mesh = new THREE.Mesh(cubeGeometry, material);
      mesh.position.set(x, y, z);
      mesh.scale.set(sx, sy, sz);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      return mesh;
    }

    function blockColumn(x, z, y0, y1, material, width = 1, depth = 1) {
      for (let y = y0; y <= y1; y++) {
      voxel(x, y, z, material, width, 1, depth);
      }
    }

    function blockLayer(x, z, y, material, width, depth) {
      voxel(x, y, z, material, width, 1, depth);
    }

    function addCylinder(x, y, z, radius, height, material, segments = 1) {
      const geometry = new THREE.CylinderGeometry(
        radius,
        radius,
        height,
        segments
      );
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      return mesh;
    }

    function addCone(x, y, z, radius, height, material) {
      const geometry = new THREE.ConeGeometry(radius, height, 4);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      mesh.rotation.y = Math.PI / 4;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      return mesh;
    }

    // ---------------------------------------------------------------------
    // Island base and coastline
    // ---------------------------------------------------------------------
    // Main island footprint, made from discrete voxel blocks.
    const islandBlocks = [
      [-6, 0, -4], [-5,0,-4], [-4,0,-4], [-3,0,-4], [-2,0,-4],
      [-1,0,-4], [0,0,-4], [1,0,-4], [2,0,-4], [3,0,-4], [4,0,-4],
      [5,0,-4], [6,0,-4],

      [-6,0,-3], [-5,0,-3], [-4,0,-3], [-3,0,-3], [-2,0,-3],
      [-1,0,-3], [0,0,-3], [1,0,-3], [2,0,-3], [3,0,-3], [4,0,-3],
      [5,0,-3], [6,0,-3],

      [-6,0,-2], [-5,0,-2], [-4,0,-2], [-3,0,-2], [-2,0,-2],
      [-1,0,-2], [0,0,-2], [1,0,-2], [2,0,-2], [3,0,-2], [4,0,-2],
      [5,0,-2], [6,0,-2],

      [-6,0,-1], [-5,0,-1], [-4,0,-1], [-3,0,-1], [-2,0,-1],
      [-1,0,-1], [0,0,-1], [1,0,-1], [2,0,-1], [3,0,-1], [4,0,-1],
      [5,0,-1], [6,0,-1],

      [-6,0,0], [-5,0,0], [-4,0,0], [-3,0,0], [-2,0,0],
      [-1,0,0], [0,0,0], [1,0,0], [2,0,0], [3,0,0], [4,0,0],
      [5,0,0], [6,0,0],

      [-6,0,1], [-5,0,1], [-4,0,1], [-3,0,1], [-2,0,1],
      [-1,0,1], [0,0,1], [1,0,1], [2,0,1], [3,0,1], [4,0,1],
      [5,0,1], [6,0,1],

      [-6,0,2], [-5,0,2], [-4,0,2], [-3,0,2], [-2,0,2],
      [-1,0,2], [0,0,2], [1,0,2], [2,0,2], [3,0,2], [4,0,2],
      [5,0,2], [6,0,2],

      [-6,0,3], [-5,0,3], [-4,0,3], [-3,0,3], [-2,0,3],
      [-1,0,3], [0,0,3], [1,0,3], [2,0,3], [3,0,3], [4,0,3],
      [5,0,3], [6,0,3],

      [-6,0,4], [-5,0,4], [-4,0,4], [-3,0,4], [-2,0,4],
      [-1,0,4], [0,0,4], [1,0,4], [2,0,4], [3,0,4], [4,0,4],
      [5,0,4], [6,0,4],

      [-6,0,5], [-5,0,5], [-4,0,5], [-3,0,5], [-2,0,5],
      [-1,0,5], [0,0,5], [1,0,5], [2,0,5], [3,0,5], [4,0,5],
      [5,0,5], [6,0,5],

      [-6,0,6], [-5,0,6], [-4,0,6], [-3,0,6], [-2,0,6],
      [-1,0,6], [0,0,6], [1,0,6], [2,0,6], [3,0,6], [4,0,6],
      [5,0,6], [6,0,6]
    ];

    for (const [x, y, z] of islandBlocks) {
      voxel(x, y, z, mat.ground, 1, 1, 1);
    }

    // Raised stone perimeter.
    for (let x = -6; x <= 6; x++) {
      voxel(x, 0, -5, mat.stone, 1, 1, 1);
      voxel(x, 0, 5, mat.stone, 1, 1, 1);
    }

    for (let z = -5; z <= 5; z++) {
      voxel(-7, 0, z, mat.stone, 1, 1, 1);
      voxel(7, 0, z, mat.stone, 1, 1, 1);
    }

    // Lower retaining wall and seawall.
    for (let x = -6; x <= 6; x++) {
      voxel(x, -1, 5, mat.stoneDark, 1, 1, 1);
    }

    for (let z = 4; z <= 6; z++) {
      voxel(-7, -1, z, mat.stoneDark, 1, 1, 1);
      voxel(7, -1, z, mat.stoneDark, 1, 1, 1);
    }

    // Water pool in the front of the castle.
    for (let x = -3; x <= 2; x++) {
      for (let z = 3; z <= 4; z++) {
        voxel(x, 0, z, mat.water, 1, 0.35, 1);
      }
    }

    // Stone pool rim.
    for (let x = -4; x <= 3; x++) {
      voxel(x, 0, 5, mat.stoneLight, 1, 0.8, 1);
    }
    for (let z = 3; z <= 4; z++) {
      voxel(-4, 0, z, mat.stoneLight, 1, 0.8, 1);
      voxel(3, 0, z, mat.stoneLight, 1, 0.8, 1);
    }

    // Path from pool to gate and around the island.
    for (let x = -3; x <= 3; x++) {
      voxel(x, 0.45, 6, mat.path, 1, 0.6, 1);
    }
    for (let z = 6; z <= 7; z++) {
      voxel(-4, 0.45, z, mat.path, 1, 0.6, 1);
      voxel(4, 0.45, z, mat.path, 1, 0.6, 1);
    }
    for (let x = -4; x <= 4; x++) {
      voxel(x, 0.45, 7, mat.path, 1, 0.6, 1);
    }

    // ---------------------------------------------------------------------
    // Castle walls and towers
    // ---------------------------------------------------------------------
    // Central keep.
    blockColumn(0, -1, 1, 5, mat.stone, 3, 3);
    blockColumn(-1, -2, 1, 4, mat.stone, 2, 2);
    blockColumn(1, -2, 1, 4, mat.stone, 2, 2);

    // Stone cap and upper keep.
    blockLayer(0, -1, 6, mat.stoneLight, 4, 4);
    blockColumn(0, -1, 7, 8, mat.stoneLight, 3, 3);

    // Tall central tower.
    blockColumn(0, -2, 8, 11, mat.stoneLight, 2, 2);
    blockLayer(0, -2, 12, mat.stoneLight, 3, 3);
    addCone(0, 13.7, -2, 1.65, 2.2, mat.roofOrange);

    // Roof cap.
    voxel(0, 14.9, -2, mat.roofOrange, 2.2, 0.45, 2.2);

    // Side towers.
    for (const [x, z, h, r] of [
      [-4.5, -1, 4, 1.7],
      [4.5, -1, 4, 1.7],
      [-4.5, 3, 3, 1.4],
      [4.5, 3, 3, 1.4]
    ]) {
      blockColumn(x, z, 1, h, mat.stone, r, r);
      blockLayer(x, z, h + 1, mat.stoneLight, r + 0.4, r + 0.4);
      addCone(x, h + 2.1, z, r + 0.25, 1.6, mat.roofRed);
      voxel(x, h + 2.9, z, mat.roofRed, r + 0.5, 0.35, r + 0.5);
    }

    // Gatehouse.
    blockColumn(0, 4, 1, 3, mat.stone, 3, 3);
    blockLayer(0, 4, 4, mat.stoneLight, 4, 4);
    addCone(0, 5.7, 4, 2, 1.8, mat.roofRed);
    voxel(0, 6.7, 4, mat.roofRed, 2.4, 0.35, 2.4);

    // Gate arch, made from stepped blocks.
    for (let x = -1; x <= 1; x++) {
      voxel(x, 3.4, 4, mat.stoneDark, 1, 1, 1);
    }
    voxel(0, 3.9, 4, mat.stoneDark, 1.2, 0.5, 1);

    // Gate and wooden bridge.
    voxel(0, 3.2, 5.4, mat.wood, 1.5, 2.2, 1);
    for (let x = -2; x <= 2; x++) {
      voxel(x, 3.8, 5.8, mat.woodLight, 1, 0.45, 1);
    }

    // Curtain walls.
    for (let x = -5; x <= 5; x++) {
      voxel(x, 3.2, -4, mat.stone, 1, 1, 1);
    }

    for (let z = -2; z <= 2; z++) {
      voxel(-5, 3.2, z, mat.stone, 1, 1, 1);
      voxel(5, 3.2, z, mat.stone, 1, 1, 1);
    }

    // Battlements.
    for (let x = -5; x <= 5; x += 1) {
      voxel(x, 4.2, -4, mat.stoneLight, 0.85, 0.85, 0.85);
    }
    for (let z = -2; z <= 2; z += 1) {
      voxel(-5, 4.2, z, mat.stoneLight, 0.85, 0.85, 0.85);
      voxel(5, 4.2, z, mat.stoneLight, 0.85, 0.85, 0.85);
    }

    // ---------------------------------------------------------------------
    // Roof details, windows, and flags
    // ---------------------------------------------------------------------
    function windowBlock(x, y, z, material = mat.wood) {
      voxel(x, y, z, material, 0.55, 0.85, 0.18);
      voxel(x, y, z + 0.12, mat.stoneLight, 0.48, 0.68, 0.08);
    }

    windowBlock(-1, 7, 0.58);
    windowBlock(1, 7, 0.58);
    windowBlock(-1, 9, 0.58);
    windowBlock(1, 9, 0.58);
    windowBlock(-2, 5.4, 0.58);
    windowBlock(2, 5.4, 0.58);
    windowBlock(0, 3.5, 4.58);

    // Roof dormers.
    for (const [x, z] of [[-1.2, 0], [1.2, 0]]) {
      voxel(x, 9.1, z, mat.stoneLight, 0.8, 1.1, 0.8);
      voxel(x, 10.0, z, mat.roofRed, 1.05, 0.7, 1.05);
    }

    // Flagpole.
    voxel(-2.7, 14.2, -2, mat.wood, 0.16, 3.2, 0.16);
    const flag = new THREE.Mesh(
      new THREE.PlaneGeometry(1.1, 0.65),
      new THREE.MeshStandardMaterial({
        color: 0xc94832,
        roughness: 0.9,
        side: THREE.DoubleSide
      })
    );
    flag.position.set(-2.05, 15.65, -2);
    flag.rotation.y = -0.25;
    flag.castShadow = true;
    scene.add(flag);

    // ---------------------------------------------------------------------
    // Courtyard buildings
    // ---------------------------------------------------------------------
    // Left house.
    blockColumn(-3.6, 0.5, 1, 4, mat.stone, 2.2, 2.2);
    blockLayer(-3.6, 0.5, 5, mat.stoneLight, 2.8, 2.8);
    addCone(-3.6, 6.7, 0.5, 1.8, 1.6, mat.roofRed);
    voxel(-3.6, 7.6, 0.5, mat.roofRed, 2.2, 0.35, 2.2);
    windowBlock(-3.6, 3.3, 1.65);

    // Right house.
    blockColumn(3.5, 0.5, 1, 3, mat.stone, 2, 2);
    blockLayer(3.5, 0.5, 4, mat.stoneLight, 2.6, 2.6);
    addCone(3.5, 5.8, 0.5, 1.7, 1.5, mat.roofRed);
    voxel(3.5, 6.7, 0.5, mat.roofRed, 2.1, 0.35, 2.1);
    windowBlock(3.5, 2.8, 1.65);

    // Small chapel or gate building.
    blockColumn(0, -4.5, 1, 3, mat.stone, 2.2, 2.2);
    blockLayer(0, -4.5, 4, mat.stoneLight, 2.8, 2.8);
    addCone(0, 5.8, -4.5, 1.8, 1.6, mat.roofRed);
    voxel(0, 6.7, -4.5, mat.roofRed, 2.2, 0.35, 2.2);

    // ---------------------------------------------------------------------
    // Trees
    // ---------------------------------------------------------------------
    function tree(x, z, scale = 1, light = false) {
      const trunkHeight = 1.8 * scale;
      voxel(x, trunkHeight * 0.5, z, mat.trunk, 0.35 * scale, trunkHeight, 0.35 * scale);

      const crown = new THREE.Group();
      crown.position.set(x, trunkHeight, z);
      crown.scale.setScalar(scale);

      const lower = new THREE.Mesh(cubeGeometry, mat.leaves);
      lower.position.y = 0.55;
      lower.scale.set(1.25, 1.15, 1.25);
      lower.castShadow = true;
      lower.receiveShadow = true;
      crown.add(lower);

      const upper = new THREE.Mesh(cubeGeometry, mat.leavesLight);
      upper.position.y = 1.55;
      upper.scale.set(0.9, 0.9, 0.9);
      upper.castShadow = true;
      upper.receiveShadow = true;
      crown.add(upper);

      const side = new THREE.Mesh(cubeGeometry, mat.leaves);
      side.position.set(0.75, 0.8, 0);
      side.scale.set(0.55, 0.55, 0.55);
      side.castShadow = true;
      crown.add(side);

      scene.add(crown);
    }

    tree(-5.7, 2.8, 1.05);
    tree(-5.4, 3.6, 0.75);
    tree(5.7, 2.5, 0.95);
    tree(5.3, 3.5, 0.7);
    tree(-2.6, -4.7, 0.8);
    tree(2.7, -4.7, 0.8);

    // ---------------------------------------------------------------------
    // Hay bales and small props
    // ---------------------------------------------------------------------
    for (const [x, z] of [
      [-3.5, 7.2], [-2.8, 7.3], [-2.1, 7.4],
      [3.5, 7.2], [2.8, 7.3], [2.1, 7.4],
      [-4.8, 2.8], [-4.2, 2.9],
      [4.8, 2.8], [4.2, 2.9]
    ]) {
      voxel(x, 0.55, z, mat.hay, 0.75, 0.75, 0.75);
      voxel(x, 0.55, z + 0.38, mat.hay, 0.78, 0.78, 0.18);
    }

    // Lanterns along the path.
    for (const [x, z] of [
      [-2.5, 6.6], [-1.5, 6.6], [1.5, 6.6], [2.5, 6.6],
      [-4.6, 6.4], [4.6, 6.4]
    ]) {
      voxel(x, 1.1, z, mat.wood, 0.22, 1.8, 0.22);
      voxel(x, 2.05, z, mat.gold, 0.32, 0.45, 0.32);
      voxel(x, 2.32, z, mat.gold, 0.4, 0.18, 0.4);
    }

    // Small barrels.
    for (const [x, z] of [[-1.5, 4.8], [1.5, 4.8]]) {
      addCylinder(x, 0.65, z, 0.38, 0.9, mat.woodLight, 12);
      addCylinder(x, 1.05, z, 0.4, 0.1, mat.wood, 12);
    }

    // ---------------------------------------------------------------------
    // Distant voxel islands
    // ---------------------------------------------------------------------
    function distantIsland(x, z, radius) {
      for (let dx = -radius; dx <= radius; dx++) {
        for (let dz = -radius; dz <= radius; dz++) {
          const d = Math.sqrt(dx * dx + dz * dz);
          if (d <= radius) {
            voxel(x + dx, 0, z + dz, mat.grassDark, 1, 1, 1);
          }
        }
      }

      for (let dx = -radius + 1; dx <= radius - 1; dx++) {
        for (let dz = -radius + 1; dz <= radius - 1; dz++) {
          const d = Math.sqrt(dx * dx + dz * dz);
          if (d < radius - 0.45) {
            voxel(x + dx, 0.45, z + dz, mat.grass, 1, 0.7, 1);
          }
        }
      }

      tree(x, z, 0.8);
    }

    distantIsland(7.8, 1.5, 2.4);
    distantIsland(-8.1, -1.2, 2.0);
    distantIsland(10.2, -3.2, 1.7);
    distantIsland(-10.2, 3.3, 1.5);

    // ---------------------------------------------------------------------
    // Lighting
    // ---------------------------------------------------------------------
    const hemisphere = new THREE.HemisphereLight(0xd9e8ff, 0x5a4430, 2.0);
    scene.add(hemisphere);

    const sun = new THREE.DirectionalLight(0xffe5b5, 3.1);
    sun.position.set(-8, 14, 9);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -16;
    sun.shadow.camera.right = 16;
    sun.shadow.camera.top = 16;
    sun.shadow.camera.bottom = -16;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 40;
    sun.shadow.bias = -0.00025;
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0x8eb9ff, 0.8);
    fill.position.set(9, 7, -10);
    scene.add(fill);

    // ---------------------------------------------------------------------
    // Camera controls implemented directly
    // ---------------------------------------------------------------------
    const controls = {
      theta: Math.PI * 0.28,
      phi: Math.PI * 0.34,
      radius: 18,
      target: new THREE.Vector3(0, 4.2, 0),
      dragging: false,
      lastX: 0,
      lastY: 0
    };

    function updateCamera() {
      const sinPhi = Math.sin(controls.phi);
      camera.position.set(
        controls.target.x + controls.radius * sinPhi * Math.sin(controls.theta),
        controls.target.y + controls.radius * Math.cos(controls.phi),
        controls.target.z + controls.radius * sinPhi * Math.cos(controls.theta)
      );
      camera.lookAt(controls.target);
    }

    canvas.addEventListener("pointerdown", (event) => {
      controls.dragging = true;
      controls.lastX = event.clientX;
      controls.lastY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = "grabbing";
    });

    canvas.addEventListener("pointermove", (event) => {
      if (!controls.dragging) return;

      const dx = event.clientX - controls.lastX;
      const dy = event.clientY - controls.lastY;

      controls.lastX = event.clientX;
      controls.lastY = event.clientY;

      controls.theta -= dx * 0.006;
      controls.phi = THREE.MathUtils.clamp(
        controls.phi - dy * 0.005,
        0.18,
        Math.PI * 0.48
      );

      updateCamera();
    });

    function endDrag(event) {
      controls.dragging = false;
      canvas.style.cursor = "grab";
      if (event.pointerId !== undefined && canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
    }

    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);
    canvas.addEventListener("pointerleave", (event) => {
      if (controls.dragging) endDrag(event);
    });

    canvas.addEventListener("wheel", (event) => {
      event.preventDefault();
      controls.radius = THREE.MathUtils.clamp(
        controls.radius + event.deltaY * 0.012,
        9,
        29
      );
      updateCamera();
    }, { passive: false });

    canvas.style.cursor = "grab";
    updateCamera();

    // ---------------------------------------------------------------------
    // Resize and animation
    // ---------------------------------------------------------------------
    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener("resize", onResize);

    function animate() {
      requestAnimationFrame(animate);

      const t = clock.getElapsedTime();

      // Gentle water shimmer.
      mat.water.emissiveIntensity = 0.22 + Math.sin(t * 1.4) * 0.04;

      // Slow flag flutter.
      flag.rotation.z = Math.sin(t * 1.8) * 0.08;
      flag.rotation.y = -0.25 + Math.sin(t * 1.8) * 0.08;

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
    relic: { id: "generic", name: "Super Mario 64 Relic", x: -10.0, z: -12.0 },
    env:   { background: 0x9a816c, fogColor: 0x9a816c, fogDensity: 0.025 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 }
    }
  };
}

// @world {"id": "1017", "title": "Super Mario", "sub": "Peach's Castle", "system": "3D Render"}
// Converted from 1017-super_mario_peachx27s_castle.html into a Back Roms World Walker module.

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

    

    // scene redirect
    scene.background = new THREE.Color(0xb9d9ed);
    scene.fog = new THREE.Fog(0xb9d9ed, 35, 82);

    camera = dummyCamera();
    renderer = dummyRenderer();
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    

    const hemi = new THREE.HemisphereLight(0xeaf7ff, 0x6b8648, 2.25);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xfff4d6, 3.1);
    sun.position.set(18, 28, 12);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -28;
    sun.shadow.camera.right = 28;
    sun.shadow.camera.top = 28;
    sun.shadow.camera.bottom = -28;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 75;
    sun.shadow.bias = -0.00035;
    sun.shadow.normalBias = .025;
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0x9ccfff, .75);
    fill.position.set(-15, 10, -18);
    scene.add(fill);

    const materials = {
      grass: new THREE.MeshStandardMaterial({ color: 0x68b94f, roughness: .92 }),
      grassLight: new THREE.MeshStandardMaterial({ color: 0x83c95c, roughness: .95 }),
      grassDark: new THREE.MeshStandardMaterial({ color: 0x398b3e, roughness: .95 }),
      rock: new THREE.MeshStandardMaterial({ color: 0x777b73, roughness: 1 }),
      rockLight: new THREE.MeshStandardMaterial({ color: 0x999b8c, roughness: .96 }),
      stone: new THREE.MeshStandardMaterial({ color: 0xd7d9cf, roughness: .88 }),
      stoneDark: new THREE.MeshStandardMaterial({ color: 0x87928a, roughness: .95 }),
      trim: new THREE.MeshStandardMaterial({ color: 0xf1eee0, roughness: .78 }),
      roof: new THREE.MeshStandardMaterial({ color: 0xb85f91, roughness: .82 }),
      roofDark: new THREE.MeshStandardMaterial({ color: 0x8f4473, roughness: .86 }),
      wood: new THREE.MeshStandardMaterial({ color: 0x8d5b37, roughness: .95 }),
      path: new THREE.MeshStandardMaterial({ color: 0xd9c99b, roughness: 1 }),
      gold: new THREE.MeshStandardMaterial({ color: 0xf4c85b, metalness: .18, roughness: .5 }),
      glass: new THREE.MeshStandardMaterial({
        color: 0x69a8ff,
        emissive: 0x173f78,
        emissiveIntensity: .35,
        roughness: .25,
        metalness: .15
      })
    };

    const voxel = (x, y, z, sx = 1, sy = 1, sz = 1, mat = materials.grass, parent = scene) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), mat);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    };

    // Instanced terrain to keep the scene efficient.
    const terrainData = [];
    const terrainMin = new THREE.Vector3(-24, -2, -20);
    const terrainMax = new THREE.Vector3(24, 12, 20);

    function terrainHeight(x, z) {
      const hill = Math.max(0, 11 - Math.hypot(x - 1, z + 1));
      const side = Math.max(0, 5 - Math.abs(x + 17));
      const side2 = Math.max(0, 5 - Math.abs(x - 18));
      return Math.max(0, hill * .38 + side * .18 + side2 * .18);
    }

    // Generate a voxel hill with a gently uneven top.
    for (let z = -20; z <= 20; z += 1) {
      for (let x = -24; x <= 24; x += 1) {
        const h = terrainHeight(x, z);
        const edge = Math.max(0, 4 - Math.abs(x + 17));
        const edge2 = Math.max(0, 4 - Math.abs(x - 18));
        const y = h + edge * .18 + edge2 * .18;
        const mat = y > 8 ? materials.grassDark : materials.grass;
        terrainData.push({ x, y, z, mat });
      }
    }

    const terrainGeo = new THREE.BoxGeometry(1, 1, 1);
    const terrain = new THREE.InstancedMesh(terrainGeo, materials.grass, terrainData.length);
    const dummy = new THREE.Object3D();
    terrainData.forEach((p, i) => {
      dummy.position.set(p.x, p.y, p.z);
      dummy.updateMatrix();
      terrain.setMatrixAt(i, dummy.matrix);
      terrain.setColorAt(i, new THREE.Color(p.mat === materials.grassDark ? 0x4f9842 : 0x68b94f));
    });
    terrain.receiveShadow = true;
    terrain.castShadow = true;
    scene.add(terrain);

    // Main castle footprint.
    const castle = new THREE.Group();
    castle.position.set(0, 0, 0);
    scene.add(castle);

    // Lower stone walls.
    for (let x = -6; x <= 6; x++) {
      voxel(x, 0.65, -6, 1, 1, 1, materials.stoneDark, castle);
      voxel(x, 0.65, 6, 1, 1, 1, materials.stoneDark, castle);
      voxel(-6, 0.65, x, 1, 1, 1, materials.stoneDark, castle);
      voxel(6, 0.65, x, 1, 1, 1, materials.stoneDark, castle);
    }
    for (let x = -5; x <= 5; x++) {
      voxel(x, 1.35, -6, 1, .95, 1, materials.stone, castle);
      voxel(x, 1.35, 6, 1, .95, 1, materials.stone, castle);
    }
    for (let z = -5; z <= 5; z++) {
      voxel(-6, 1.35, z, 1, .95, 1, materials.stone, castle);
      voxel(6, 1.35, z, 1, .95, 1, materials.stone, castle);
    }

    // Main body.
    for (let x = -4; x <= 4; x++) {
      for (let z = -4; z <= 4; z++) {
        if (Math.abs(x) + Math.abs(z) <= 5 || (Math.abs(x) === 4 && Math.abs(z) <= 2)) {
          voxel(x, 2.2, z, 1, 1.2, 1, materials.stone, castle);
        }
      }
    }

    // Upper walls.
    for (let x = -3; x <= 3; x++) {
      for (let z = -3; z <= 3; z++) {
        if (Math.abs(x) + Math.abs(z) <= 4) {
          voxel(x, 3.35, z, 1, 1.1, 1, materials.stone, castle);
        }
      }
    }

    // Corner towers.
    const towers = [
      [-5, -5, 5], [-5, 5, 5], [5, -5, 5], [5, 5, 5],
      [-5, -5, -5], [-5, 5, -5], [5, -5, -5], [5, 5, -5]
    ];
    towers.forEach(([x, z, h]) => {
      for (let y = 1.5; y < h; y++) {
        voxel(x, y, z, 1, 1, 1, materials.stone, castle);
      }
      for (let dx = -1; dx <= 1; dx++) {
        for (let dz = -1; dz <= 1; dz++) {
          if (Math.abs(dx) + Math.abs(dz) <= 1) {
            voxel(x + dx, h, z + dz, 1, 1, 1, materials.stone, castle);
          }
        }
      }
      voxel(x, h + .55, z, .75, 1.1, .75, materials.roofDark, castle);
      voxel(x, h + 1.2, z, .7, .7, .7, materials.roof, castle);
    });

    // Side towers.
    for (const [x, z] of [[-3, 4], [3, 4], [-3, -4], [3, -4]]) {
      for (let y = 2.7; y < 4.8; y++) {
        voxel(x, y, z, 1, .8, 1, materials.stone, castle);
      }
      voxel(x, 4.8, z, .85, 1, .85, materials.roofDark, castle);
      voxel(x, 5.45, z, .75, .7, .75, materials.roof, castle);
    }

    // Central tall tower.
    for (let y = 3.4; y < 7.4; y++) {
      voxel(0, y, 0, 1, .85, 1, materials.stone, castle);
    }
    voxel(0, 7.4, 0, 1.1, .8, 1.1, materials.roofDark, castle);
    voxel(0, 8.05, 0, .95, .9, .95, materials.roof, castle);
    voxel(0, 8.65, 0, .55, .7, .55, materials.trim, castle);
    voxel(0, 9.15, 0, .38, .5, .38, materials.gold, castle);

    // Windows.
    function windowAt(x, y, z, width = 1, height = 1.2) {
      voxel(x, y, z, width, height, .18, materials.glass, castle);
      voxel(x, y, z + .13, width * .65, height * .7, .08, materials.trim, castle);
    }
    for (let x = -3; x <= 3; x++) {
      windowAt(x, 3.65, 4.08, .65, 1.1);
      windowAt(x, 4.55, 4.08, .65, 1.1);
    }
    for (let z = -3; z <= 3; z++) {
      windowAt(-4.08, 3.65, z, .18, 1.1);
      windowAt(4.08, 3.65, z, .18, 1.1);
    }
    windowAt(0, 5.65, 0, .75, 1.3);
    windowAt(0, 6.7, 0, .75, 1.3);

    // Arched entrance.
    for (let x = -2; x <= 2; x++) {
      for (let y = 1.9; y <= 3.2; y++) {
        if (Math.abs(x) + (y - 1.9) * 1.5 < 2) {
          voxel(x, y, 5.1, 1, 1, 1, materials.trim, castle);
        }
      }
    }
    voxel(-1, 3.8, 5.2, .75, .8, .75, materials.roof, castle);
    voxel(1, 3.8, 5.2, .75, .8, .75, materials.roof, castle);
    voxel(0, 4.25, 5.3, 1.6, .55, .8, materials.trim, castle);

    // Main stained glass.
    voxel(0, 4.1, 4.08, 1.25, 1.65, .18, materials.glass, castle);
    voxel(0, 4.1, 4.22, .55, 1.25, .08, materials.gold, castle);
    voxel(-.25, 4.1, 4.24, .18, .85, .08, materials.gold, castle);
    voxel(.25, 4.1, 4.24, .18, .85, .08, materials.gold, castle);
    voxel(0, 4.65, 4.24, .18, .35, .08, materials.gold, castle);

    // Roof ribs / trim.
    for (let x = -4; x <= 4; x++) {
      voxel(x, 4.05, 4.1, .18, .18, .25, materials.roof, castle);
    }
    for (let z = -4; z <= 4; z++) {
      voxel(-4.1, 4.05, z, .25, .18, .18, materials.roof, castle);
      voxel(4.1, 4.05, z, .25, .18, .18, materials.roof, castle);
    }

    // Courtyard walls and gate.
    for (let x = -8; x <= 8; x++) {
      voxel(x, .55, 8.3, 1, 1, 1, materials.stoneDark, castle);
    }
    for (let z = -8; z <= -8; z++) {
      voxel(-8.3, .55, z, 1, 1, 1, materials.stoneDark, castle);
      voxel(8.3, .55, z, 1, 1, 1, materials.stoneDark, castle);
    }
    voxel(-4.2, 1.05, 8.3, 1.4, 1.1, 1.4, materials.stone, castle);
    voxel(4.2, 1.05, 8.3, 1.4, 1.1, 1.4, materials.stone, castle);
    voxel(-3.2, 1.55, 8.3, 1.05, .9, 1.05, materials.trim, castle);
    voxel(3.2, 1.55, 8.3, 1.05, .9, 1.05, materials.trim, castle);

    // Gatehouse.
    for (let x = -2; x <= 2; x++) {
      for (let z = -2; z <= 2; z++) {
        voxel(x, 2.1, z, 1, 1, 1, materials.stone, castle);
      }
    }
    for (let x = -2; x <= 2; x++) {
      voxel(x, 3.0, 2.25, .7, 1.1, .7, materials.roofDark, castle);
      voxel(x, 3.65, 2.25, .6, .6, .6, materials.roof, castle);
    }
    windowAt(0, 2.65, 2.35, .65, 1.1);

    // Bridge.
    for (let i = 0; i < 9; i++) {
      voxel(0, 1.15, 8.8 + i * .65, 2.4, .45, .7, materials.trim, castle);
    }
    for (const x of [-1.05, 1.05]) {
      for (let i = 0; i < 9; i++) {
        voxel(x, 1.85, 8.8 + i * .65, .15, .65, .15, materials.wood, castle);
      }
    }

    // Fence around courtyard.
    function fenceLine(points) {
      for (let i = 0; i < points.length - 1; i++) {
        const a = points[i];
        const b = points[i + 1];
        const dx = b[0] - a[0];
        const dz = b[1] - a[1];
        const length = Math.hypot(dx, dz);
        const count = Math.max(1, Math.ceil(length / .85));
        for (let j = 0; j <= count; j++) {
          const t = j / count;
          voxel(a[0] + dx * t, 1.05, a[1] + dz * t, .12, .7, .12, materials.wood, castle);
        }
      }
    }
    fenceLine([
      [-8, 8.3], [8, 8.3], [8, -8], [-8, -8], [-8, 8.3]
    ]);

    // Path.
    const pathPoints = [
      [0, 8.4], [0, 6.8], [0, 5.0], [0, 3.8],
      [0, 2.3], [0, 1.2], [0, 0],
      [0, -1.2], [0, -2.3], [0, -3.8],
      [0, -5.0], [0, -6.8], [0, -8.4]
    ];
    for (let i = 0; i < pathPoints.length - 1; i++) {
      const a = pathPoints[i];
      const b = pathPoints[i + 1];
      const dx = b[0] - a[0];
      const dz = b[1] - a[1];
      const length = Math.hypot(dx, dz);
      const count = Math.ceil(length / .8);
      for (let j = 0; j <= count; j++) {
        const t = j / count;
        voxel(a[0] + dx * t, .12, a[1] + dz * t, 1.75, .24, 1.75, materials.path, castle);
      }
    }
    voxel(0, .15, -10, 4.2, .25, 1.2, materials.path, castle);

    // Trees.
    const treePositions = [
      [-11, -10], [-10, -8], [-11, -6], [-10, -4], [-11, -2], [-10, 0], [-11, 2], [-10, 4], [-11, 6], [-10, 8],
      [11, -10], [10, -8], [11, -6], [10, -4], [11, -2], [10, 0], [11, 2], [10, 4], [11, 6], [10, 8],
      [-7, -11], [-6, -9], [-7, -7], [-6, -5], [-7, -3], [-6, -1], [-7, 1], [-6, 3], [-7, 5], [-6, 7], [-7, 9],
      [7, -11], [6, -9], [7, -7], [6, -5], [7, -3], [6, -1], [7, 1], [6, 3], [7, 5], [6, 7], [7, 9],
      [-4, -12], [-3, -10], [-4, -8], [-3, -6], [-4, -4], [-3, -2], [-4, 0], [-3, 2], [-4, 4], [-3, 6], [-4, 8],
      [4, -12], [3, -10], [4, -8], [3, -6], [4, -4], [3, -2], [4, 0], [3, 2], [4, 4], [3, 6], [4, 8],
      [-13, -4], [-12, -2], [-13, 0], [-12, 2], [-13, 4], [-12, 6], [-13, 8], [-12, 10],
      [13, -4], [12, -2], [13, 0], [12, 2], [13, 4], [12, 6], [13, 8], [12, 10],
      [-14, 12], [-13, 10], [-14, 8], [-13, 6], [-14, 4], [-13, 2], [-14, 0], [-13, -2], [-14, -4],
      [14, 12], [13, 10], [14, 8], [13, 6], [14, 4], [13, 2], [14, 0], [13, -2], [14, -4],
      [-5, 12], [-4, 10], [-5, 8], [-4, 6], [-5, 4], [-4, 2], [-5, 0], [-4, -2], [-5, -4],
      [5, 12], [4, 10], [5, 8], [4, 6], [5, 4], [4, 2], [5, 0], [4, -2], [5, -4]
    ];
    treePositions.forEach(([x, z], i) => {
      const y = terrainHeight(x, z);
      voxel(x, y + .35, z, 1.25, .7, 1.25, materials.wood, castle);
      voxel(x, y + 1.05, z, .9, 1.35, .9, materials.grassDark, castle);
      voxel(x, y + 1.85, z, .7, 1.15, .7, materials.grassLight, castle);
      voxel(x, y + 2.45, z, .55, .85, .55, materials.wood, castle);
    });

    // Small bushes.
    const bushPositions = [
      [-8, -7], [-7, -5], [-8, -3], [-7, -1], [-8, 1], [-7, 3], [-8, 5], [-7, 7],
      [8, -7], [7, -5], [8, -3], [7, -1], [8, 1], [7, 3], [8, 5], [7, 7],
      [-5, -9], [-4, -7], [-5, -5], [-4, -3], [-5, -1], [-4, 1], [-5, 3], [-4, 5], [-5, 7],
      [5, -9], [4, -7], [5, -5], [4, -3], [5, -1], [4, 1], [5, 3], [4, 5], [5, 7]
    ];
    bushPositions.forEach(([x, z], i) => {
      const y = terrainHeight(x, z);
      for (let j = 0; j < 3; j++) {
        voxel(x + (j % 2 - .5) * .45, y + .35 + j * .3, z + (j - 1) * .35, .48, .48, .48, j === 1 ? materials.grassLight : materials.grass, castle);
      }
    });

    // Clouds made from voxel cubes.
    const cloudMaterial = new THREE.MeshStandardMaterial({ color: 0xf6f4e9, roughness: 1 });
    const cloudGroups = [];
    function cloud(x, y, z, scale) {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      group.scale.setScalar(scale);
      const pieces = [
        [-1.4, 0, 0, 1.2, .5, .8],
        [-.45, .25, 0, 1.4, .65, .9],
        [.65, 0, 0, 1.25, .55, .85],
        [1.45, -.1, 0, .85, .4, .65],
        [0, -.35, .25, 1.8, .45, .9]
      ];
      pieces.forEach(p => {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(...p), cloudMaterial);
        mesh.position.set(...p.slice(0, 3));
        mesh.castShadow = false;
        group.add(mesh);
      });
      scene.add(group);
      cloudGroups.push(group);
    }
    cloud(-13, 15, -18, 1.4);
    cloud(9, 17, -22, 1.7);
    cloud(22, 12, -10, 1.1);
    cloud(-24, 13, 10, 1.25);
    cloud(18, 14, 15, 1.45);

    // Voxel birds.
    const birdMaterial = new THREE.MeshStandardMaterial({ color: 0xf5f3e8, roughness: .95 });
    function bird(x, y, z, scale = 1) {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      group.scale.setScalar(scale);
      const body = new THREE.Mesh(new THREE.BoxGeometry(.65, .22, .3), birdMaterial);
      body.rotation.y = Math.PI / 2;
      group.add(body);
      const left = new THREE.Mesh(new THREE.BoxGeometry(.15, .55, .12), birdMaterial);
      left.position.set(-.35, 0, 0);
      left.rotation.z = -.25;
      group.add(left);
      const right = left.clone();
      right.position.x = .35;
      right.rotation.z = .25;
      group.add(right);
      scene.add(group);
      return group;
    }
    const birds = [bird(-3, 11, -10, .65), bird(5, 12, -14, .55), bird(11, 10, -8, .45)];
    birds.forEach((b, i) => {
      const original = b.rotation.z;
      b.userData.baseRotation = original;
    });

    // Custom orbit controls, implemented without addons.
    let azimuth = Math.PI * .23;
    let elevation = Math.PI * .34;
    let radius = 31;
    const target = new THREE.Vector3(0, 3.4, 0);
    const spherical = new THREE.Spherical();
    const initial = { azimuth, elevation, radius };

    function updateCamera() {
      spherical.set(radius, azimuth, elevation);
      camera.position.setFromSpherical(spherical).add(target);
      camera.lookAt(target);
    }
    updateCamera();

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
      azimuth -= dx * .006;
      elevation = THREE.MathUtils.clamp(elevation + dy * .005, .12, 1.25);
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
      radius = THREE.MathUtils.clamp(radius + event.deltaY * .025, 16, 48);
      updateCamera();
    }, { passive: false });

    // Gentle animated clouds and birds.
    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      cloudGroups.forEach((cloud, i) => {
        cloud.position.x += Math.sin(t * .12 + i) * .0008;
      });
      birds.forEach((bird, i) => {
        bird.position.x += .00065 + i * .0002;
        bird.position.y += Math.sin(t * 1.2 + i) * .00035;
        bird.rotation.z = bird.userData.baseRotation + Math.sin(t * 1.1 + i) * .08;
      });
      renderer.render(scene, camera);
    }
    animate();

    addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    });
  

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
    relic: { id: "generic", name: "Super Mario Relic", x: -10.0, z: -12.0 },
    env:   { background: 0xb9d9ed, fogColor: 0xb9d9ed, fogDensity: 0.025 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 },
      east: { x: 12.0, z: 10.0 },
      west: { x: -12.0, z: -10.0 }
    }
  };
}

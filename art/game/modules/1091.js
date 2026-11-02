// @world {"id": "1091", "title": "Pikmin 3", "sub": "Garden of Hope", "system": "3D Render"}
// Converted from 1091-pikmin_3_garden_of_hope.html into a Back Roms World Walker module.

import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js";

export function createWorld(THREE) {
  const group = new THREE.Group();

  let scene = {
    add: (...objs) => objs.forEach(o => o && group.add(o)),
    remove: (...objs) => objs.forEach(o => o && group.remove(o)),
    traverse: (cb) => group.traverse(cb),
    getObjectByName: (n) => group.getObjectByName(n),
    updateMatrixWorld: () => {},
    background: null,
    fog: null
  };
  Object.defineProperty(scene, "children", { get: () => group.children });

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
  let window = typeof globalThis.window !== "undefined" ? globalThis.window : {
    innerWidth: 1920, innerHeight: 1080, devicePixelRatio: 1, addEventListener: () => {}
  };
  let document = typeof globalThis.document !== "undefined" ? globalThis.document : {
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
  // (strict modules throw where sloppy scripts did not): handles, rose, s, spout, zoom
  let handles = 0;
  let rose = 0;
  let s = 0;
  let spout = 0;
  let zoom = 0;

    

    // -------------------------------------------------------------------------
    // Renderer and scene
    // -------------------------------------------------------------------------

    // scene redirect
    scene.background = new THREE.Color(0x171b22);
    scene.fog = new THREE.Fog(0x171b22, 18, 38);

    camera = dummyCamera();

    renderer = dummyRenderer();

    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    

    const hemi = new THREE.HemisphereLight(0xbdd8ff, 0x304027, 2.25);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xfff1cf, 4.2);
    key.position.set(8, 12, 7);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -12;
    key.shadow.camera.right = 12;
    key.shadow.camera.top = 12;
    key.shadow.camera.bottom = -12;
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 35;
    key.shadow.bias = -0.00035;
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x79baff, 2.1);
    rim.position.set(-8, 6, -9);
    scene.add(rim);

    const fill = new THREE.PointLight(0xffc878, 24, 18, 2);
    fill.position.set(-4, 4, 4);
    scene.add(fill);

    // -------------------------------------------------------------------------
    // Materials
    // -------------------------------------------------------------------------

    const material = (color, roughness = 0.85, metalness = 0) =>
      new THREE.MeshStandardMaterial({ color, roughness, metalness });

    const mats = {
      soil: material(0x403526),
      soilDark: material(0x2d2920),
      soilLight: material(0x594936),
      wood: material(0x9a6a3c),
      woodLight: material(0xc28b50),
      woodDark: material(0x68452d),
      leaf: material(0x3d7a32),
      leafLight: material(0x64a841),
      leafDark: material(0x285d2b),
      grass: material(0x78a93f),
      grassLight: material(0x91bd50),
      grassDark: material(0x527d32),
      blue: material(0x247ca3),
      blueDark: material(0x174b69),
      blueLight: material(0x4bb4d4),
      yellow: material(0xf4c72d),
      cream: material(0xf4e7b7),
      red: material(0xe2424d),
      pink: material(0xe9809e),
      orange: material(0xf39a35),
      purple: material(0x8a65b5),
      white: material(0xf5f4df),
      black: material(0x171b1e),
      metal: material(0x4b5960, 0.42, 0.48)
    };

    const voxelGeometry = new THREE.BoxGeometry(1, 1, 1);

    function voxel(x, y, z, sx = 1, sy = 1, sz = 1, mat, cast = true) {
      const mesh = new THREE.Mesh(voxelGeometry, mat);
      mesh.position.set(x, y, z);
      mesh.scale.set(sx, sy, sz);
      mesh.castShadow = cast;
      mesh.receiveShadow = true;
      scene.add(mesh);
      return mesh;
    }

    function cubes(x, y, z, count, mat, size = 1, axis = "x") {
      for (let i = 0; i < count; i++) {
        voxel(
          x + (axis === "x" ? (i - (count - 1) / 2) * size : 0),
          y,
          z + (axis === "z" ? (i - (count - 1) / 2) * size : 0),
          size,
          size,
          size,
          mat
        );
      }
    }

    // -------------------------------------------------------------------------
    // Floating island / wooden base
    // -------------------------------------------------------------------------

    const island = new THREE.Group();
    scene.add(island);

    const islandRadius = 4.65;
    const islandSegments = 28;
    const blockSize = 0.32;
    const blockCount = 12;

    for (let i = 0; i < blockCount; i++) {
      const angle = (i / blockCount) * Math.PI * 2;
      const x = Math.cos(angle) * (islandRadius - 0.18);
      const z = Math.sin(angle) * (islandRadius - 0.18);
      const height = 0.46 + ((i * 7) % 3) * 0.08;

      voxel(x, height * 0.5, z, 0.36, height, 0.36, i % 2 ? mats.wood : mats.woodLight);
      voxel(
        x + Math.cos(angle) * 0.19,
        height * 0.5 + 0.025,
        z + Math.sin(angle) * 0.19,
        0.055,
        0.055,
        0.055,
        mats.woodDark
      );
    }

    // Rounded soil surface made from a dense voxel disk.
    const surface = new THREE.Group();
    scene.add(surface);

    for (let y = 0; y < 3; y++) {
      for (let ix = -9; ix <= 9; ix++) {
        for (let iz = -9; iz <= 9; iz++) {
          const radius = Math.sqrt(ix * ix + iz * iz);
          if (radius > 9.2) continue;

          const noise = Math.sin(ix * 1.73 + iz * 0.81) * 0.5 +
                         Math.sin(iz * 2.17 - ix * 0.43) * 0.3;

          if (y === 0) {
            voxel(ix * 0.31, 0.28, iz * 0.31, 0.32, 0.32, 0.32, mats.soilDark);
          } else if (y === 1) {
            voxel(ix * 0.31, 0.59, iz * 0.31, 0.32, 0.32, 0.32, mats.soil);
          } else {
            const edge = radius > 7.8;
            voxel(ix * 0.31, 0.9, iz * 0.31, 0.32, 0.32, 0.32, edge ? mats.soilLight : mats.soil);
          }
        }
      }
    }

    // A continuous vine around the island.
    for (let i = 0; i < 48; i++) {
      const angle = (i / 48) * Math.PI * 2;
      const x = Math.cos(angle) * 4.18;
      const z = Math.sin(angle) * 4.18;
      voxel(x, 0.38, z, 0.18, 0.24, 0.18, mats.leafDark);
    }

    // Leaves along the vine.
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2 + 0.2;
      const x = Math.cos(angle) * 4.18;
      const z = Math.sin(angle) * 4.18;
      voxel(x + 0.25, 0.4, z, 0.22, 0.18, 0.65, i % 2 ? mats.leaf : mats.leafLight);
    }

    // -------------------------------------------------------------------------
    // Watering can: voxel body, handles, spout, rose, lid
    // -------------------------------------------------------------------------

    const can = new THREE.Group();
    can.position.set(0, 1.15, 0);
    scene.add(can);

    // Main can body: stacked rounded-ish layers.
    for (let y = 0; y < 5; y++) {
      const radius = 1.38 - y * 0.105;
      for (let ix = -3; ix <= 3; ix++) {
        for (let iy = 0; iy < 3; iy++) {
          for (let iz = -3; iz <= 3; iz++) {
            const px = ix * 0.245;
            const pz = iz * 0.245;
            const py = iy * 0.245;

            const corner = Math.abs(px) > 1.02 || Math.abs(pz) > 1.02;
            const edge = Math.abs(px) + Math.abs(pz) > 1.45;

            if (corner && py > 0.1) continue;
            if (edge && py < 0.55) continue;

            voxel(px, py, pz, 0.25, 0.25, 0.25, y % 2 ? mats.blue : mats.blueDark);
          }
        }
      }
    }

    // Lower base and upper shoulder.
    for (let ix = -3; ix <= 3; ix++) {
      for (let iz = -3; iz <= 3; iz++) {
        voxel(ix * 0.25, -0.32, iz * 0.25, 0.27, 0.25, 0.27, mats.blueDark);
      }
    }

    for (let ix = -3; ix <= 3; ix++) {
      for (let iz = -3; iz <= 3; iz++) {
        voxel(ix * 0.245, 0.64, iz * 0.245, 0.25, 0.25, 0.25, mats.blue);
      }
    }

    // Vertical rib details.
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      voxel(
        Math.cos(angle) * 1.24,
        0.18,
        Math.sin(angle) * 1.24,
        0.075,
        0.8,
        0.075,
        mats.blueLight
      );
    }

    // Lid and knob.
    voxel(0, 1.03, 0, 0.82, 0.22, 0.82, mats.blueDark);
    voxel(0, 1.2, 0, 0.25, 0.25, 0.25, mats.yellow);

    // Curved side handle, built as a voxel arc.
    for (let i = 0; i < 11; i++) {
      const t = i / 10;
      const angle = THREE.MathUtils.lerp(-1.25, 1.25, t);
      const radius = 1.82;
      voxel(
        Math.cos(angle) * radius,
        0.82 + Math.sin(angle) * radius * 0.55,
        Math.sin(angle) * radius,
        0.28,
        0.28,
        0.28,
        mats.blueLight
      );
    }

    // Spout: segmented curved tube.
    const spoutPoints = [
      new THREE.Vector3(1.25, 0.75, 0),
      new THREE.Vector3(1.62, 0.79, 0.02),
      new THREE.Vector3(1.92, 0.72, 0.04),
      new THREE.Vector3(2.12, 0.55, 0.06),
      new THREE.Vector3(2.18, 0.35, 0.08)
    ];

    for (let i = 0; i < spoutPoints.length; i++) {
      voxel(
        spoutPoints[i].x,
        spoutPoints[i].y,
        spoutPoints[i].z,
        0.34,
        0.34,
        0.34,
        i === 0 ? mats.blueDark : mats.blue
      );
    }

    // Rose / nozzle.
    voxel(2.23, 0.31, 0.08, 0.3, 0.3, 0.3, mats.yellow);
    voxel(2.4, 0.31, 0.08, 0.12, 0.12, 0.12, mats.yellow);
    voxel(2.48, 0.31, 0.08, 0.08, 0.08, 0.08, mats.blueLight);

    // Small label on the front.
    for (let ix = -1; ix <= 1; ix++) {
      for (let iy = 0; iy < 3; iy++) {
        voxel(ix * 0.16, 0.38 + iy * 0.16, 0.92, 0.17, 0.17, 0.1, mats.cream);
      }
    }

    // -------------------------------------------------------------------------
    // Daisies
    // -------------------------------------------------------------------------

    function makeDaisy(x, y, z, scale = 1, rotation = 0) {
      const flower = new THREE.Group();
      flower.position.set(x, y, z);
      flower.rotation.y = rotation;
      scene.add(flower);

      // Stem.
      for (let i = 0; i < 6; i++) {
        voxel(
          Math.sin((i / 6) * Math.PI * 2) * 0.035,
          0.08 + i * 0.09,
          Math.cos((i / 6) * Math.PI * 2) * 0.035,
          0.035,
          0.085,
          0.035,
          mats.leafDark
        );
      }

      const petalCount = 12;
      for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * Math.PI * 2;
        const px = Math.cos(angle) * 0.19;
        const pz = Math.sin(angle) * 0.19;

        voxel(
          px,
          0.28,
          pz,
          0.11,
          0.11,
          0.11,
          mats.white
        );
      }

      voxel(0, 0.31, 0, 0.18, 0.16, 0.18, mats.yellow);
      flower.scale.setScalar(scale);
    }

    makeDaisy(-1.35, 1.4, 0.55, 1.15, 0.3);
    makeDaisy(1.25, 1.55, -0.65, 0.9, -0.4);
    makeDaisy(0.7, 1.7, 1.0, 0.72, 0.8);

    // -------------------------------------------------------------------------
    // Red mushrooms
    // -------------------------------------------------------------------------

    function makeMushroom(x, z, scale = 1) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      group.scale.setScalar(scale);
      scene.add(group);

      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        voxel(
          Math.cos(angle) * 0.1,
          0.08 + i * 0.11,
          Math.sin(angle) * 0.1,
          0.1,
          0.1,
          0.1,
          mats.leafDark
        );
      }

      voxel(0, 0.25, 0, 0.23, 0.2, 0.23, mats.red);
      voxel(0, 0.38, 0, 0.17, 0.14, 0.17, mats.pink);
      voxel(0, 0.49, 0, 0.1, 0.1, 0.1, mats.white);
    }

    makeMushroom(-2.15, 0.75, 0.9);
    makeMushroom(-1.95, 1.0, 0.65);
    makeMushroom(2.1, 0.8, 0.72);

    // -------------------------------------------------------------------------
    // Small woodland creatures
    // -------------------------------------------------------------------------

    // Tiny red elf beside the can.
    const redElf = new THREE.Group();
    redElf.position.set(-1.65, 0.95, 0.35);
    redElf.rotation.y = -0.7;
    scene.add(redElf);

    voxel(0, 0.16, 0, 0.28, 0.28, 0.28, mats.red);
    voxel(0, 0.39, 0, 0.2, 0.18, 0.2, mats.pink);
    voxel(-0.08, 0.55, 0, 0.09, 0.12, 0.09, mats.yellow);
    voxel(0.08, 0.55, 0, 0.09, 0.12, 0.09, mats.yellow);
    voxel(0, 0.68, 0, 0.16, 0.16, 0.16, mats.red);
    voxel(0.13, 0.12, 0.1, 0.07, 0.25, 0.07, mats.blue);
    voxel(-0.13, 0.12, 0.1, 0.07, 0.25, 0.07, mats.blue);

    // Yellow bird / insect.
    const yellowBird = new THREE.Group();
    yellowBird.position.set(2.25, 1.05, 0.25);
    yellowBird.rotation.y = 0.8;
    scene.add(yellowBird);

    voxel(0, 0, 0, 0.28, 0.28, 0.28, mats.yellow);
    voxel(0, 0.16, 0, 0.32, 0.2, 0.32, mats.yellow);
    voxel(-0.15, 0.04, 0, 0.12, 0.12, 0.12, mats.orange);
    voxel(0.15, 0.04, 0, 0.12, 0.12, 0.12, mats.orange);
    voxel(0.13, 0.2, 0, 0.08, 0.12, 0.08, mats.black);

    // Small blue character in front of the can.
    const blueCharacter = new THREE.Group();
    blueCharacter.position.set(0.85, 0.92, 1.45);
    blueCharacter.rotation.y = -0.5;
    scene.add(blueCharacter);

    voxel(0, 0.18, 0, 0.4, 0.3, 0.4, mats.blue);
    voxel(0, 0.43, 0, 0.48, 0.22, 0.48, mats.white);
    voxel(0, 0.59, 0, 0.34, 0.2, 0.34, mats.blue);
    voxel(0, 0.7, 0, 0.1, 0.1, 0.1, mats.yellow);
    voxel(0.14, 0.3, 0.13, 0.07, 0.28, 0.07, mats.blue);
    voxel(-0.14, 0.3, 0.13, 0.07, 0.28, 0.07, mats.blue);
    voxel(0, 0.6, 0, 0.09, 0.1, 0.09, mats.blue);

    // -------------------------------------------------------------------------
    // Grass tufts and small flowers
    // -------------------------------------------------------------------------

    function grassTuft(x, z, scale = 1) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      group.scale.setScalar(scale);
      scene.add(group);

      for (let i = 0; i < 7; i++) {
        const angle = (i / 7) * Math.PI * 2;
        const h = 0.18 + (i % 3) * 0.07;
        voxel(
          Math.cos(angle) * 0.08,
          h,
          Math.sin(angle) * 0.08,
          0.065,
          h,
          0.065,
          i % 2 ? mats.grass : mats.grassLight
        );
      }
    }

    for (let i = 0; i < 55; i++) {
      const angle = (i / 55) * Math.PI * 2;
      const radius = 2.2 + Math.random() * 1.8;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      grassTuft(x, z, 0.65 + Math.random() * 0.8);
    }

    function smallFlower(x, z, colorMat, scale = 1) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      group.scale.setScalar(scale);
      scene.add(group);

      voxel(0, 0.16, 0, 0.055, 0.3, 0.055, mats.leafDark);
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        voxel(
          Math.cos(angle) * 0.1,
          0.3,
          Math.sin(angle) * 0.1,
          0.07,
          0.08,
          0.07,
          colorMat
        );
      }
      voxel(0, 0.34, 0, 0.08, 0.08, 0.08, mats.yellow);
    }

    smallFlower(-0.35, 1.4, mats.pink, 0.8);
    smallFlower(1.7, -1.35, mats.purple, 0.7);
    smallFlower(-2.2, -1.3, mats.orange, 0.55);
    smallFlower(2.1, 1.3, mats.pink, 0.55);

    // -------------------------------------------------------------------------
    // Rocks and fallen leaves
    // -------------------------------------------------------------------------

    const rockMaterial = material(0x777467);

    for (const [x, z, s] of [
      [-1.65, 1.25, 0.42],
      [1.45, -0.75, 0.36],
      [0.25, -1.75, 0.28],
      [-2.45, -0.2, 0.22]
    ]) {
      voxel(x, 0.28, z, s, 0.55, s, rockMaterial);
      voxel(x + 0.08, 0.5, z - 0.05, s * 0.65, 0.25, s * 0.65, mats.soilLight);
    }

    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2 + 0.4;
      const x = Math.cos(angle) * (1.25 + (i % 3) * 0.18);
      const z = Math.sin(angle) * (1.25 + (i % 3) * 0.18);
      const colors = [mats.orange, mats.yellow, mats.purple, mats.red];
      voxel(x, 0.34, z, 0.13, 0.035, 0.25, colors[i % colors.length]);
    }

    // -------------------------------------------------------------------------
    // Background garden silhouettes
    // -------------------------------------------------------------------------

    const background = new THREE.Group();
    scene.add(background);

    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2;
      const radius = 8 + (i % 5) * 0.7;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const h = 1.2 + (i % 4) * 0.35;

      voxel(x, h * 0.5, z, 0.45, h, 0.45, mats.leafDark, false);
    }

    // -------------------------------------------------------------------------
    // Direct camera controls: orbit, zoom, and gentle reset
    // -------------------------------------------------------------------------

    const controls = {
      theta: 0.72,
      phi: 1.12,
      radius: 11.2,
      target: new THREE.Vector3(0, 1.05, 0),
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

    renderer.domElement.addEventListener("pointerdown", (event) => {
      controls.dragging = true;
      controls.lastX = event.clientX;
      controls.lastY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
      renderer.domElement.style.cursor = "grabbing";
    });

    renderer.domElement.addEventListener("pointermove", (event) => {
      if (!controls.dragging) return;

      const dx = event.clientX - controls.lastX;
      const dy = event.clientY - controls.lastY;
      controls.lastX = event.clientX;
      controls.lastY = event.clientY;

      controls.theta -= dx * 0.006;
      controls.phi = THREE.MathUtils.clamp(controls.phi - dy * 0.005, 0.48, 1.48);
      updateCamera();
    });

    function endDrag(event) {
      controls.dragging = false;
      renderer.domElement.style.cursor = "grab";
      if (event.pointerId !== undefined && renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
    }

    renderer.domElement.addEventListener("pointerup", endDrag);
    renderer.domElement.addEventListener("pointercancel", endDrag);
    renderer.domElement.style.cursor = "grab";

    renderer.domElement.addEventListener("wheel", (event) => {
      event.preventDefault();
      controls.radius = THREE.MathUtils.clamp(
        controls.radius + event.deltaY * 0.008,
        7.2,
        17
      );
      updateCamera();
    }, { passive: false });

    // Double-click resets the camera.
    renderer.domElement.addEventListener("dblclick", () => {
      controls.theta = 0.72;
      controls.phi = 1.12;
      controls.radius = 11.2;
      updateCamera();
    });

    updateCamera();

    // -------------------------------------------------------------------------
    // Animation
    // -------------------------------------------------------------------------

    const clock = new THREE.Clock();

    function animate() {
      const elapsed = clock.getElapsedTime();

      // Very subtle breathing / idle motion.
      redElf.position.y = 0.95 + Math.sin(elapsed * 2.1) * 0.012;
      yellowBird.position.y = 1.05 + Math.sin(elapsed * 2.8 + 0.8) * 0.018;
      blueCharacter.position.y = 0.92 + Math.sin(elapsed * 2.4 + 1.2) * 0.009;

      // Gentle flower sway.
      const daisies = scene.children.filter((object) => object.userData.daisy);
      for (const daisy of daisies) {
        daisy.rotation.z = Math.sin(elapsed * 1.4 + daisy.position.x) * 0.025;
        daisy.rotation.x = Math.cos(elapsed * 1.1 + daisy.position.z) * 0.018;
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(innerWidth, innerHeight);
    });

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
    relic: { id: "generic", name: "Pikmin 3 Relic", x: -10.0, z: -12.0 },
    env:   { background: 0x171b22, fogColor: 0x171b22, fogDensity: 0.025 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 },
      east: { x: 12.0, z: 10.0 },
      west: { x: -12.0, z: -10.0 }
    }
  };
}

// @world {"id": "1040", "title": "Super Mario 64", "sub": "Peach's Castle Exterior", "system": "3D Render"}
// Converted from 1040-super_mario_64_peachx27s_castle_exterior.html into a Back Roms World Walker module.

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

    

    // ------------------------------------------------------------
    // Renderer and scene
    // ------------------------------------------------------------
    // scene redirect
    scene.background = new THREE.Color(0x8bd8ff);
    scene.fog = new THREE.Fog(0x8bd8ff, 35, 78);

    camera = dummyCamera();

    renderer = dummyRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.SRGBColorSpace;
    renderer.toneMappingExposure = 1.12;
    

    // ------------------------------------------------------------
    // Materials
    // ------------------------------------------------------------
    const materials = {
      grass: new THREE.MeshStandardMaterial({
        color: 0x65d95a,
        roughness: 0.95,
        flatShading: true
      }),
      grassDark: new THREE.MeshStandardMaterial({
        color: 0x3f9f43,
        roughness: 1,
        flatShading: true
      }),
      stone: new THREE.MeshStandardMaterial({
        color: 0xd9e4df,
        roughness: 0.9,
        flatShading: true
      }),
      stoneDark: new THREE.MeshStandardMaterial({
        color: 0x879892,
        roughness: 1,
        flatShading: true
      }),
      roof: new THREE.MeshStandardMaterial({
        color: 0xb95039,
        roughness: 0.85,
        flatShading: true
      }),
      roofLight: new THREE.MeshStandardMaterial({
        color: 0xd16b4d,
        roughness: 0.9,
        flatShading: true
      }),
      gold: new THREE.MeshStandardMaterial({
        color: 0xf3bd55,
        roughness: 0.68,
        metalness: 0.08,
        flatShading: true
      }),
      wood: new THREE.MeshStandardMaterial({
        color: 0x8b552f,
        roughness: 0.95,
        flatShading: true
      }),
      woodLight: new THREE.MeshStandardMaterial({
        color: 0xb57a45,
        roughness: 0.9,
        flatShading: true
      }),
      water: new THREE.MeshStandardMaterial({
        color: 0x35b9e8,
        roughness: 0.25,
        metalness: 0.12,
        flatShading: true
      }),
      sky: new THREE.MeshStandardMaterial({
        color: 0x8bd8ff,
        roughness: 1,
        flatShading: true
      }),
      red: new THREE.MeshStandardMaterial({
        color: 0xe64337,
        roughness: 0.8,
        side: THREE.DoubleSide,
        flatShading: true
      }),
      black: new THREE.MeshStandardMaterial({
        color: 0x25170f,
        roughness: 0.85
      })
    };

    // ------------------------------------------------------------
    // Lighting
    // ------------------------------------------------------------
    scene.add(new THREE.HemisphereLight(0xdff7ff, 0x526f32, 2.25));

    const sun = new THREE.DirectionalLight(0xfff2cf, 3.1);
    sun.position.set(18, 30, 14);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -26;
    sun.shadow.camera.right = 26;
    sun.shadow.camera.top = 26;
    sun.shadow.camera.bottom = -26;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 70;
    sun.shadow.bias = -0.0004;
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0x87c9ff, 0.75);
    fill.position.set(-15, 12, -18);
    scene.add(fill);

    // ------------------------------------------------------------
    // Voxel helpers
    // ------------------------------------------------------------
    const world = new THREE.Group();
    scene.add(world);

    function box(w, h, d, material, x, y, z, parent = world) {
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

    function voxelColumn(x, z, levels, material, parent = world) {
      const width = 1.65;
      for (let i = 0; i < levels; i++) {
        box(
          width,
          0.72,
          width,
          material,
          x,
          0.36 + i * 0.72,
          z,
          parent
        );
      }
    }

    function roundedWindow(x, y, z, radius = 0.45, material = materials.stoneDark) {
      const group = new THREE.Group();
      group.position.set(x, y, z);

      // Outer frame: square backing and corner blocks.
      box(
        radius * 2.7,
        radius * 2.7,
        0.24,
        materials.stoneDark,
        0,
        0,
        0,
        group
      );

      const corner = 0.25;
      box(corner, radius * 2.1, 0.34, material, -radius + corner / 2, 0, 0.15, group);
      box(corner, radius * 2.1, 0.34, material, radius - corner / 2, 0, 0.15, group);
      box(radius * 2.1, corner, 0.34, material, 0, -radius + corner / 2, 0.15, group);
      box(radius * 2.1, corner, 0.34, material, 0, radius - corner / 2, 0.15, group);

      const glow = new THREE.Mesh(
        new THREE.CircleGeometry(radius * 0.72, 16),
        new THREE.MeshBasicMaterial({ color: 0xffe5a5 })
      );
      glow.position.z = 0.37;
      group.add(glow);

      // Cross mullions.
      box(radius * 1.25, 0.08, 0.11, materials.gold, 0, 0, 0.42, group);
      box(0.08, radius * 1.25, 0.11, materials.gold, 0, 0, 0.42, group);

      world.add(group);
      return group;
    }

    function flag(x, y, z, direction = 1) {
      const group = new THREE.Group();
      group.position.set(x, y, z);

      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.075, 2.3, 7),
        materials.gold
      );
      pole.position.y = 1.15;
      pole.castShadow = true;
      group.add(pole);

      const flag = new THREE.Mesh(
        new THREE.PlaneGeometry(0.72, 0.42, 4, 2),
        materials.red
      );
      flag.position.set(0.36, 2.15, 0);
      flag.rotation.y = direction * Math.PI / 2;
      flag.castShadow = true;
      group.add(flag);

      for (let i = 0; i < 4; i++) {
        const fold = new THREE.Mesh(
          new THREE.PlaneGeometry(0.08, 0.42, 1, 2),
          materials.red
        );
        fold.position.set(0.12 + i * 0.16, 2.15, 0);
        fold.rotation.y = direction * (Math.PI / 2 - 0.12);
        group.add(fold);
      }

      world.add(group);
    }

    function fence(x1, z1, x2, z2, height = 0.65) {
      const dx = x2 - x1;
      const dz = z2 - z1;
      const length = Math.hypot(dx, dz);
      const count = Math.max(2, Math.ceil(length / 1.25));

      for (let i = 0; i <= count; i++) {
        const t = i / count;
        const x = THREE.MathUtils.lerp(x1, x2, t);
        const z = THREE.MathUtils.lerp(z1, z2, t);

        box(0.13, height, 0.13, materials.wood, x, height / 2, z);
        box(0.78, 0.11, 0.11, materials.woodLight, x, height, z);
      }

      const midX = THREE.MathUtils.lerp(x1, x2, 0.5);
      const midZ = THREE.MathUtils.lerp(z1, z2, 0.5);
      box(0.11, 0.11, length, materials.wood, midX, height * 0.55, (z1 + z2) / 2);
    }

    // ------------------------------------------------------------
    // Landscape
    // ------------------------------------------------------------
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(90, 90),
      materials.grass
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.18;
    ground.receiveShadow = true;
    world.add(ground);

    // A raised castle island.
    box(27, 0.7, 21, materials.grassDark, 0, 0.05, 0);
    box(25.5, 0.28, 19.5, materials.grass, 0, 0.48, 0);

    // Curved island edges made from blocks.
    for (let i = 0; i < 18; i++) {
      const angle = Math.PI * 1.15 + i * 0.13;
      const radius = 13.8;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      if (i % 2 === 0) {
        box(1.15, 0.8, 1.15, materials.grassDark, x, 0.2, z);
      }
    }

    // Waterfalls and pools.
    const waterfall = new THREE.Mesh(
      new THREE.BoxGeometry(7.2, 12, 3.1),
      materials.water
    );
    waterfall.position.set(-10.5, 6.2, 7.5);
    waterfall.rotation.z = -0.04;
    waterfall.receiveShadow = true;
    world.add(waterfall);

    for (let i = 0; i < 12; i++) {
      box(
        0.48,
        0.72,
        6.2,
        materials.water,
        -10.5 + Math.sin(i * 0.7) * 0.35,
        1.1 + i * 0.78,
        7.5
      );
    }

    const leftPool = new THREE.Mesh(
      new THREE.BoxGeometry(11, 0.25, 7),
      materials.water
    );
    leftPool.position.set(-10.4, 0.62, 7.2);
    leftPool.receiveShadow = true;
    world.add(leftPool);

    const rightPool = new THREE.Mesh(
      new THREE.BoxGeometry(8.5, 0.25, 7.2),
      materials.water
    );
    rightPool.position.set(11.8, 0.62, 6.8);
    rightPool.receiveShadow = true;
    world.add(rightPool);

    // Distant low-poly hills.
    const hillMaterial = new THREE.MeshStandardMaterial({
      color: 0x8bc66a,
      roughness: 1,
      flatShading: true
    });

    function hill(x, z, sx, sy, sz, color = 0x8bc66a) {
      const material = color === 0x8bc66a ? hillMaterial : materials.grassDark;
      const hillMesh = new THREE.Mesh(
        new THREE.ConeGeometry(1, 1, 5),
        material
      );
      hillMesh.position.set(x, sy * 0.5 - 0.2, z);
      hillMesh.scale.set(sx, sy, sz);
      hillMesh.rotation.y = x * 0.17;
      hillMesh.castShadow = true;
      hillMesh.receiveShadow = true;
      world.add(hillMesh);
    }

    hill(-23, -15, 12, 6, 9, 0x9ed274);
    hill(25, -18, 14, 7, 10, 0x8fbd64);
    hill(-30, 17, 11, 5, 8, 0xa4cf78);
    hill(31, 19, 13, 6, 9, 0x91bd69);

    // ------------------------------------------------------------
    // Castle structure
    // ------------------------------------------------------------
    const castle = new THREE.Group();
    world.add(castle);

    // Main body.
    box(17.5, 6.2, 14.5, materials.stone, 0, 3.45, 0, castle);

    // Corner towers.
    const towerPositions = [
      [-8.25, -5.75],
      [8.25, -5.75],
      [-8.25, 5.75],
      [8.25, 5.75]
    ];

    for (const [x, z] of towerPositions) {
      box(4.1, 7.1, 4.1, materials.stone, x, 3.85, z, castle);
      box(4.65, 0.45, 4.65, materials.stoneDark, x, 7.55, z, castle);

      // Window bands.
      for (const y of [2.0, 4.25, 6.5]) {
        box(1.35, 0.22, 0.22, materials.stoneDark, x + 1.4, y, z + 2.08, castle);
        box(0.22, 0.22, 1.35, materials.stoneDark, x + 2.08, y, z, castle);
      }

      // Arched doorway.
      const arch = new THREE.Mesh(
        new THREE.TorusGeometry(1.05, 0.28, 6, 18, Math.PI),
        materials.stoneDark
      );
      arch.rotation.z = Math.PI;
      arch.position.set(x, 1.25, z + 2.1);
      arch.castShadow = true;
      castle.add(arch);

      box(1.35, 1.55, 0.22, materials.black, x, 0.78, z + 2.18, castle);
    }

    // Main roof.
    const mainRoof = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0,
        8.7,
        5.4,
        4,
        1,
        true
      ),
      materials.roof
    );
    mainRoof.rotation.y = Math.PI / 4;
    mainRoof.position.set(0, 9.1, 0);
    mainRoof.castShadow = true;
    mainRoof.receiveShadow = true;
    castle.add(mainRoof);

    // Central tall tower.
    box(4.8, 10.2, 4.8, materials.stone, 0, 5.35, 0, castle);
    box(5.4, 0.5, 5.4, materials.stoneDark, 0, 10.7, 0, castle);

    const centralRoof = new THREE.Mesh(
      new THREE.CylinderGeometry(0, 3.15, 4.2, 4),
      materials.roof
    );
    centralRoof.rotation.y = Math.PI / 4;
    centralRoof.position.set(0, 13.15, 0);
    centralRoof.castShadow = true;
    castle.add(centralRoof);

    // Side gabled roofs.
    for (const [x, z] of towerPositions) {
      const roof = new THREE.Mesh(
        new THREE.CylinderGeometry(0, 2.55, 3.35, 4),
        materials.roofLight
      );
      roof.rotation.y = Math.PI / 4;
      roof.position.set(x, 9.45, z);
      roof.castShadow = true;
      castle.add(roof);
    }

    // Central rose window.
    const roseWindow = new THREE.Group();
    roseWindow.position.set(0, 10.95, 0);

    const roseBacking = new THREE.Mesh(
      new THREE.CircleGeometry(2.25, 24),
      new THREE.MeshStandardMaterial({
        color: 0x6c332c,
        roughness: 0.85,
        side: THREE.DoubleSide
      })
    );
    roseWindow.add(roseBacking);

    const innerRose = new THREE.Mesh(
      new THREE.CircleGeometry(1.48, 24),
      new THREE.MeshBasicMaterial({ color: 0xffd98c })
    );
    innerRose.position.z = 0.08;
    roseWindow.add(innerRose);

    const petals = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const petal = new THREE.Mesh(
        new THREE.CircleGeometry(0.26, 8),
        new THREE.MeshBasicMaterial({ color: 0xffb65c })
      );
      petal.position.set(
        Math.cos(angle) * 1.55,
        Math.sin(angle) * 1.55,
        0.12
      );
      petal.rotation.z = angle - Math.PI / 2;
      roseWindow.add(petal);
      petals.push(petal);
    }

    for (let i = 0; i < petals.length; i++) {
      const next = (i + 1) % petals.length;
      const a = petals[i].position;
      const b = petals[next].position;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const length = Math.hypot(dx, dy);
      const petalBridge = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, length, 6),
        materials.gold
      );
      petalBridge.position.set((a.x + b.x) / 2, (a.y + b.y) / 2, 0.16);
      petalBridge.rotation.z = Math.atan2(dy, dx);
      roseWindow.add(petalBridge);
    }

    const roseFrame = new THREE.Mesh(
      new THREE.RingGeometry(2.2, 2.65, 24),
      materials.gold
    );
    roseFrame.position.z = 0.16;
    roseWindow.add(roseFrame);

    castle.add(roseWindow);

    // Front windows.
    for (const [x, y] of [
      [-5.85, 2.45],
      [-3.85, 2.45],
      [-5.85, 4.45],
      [-3.85, 4.45],
      [5.85, 2.45],
      [3.85, 2.45],
      [5.85, 4.45],
      [3.85, 4.45]
    ]) {
      roundedWindow(x, y, 7.32, 0.48);
    }

    // Side windows.
    for (const [x, z, y] of [
      [-11.8, -3.0, 2.4],
      [-11.8, 3.0, 2.4],
      [11.8, -3.0, 2.4],
      [11.8, 3.0, 2.4],
      [-11.8, -3.0, 4.4],
      [-11.8, 3.0, 4.4],
      [11.8, -3.0, 4.4],
      [11.8, 3.0, 4.4]
    ]) {
      roundedWindow(x, y, z, 0.42, materials.stoneDark);
    }

    // Entrance and steps.
    const entrance = new THREE.Group();
    entrance.position.set(0, 0, 7.35);

    box(2.5, 2.6, 0.3, materials.stoneDark, 0, 1.3, 0, entrance);
    box(1.7, 1.5, 0.28, materials.black, 0, 0.75, 0.15, entrance);

    for (let i = 0; i < 4; i++) {
      box(
        3.2 - i * 0.35,
        0.22,
        0.8,
        materials.stoneLight || materials.stone,
        0,
        0.18 + i * 0.25,
        7.95 + i * 0.72,
        castle
      );
    }

    // Battlements.
    for (let x = -7.5; x <= 7.5; x += 1.5) {
      box(0.85, 0.85, 0.85, materials.stone, x, 7.1, 7.25, castle);
    }

    for (const z of [-2.2, 2.2]) {
      for (let y = 0; y < 3; y++) {
        box(0.8, 0.75, 0.8, materials.stone, -10.4, 0.38 + y * 0.75, z, castle);
        box(0.8, 0.75, 0.8, materials.stone, 10.4, 0.38 + y * 0.75, z, castle);
      }
    }

    // Flags.
    flag(-8.25, 8.0, -2.25, -1);
    flag(8.25, 8.0, -2.25, 1);
    flag(-8.25, 8.0, 2.25, -1);
    flag(8.25, 8.0, 2.25, 1);
    flag(0, 15.0, 0, 0);

    // Small flag on central tower.
    const topFlag = new THREE.Group();
    topFlag.position.set(0, 16.1, 0);
    const topPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.07, 2.1, 7),
      materials.gold
    );
    topPole.position.y = 1.05;
    topPole.castShadow = true;
    topFlag.add(topPole);

    const topFlagPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(0.7, 0.4, 4, 2),
      materials.red
    );
    topFlagPlane.position.set(0.35, 1.95, 0);
    topFlagPlane.rotation.y = Math.PI / 2;
    topFlagPlane.castShadow = true;
    topFlag.add(topFlagPlane);

    world.add(topFlag);

    // ------------------------------------------------------------
    // Decorative details
    // ------------------------------------------------------------
    // Courtyard lanterns.
    const lantern = new THREE.Group();
    lantern.position.set(-4.2, 0, 8.5);

    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.11, 2.1, 7),
      materials.gold
    );
    pole.position.y = 1.05;
    pole.castShadow = true;
    lantern.add(pole);

    const lamp = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 10, 8),
      new THREE.MeshBasicMaterial({ color: 0xffd882 })
    );
    lamp.position.y = 2.15;
    lantern.add(lamp);

    const lanternTop = new THREE.Mesh(
      new THREE.ConeGeometry(0.42, 0.35, 8),
      materials.gold
    );
    lanternTop.position.y = 2.55;
    lanternTop.castShadow = true;
    lantern.add(lanternTop);

    world.add(lantern);

    const rightLantern = lantern.clone();
    rightLantern.position.set(4.2, 0, 8.5);
    world.add(rightLantern);

    // Small courtyard trees.
    function tree(x, z, scale = 1) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      group.scale.setScalar(scale);

      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.27, 1.8, 7),
        materials.wood
      );
      trunk.position.y = 0.9;
      trunk.castShadow = true;
      group.add(trunk);

      const foliage = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.25, 0),
        materials.grassDark
      );
      foliage.position.y = 2.15;
      foliage.scale.set(1, 1.2, 0.95);
      foliage.castShadow = true;
      group.add(foliage);

      const foliage2 = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.85, 0),
        materials.grass
      );
      foliage2.position.set(0.4, 2.75, 0.1);
      foliage2.castShadow = true;
      group.add(foliage2);

      world.add(group);
    }

    tree(-5.8, 11.2, 0.9);
    tree(5.8, 11.2, 0.9);
    tree(-12.2, -1.5, 0.75);
    tree(12.2, -1.5, 0.75);

    // Small stones around the island.
    const stoneMaterial = new THREE.MeshStandardMaterial({
      color: 0x9ba9a4,
      roughness: 1,
      flatShading: true
    });

    for (let i = 0; i < 28; i++) {
      const angle = Math.PI * 1.15 + i * 0.13;
      const radius = 13.1 + (i % 3) * 0.55;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const size = 0.28 + (i % 4) * 0.1;
      const stone = new THREE.Mesh(
        new THREE.DodecahedronGeometry(size, 0),
        stoneMaterial
      );
      stone.position.set(x, size * 0.35, z);
      stone.scale.y = 0.55;
      stone.rotation.set(i * 0.3, i * 0.7, i * 0.2);
      stone.castShadow = true;
      stone.receiveShadow = true;
      world.add(stone);
    }

    // ------------------------------------------------------------
    // Custom orbit controls
    // ------------------------------------------------------------
    const controls = {
      theta: 0.12,
      phi: 1.08,
      radius: 31,
      target: new THREE.Vector3(0, 5.4, 0),
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
    });

    renderer.domElement.addEventListener("pointermove", (event) => {
      if (!controls.dragging) return;

      const dx = event.clientX - controls.lastX;
      const dy = event.clientY - controls.lastY;

      controls.lastX = event.clientX;
      controls.lastY = event.clientY;

      controls.theta -= dx * 0.006;
      controls.phi = THREE.MathUtils.clamp(
        controls.phi - dy * 0.005,
        0.35,
        1.45
      );

      updateCamera();
    });

    function endDrag(event) {
      controls.dragging = false;
      if (event.pointerId !== undefined && renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
    }

    renderer.domElement.addEventListener("pointerup", endDrag);
    renderer.domElement.addEventListener("pointercancel", endDrag);

    renderer.domElement.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        controls.radius = THREE.MathUtils.clamp(
          controls.radius + event.deltaY * 0.018,
          18,
          52
        );
        updateCamera();
      },
      { passive: false }
    );

    // ------------------------------------------------------------
    // Resize and animation
    // ------------------------------------------------------------
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    updateCamera();

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // Gentle water shimmer.
      materials.water.opacity = 0.88 + Math.sin(elapsed * 1.4) * 0.06;

      // Very subtle flag movement.
      topFlag.rotation.z = Math.sin(elapsed * 1.7) * 0.05;

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
    env:   { background: 0x8bd8ff, fogColor: 0x8bd8ff, fogDensity: 0.025 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 },
      east: { x: 12.0, z: 10.0 },
      west: { x: -12.0, z: -10.0 }
    }
  };
}

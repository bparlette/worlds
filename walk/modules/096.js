// @world {"id": "096", "title": "Tomb Raider", "sub": "Croft Manor \u2014 Pool Room", "system": "Console"}
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

    

    // -------------------------------------------------------------------------
    // Renderer and scene
    // -------------------------------------------------------------------------

    // scene redirect
    scene.background = new THREE.Color(0x11110f);
    scene.fog = new THREE.FogExp2(0x11110f, 0.022);

    camera = dummyCamera();

    renderer = dummyRenderer();

    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    

    // -------------------------------------------------------------------------
    // Materials
    // -------------------------------------------------------------------------

    const materials = {
      floor: new THREE.MeshStandardMaterial({
        color: 0xd7c69b,
        roughness: 0.86,
        metalness: 0.02
      }),
      floorDark: new THREE.MeshStandardMaterial({
        color: 0x6c5940,
        roughness: 0.95
      }),
      mosaic: new THREE.MeshStandardMaterial({
        color: 0x71808a,
        roughness: 0.2,
        metalness: 0.28
      }),
      mosaicBlue: new THREE.MeshStandardMaterial({
        color: 0x456b73,
        roughness: 0.25,
        metalness: 0.2
      }),
      gold: new THREE.MeshStandardMaterial({
        color: 0xb98b3e,
        roughness: 0.45,
        metalness: 0.55
      }),
      dark: new THREE.MeshStandardMaterial({
        color: 0x171713,
        roughness: 0.92
      }),
      wood: new THREE.MeshStandardMaterial({
        color: 0x765035,
        roughness: 0.88
      }),
      red: new THREE.MeshStandardMaterial({
        color: 0x6f2f25,
        roughness: 0.9
      }),
      plaster: new THREE.MeshStandardMaterial({
        color: 0x8a7758,
        roughness: 0.94
      }),
      statue: new THREE.MeshStandardMaterial({
        color: 0x77715f,
        roughness: 0.78,
        metalness: 0.06
      }),
      statueDark: new THREE.MeshStandardMaterial({
        color: 0x4b463d,
        roughness: 0.86
      }),
      water: new THREE.MeshStandardMaterial({
        color: 0x244d55,
        roughness: 0.18,
        metalness: 0.58,
        transparent: true,
        opacity: 0.84
      }),
      waterGlint: new THREE.MeshStandardMaterial({
        color: 0x8fc5c9,
        emissive: 0x284b50,
        emissiveIntensity: 0.45,
        roughness: 0.25,
        metalness: 0.35
      })
    };

    // -------------------------------------------------------------------------
    // Voxel helpers
    // -------------------------------------------------------------------------

    const voxel = (x, y, z, size, material, castShadow = true, receiveShadow = true) => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        material
      );
      mesh.position.set(x, y, z);
      mesh.castShadow = castShadow;
      mesh.receiveShadow = receiveShadow;
      scene.add(mesh);
      return mesh;
    };

    const box = (x, y, z, sx, sy, sz, material, castShadow = true, receiveShadow = true) => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(sx, sy, sz),
        material
      );
      mesh.position.set(x, y, z);
      mesh.castShadow = castShadow;
      mesh.receiveShadow = receiveShadow;
      scene.add(mesh);
      return mesh;
    };

    // A small palette of block materials used to keep the scene readable.
    const palette = {
      cream: new THREE.MeshStandardMaterial({ color: 0xd7c59a, roughness: 0.9 }),
      pale: new THREE.MeshStandardMaterial({ color: 0xe1d2aa, roughness: 0.88 }),
      ochre: new THREE.MeshStandardMaterial({ color: 0xb98a43, roughness: 0.8 }),
      darkOchre: new THREE.MeshStandardMaterial({ color: 0x75552f, roughness: 0.9 }),
      red: new THREE.MeshStandardMaterial({ color: 0x73332c, roughness: 0.9 }),
      dark: new THREE.MeshStandardMaterial({ color: 0x171916, roughness: 0.95 }),
      black: new THREE.MeshStandardMaterial({ color: 0x090a09, roughness: 1 }),
      green: new THREE.MeshStandardMaterial({ color: 0x465044, roughness: 0.92 }),
      blue: new THREE.MeshStandardMaterial({ color: 0x46616a, roughness: 0.8 }),
      gold: new THREE.MeshStandardMaterial({ color: 0xc49a4a, roughness: 0.5, metalness: 0.45 }),
      wood: new THREE.MeshStandardMaterial({ color: 0x765136, roughness: 0.9 }),
      woodLight: new THREE.MeshStandardMaterial({ color: 0x9a7048, roughness: 0.88 }),
      statue: new THREE.MeshStandardMaterial({ color: 0x81765f, roughness: 0.82 }),
      statueLight: new THREE.MeshStandardMaterial({ color: 0x9a8b6e, roughness: 0.8 }),
      statueDark: new THREE.MeshStandardMaterial({ color: 0x4e4940, roughness: 0.9 }),
      water: new THREE.MeshStandardMaterial({
        color: 0x28535c,
        roughness: 0.2,
        metalness: 0.48,
        transparent: true,
        opacity: 0.88
      })
    };

    // -------------------------------------------------------------------------
    // Architecture
    // -------------------------------------------------------------------------

    const hallWidth = 17;
    const hallDepth = 25;
    const floorY = 0.18;

    // Main floor: a broad tiled slab with inset mosaic borders.
    box(
      0,
      floorY - 0.12,
      0,
      hallWidth + 0.4,
      0.24,
      hallDepth + 0.4,
      materials.floor,
      false,
      true
    );

    // Floor border strips, assembled from square tiles.
    const tile = 0.42;

    function tiledBorder(x, z, width, depth, material, offset = 0) {
      const nx = Math.max(1, Math.floor(width / tile));
      const nz = Math.max(1, Math.floor(depth / tile));
      for (let ix = 0; ix < nx; ix++) {
        for (let iz = 0; iz < nz; iz++) {
          const px = x + (ix - (nx - 1) / 2) * tile;
          const pz = z + (iz - (nz - 1) / 2) * tile;
          voxel(
            px,
            floorY + 0.025,
            pz,
            tile - 0.018,
            material,
            false,
            true
          );
        }
      }
    }

    tiledBorder(0, 0, hallWidth, hallDepth, materials.mosaic);
    tiledBorder(0, 0, hallWidth - 1.3, hallDepth - 1.3, materials.mosaicBlue);

    // Central sunken pool.
    const poolX = 0.4;
    const poolZ = 0.1;
    const poolWidth = 5.2;
    const poolDepth = 5.0;

    box(
      poolX,
      floorY - 0.16,
      poolZ,
      poolWidth + 0.35,
      0.32,
      poolDepth + 0.35,
      materials.mosaic,
      false,
      true
    );

    box(
      poolX,
      floorY - 0.34,
      poolZ,
      poolWidth,
      0.16,
      poolDepth,
      materials.dark,
      false,
      true
    );

    const water = new THREE.Mesh(
      new THREE.PlaneGeometry(poolWidth - 0.12, poolDepth - 0.12),
      materials.water
    );
    water.rotation.x = -Math.PI / 2;
    water.position.set(poolX, floorY - 0.255, poolZ);
    water.receiveShadow = true;
    scene.add(water);

    // Animated water glints: small floating voxel shards.
    const glintShards = [];
    const glintPositions = [
      [-1.4, 0.05, -1.4],
      [0.3, 0.05, -0.7],
      [1.4, 0.05, 0.8],
      [-0.5, 0.05, 1.8],
      [0.7, 0.05, 2.1],
      [-1.7, 0.05, 1.3]
    ];

    for (const p of glintPositions) {
      const shard = new THREE.Mesh(
        new THREE.ConeGeometry(0.13, 0.32, 3),
        materials.waterGlint
      );
      shard.rotation.z = Math.random() * Math.PI;
      shard.position.set(p[0], floorY - 0.205, p[1]);
      shard.userData.baseY = shard.position.y;
      shard.userData.phase = Math.random() * Math.PI * 2;
      scene.add(shard);
      glintShards.push(shard);
    }

    // -------------------------------------------------------------------------
    // Mosaic walls and processional niches
    // -------------------------------------------------------------------------

    function createWall(x, z, width, height, rotation = 0) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      group.rotation.y = rotation;

      // Main wall mass.
      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, 0.55),
        materials.plaster
      );
      wall.position.y = height / 2 + floorY;
      wall.castShadow = true;
      wall.receiveShadow = true;
      group.add(wall);

      // Dark lower wainscot.
      const wainscot = new THREE.Mesh(
        new THREE.BoxGeometry(width, 1.35, 0.62),
        materials.dark
      );
      wainscot.position.y = floorY + 0.67;
      wainscot.castShadow = true;
      wainscot.receiveShadow = true;
      group.add(wainscot);

      // Upper cornice.
      const cornice = new THREE.Mesh(
        new THREE.BoxGeometry(width + 0.18, 0.32, 0.72),
        materials.ochre
      );
      cornice.position.y = height - 0.18 + floorY;
      cornice.castShadow = true;
      cornice.receiveShadow = true;
      group.add(cornice);

      // Decorative frieze bands.
      for (const y of [floorY + 1.55, floorY + 1.98]) {
        const band = new THREE.Mesh(
          new THREE.BoxGeometry(width + 0.08, 0.18, 0.7),
          y === floorY + 1.55 ? materials.red : materials.darkOchre
        );
        band.position.y = y;
        band.castShadow = true;
        band.receiveShadow = true;
        group.add(band);
      }

      // Lower relief panels.
      const panelCount = Math.max(3, Math.floor(width / 1.55));
      for (let i = 0; i < panelCount; i++) {
        const px = -width / 2 + (i / (panelCount - 1)) * width;
        const panel = new THREE.Mesh(
          new THREE.BoxGeometry(1.12, 0.9, 0.16),
          materials.dark
        );
        panel.position.set(px, floorY + 0.68, 0.36);
        panel.receiveShadow = true;
        group.add(panel);

        // Small inset figure or medallion.
        const inset = new THREE.Mesh(
          new THREE.CylinderGeometry(0.28, 0.28, 0.1, 12),
          i % 3 === 0 ? materials.gold : materials.red
        );
        inset.rotation.x = Math.PI / 2;
        inset.position.set(px, floorY + 0.68, 0.45);
        group.add(inset);
      }

      scene.add(group);
      return group;
    }

    // Long wall on the left, facing into the hall.
    createWall(-6.25, 1.2, 11.2, 5.2, Math.PI / 2);

    // Back wall.
    createWall(0, -11.5, 13.2, 5.4, 0);

    // Right wall, with a doorway opening.
    createWall(6.25, 1.2, 11.2, 5.2, -Math.PI / 2);

    // -------------------------------------------------------------------------
    // Columns and sculpted figures
    // -------------------------------------------------------------------------

    function createColumn(x, z, rotation = 0, scale = 1) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      group.rotation.y = rotation;
      group.scale.setScalar(scale);

      // Square pedestal.
      const pedestal = new THREE.Mesh(
        new THREE.BoxGeometry(1.55, 0.38, 1.55),
        materials.dark
      );
      pedestal.position.y = 0.19;
      pedestal.castShadow = true;
      pedestal.receiveShadow = true;
      group.add(pedestal);

      // Main shaft in stacked blocks.
      const shaftParts = [
        { y: 0.58, h: 0.65, mat: materials.stone || materials.stoneLight },
        { y: 1.18, h: 0.65, mat: materials.stone || materials.stoneLight },
        { y: 1.78, h: 0.65, mat: materials.stone || materials.stoneLight },
        { y: 2.38, h: 0.65, mat: materials.stone || materials.stoneLight }
      ];

      for (const part of shaftParts) {
        const shaft = new THREE.Mesh(
          new THREE.BoxGeometry(0.82, part.h, 0.82),
          materials.stone || materials.stoneLight
        );
        shaft.position.y = part.y;
        shaft.castShadow = true;
        shaft.receiveShadow = true;
        group.add(shaft);
      }

      // Capital.
      const capital = new THREE.Mesh(
        new THREE.BoxGeometry(1.3, 0.42, 1.3),
        materials.ochre
      );
      capital.position.y = 3.02;
      capital.castShadow = true;
      capital.receiveShadow = true;
      group.add(capital);

      // Decorative frieze around the capital.
      const frieze = new THREE.Mesh(
        new THREE.BoxGeometry(1.48, 0.18, 1.48),
        materials.red
      );
      frieze.position.y = 2.78;
      frieze.castShadow = true;
      group.add(frieze);

      scene.add(group);
      return group;
    }

    // Front pair.
    createColumn(-3.35, 3.0, 0.08, 1.05);
    createColumn(3.35, 3.0, -0.08, 1.05);

    // Rear pair.
    createColumn(-3.35, -8.5, 0.08, 1.05);
    createColumn(3.35, -8.5, -0.08, 1.05);

    // Side columns.
    createColumn(-5.85, -2.3, Math.PI / 2, 0.95);
    createColumn(5.85, -2.3, -Math.PI / 2, 0.95);

    // -------------------------------------------------------------------------
    // Stylized voxel statues
    // -------------------------------------------------------------------------

    function createStatue(x, y, z, rotation = 0, scale = 1, pose = 0) {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      group.rotation.y = rotation;
      group.scale.setScalar(scale);

      // Feet.
      const leftFoot = new THREE.Mesh(
        new THREE.BoxGeometry(0.38, 0.22, 0.55),
        materials.stateDark || materials.stateDark
      );
      leftFoot.position.set(-0.16, 0.11, 0);
      leftFoot.castShadow = true;
      group.add(leftFoot);

      const rightFoot = leftFoot.clone();
      rightFoot.position.x = 0.16;
      group.add(rightFoot);

      // Legs.
      const leftLeg = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.62, 0.36),
        materials.stateDark || materials.stateDark
      );
      leftLeg.position.set(-0.13, 0.48, 0);
      leftLeg.castShadow = true;
      group.add(leftLeg);

      const rightLeg = leftLeg.clone();
      rightLeg.position.x = 0.13;
      group.add(rightLeg);

      // Torso.
      const torso = new THREE.Mesh(
        new THREE.BoxGeometry(0.62, 0.72, 0.42),
        materials.stateDark || materials.stateDark
      );
      torso.position.set(0, 1.05, 0);
      torso.rotation.z = pose;
      torso.castShadow = true;
      group.add(torso);

      // Head and headdress.
      const head = new THREE.Mesh(
        new THREE.CylinderGeometry(0.23, 0.25, 0.46, 8),
        materials.stateDark || materials.stateDark
      );
      head.position.set(0, 1.57, 0);
      head.castShadow = true;
      group.add(head);

      const headdress = new THREE.Mesh(
        new THREE.ConeGeometry(0.39, 0.52, 8),
        materials.gold
      );
      headdress.position.set(0, 1.93, 0);
      headdress.castShadow = true;
      group.add(headdress);

      // Arms.
      const leftArm = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 0.78, 0.28),
        materials.stateDark || materials.stateDark
      );
      leftArm.position.set(-0.48, 1.18, 0.04);
      leftArm.rotation.z = -0.18;
      leftArm.castShadow = true;
      group.add(leftArm);

      const rightArm = leftArm.clone();
      rightArm.position.x = 0.48;
      rightArm.rotation.z = 0.18;
      group.add(rightArm);

      // Small offerings or objects.
      if (pose > 0.3) {
        const offering = new THREE.Mesh(
          new THREE.CylinderGeometry(0.19, 0.23, 0.28, 10),
          materials.gold
        );
        offering.position.set(0.58, 0.91, 0.22);
        offering.rotation.z = -0.2;
        offering.castShadow = true;
        group.add(offering);
      }

      scene.add(group);
      return group;
    }

    // Wall statues on the left.
    createStatue(-5.55, 2.25, 1.48, 0, 0.88, 0.08);
    createStatue(-4.2, 2.25, 1.48, 0, 0.88, -0.08);
    createStatue(-2.85, 2.25, 1.48, 0, 0.88, 0.08);

    // Wall statues on the right.
    createStatue(5.55, 2.25, 1.48, Math.PI, 0.88, 0.08);
    createStatue(4.2, 2.25, 1.48, Math.PI, 0.88, -0.08);
    createStatue(2.85, 2.25, 1.48, Math.PI, 0.88, 0.08);

    // Central processional statues.
    createStatue(-1.2, floorY, 5.25, 0.35, 0.85, 0.15);
    createStatue(1.2, floorY, 5.25, -0.35, 0.85, -0.15);

    createStatue(-1.2, floorY, -7.2, 0.35, 0.85, 0.15);
    createStatue(1.2, floorY, -7.2, -0.35, 0.85, -0.15);

    // -------------------------------------------------------------------------
    // Ceiling, upper gallery, and skylight
    // -------------------------------------------------------------------------

    // Dark ceiling slab.
    box(
      0,
      5.85,
      0,
      13.5,
      0.4,
      23.5,
      materials.dark
    );

    // Upper gallery along the back and sides.
    box(
      0,
      5.35,
      -9.6,
      12.2,
      0.45,
      1.35,
      materials.wood
    );

    box(
      -5.9,
      5.35,
      -2.2,
      1.35,
      0.45,
      10.6,
      materials.wood
    );

    box(
      5.9,
      5.35,
      -2.2,
      1.35,
      0.45,
      10.6,
      materials.wood
    );

    // Gallery railings.
    for (const z of [-10.25, -3.25]) {
      box(
        0,
        5.82,
        z,
        11.6,
        0.12,
        0.12,
        materials.gold
      );

      for (let x = -5.4; x <= 5.4; x += 1.2) {
        box(
          x,
          5.55,
          z,
          0.09,
          0.55,
          0.09,
          materials.ochre
        );
      }
    }

    for (const x of [-6.45, 6.45]) {
      box(
        x,
        5.82,
        -2.2,
        0.12,
        0.12,
        9.6,
        materials.gold
      );

      for (let z = -6.8; z <= 2.8; z += 1.2) {
        box(
          x,
          5.55,
          z,
          0.09,
          0.55,
          0.09,
          materials.ochre
        );
      }
    }

    // Skylight frame and glass.
    const skylight = new THREE.Mesh(
      new THREE.BoxGeometry(6.8, 0.12, 10.8),
      materials.mosaicBlue
    );
    skylight.position.set(0, 5.64, -3.0);
    skylight.receiveShadow = true;
    scene.add(skylight);

    // Voxel rafters.
    for (let z = -8.4; z <= 3.6; z += 2.1) {
      box(
        0,
        5.82,
        z,
        6.9,
        0.18,
        0.2,
        materials.wood
      );
    }

    // Outer frame around the skylight.
    box(
      0,
      5.82,
      -3.0,
      7.2,
      0.25,
      0.25,
      materials.gold
    );

    box(
      0,
      5.82,
      -3.0,
      0.25,
      0.25,
      11.2,
      materials.gold
    );

    // -------------------------------------------------------------------------
    // Background doorway and distant architecture
    // -------------------------------------------------------------------------

    // Rear doorway frame.
    box(
      0,
      2.3,
      -11.05,
      3.8,
      4.6,
      0.35,
      materials.wood
    );

    box(
      0,
      4.55,
      -10.82,
      4.15,
      0.3,
      0.42,
      materials.gold
    );

    box(
      0,
      0.2,
      -10.8,
      4.15,
      0.4,
      0.42,
      materials.gold
    );

    // Distant interior visible through the doorway.
    box(
      0,
      1.65,
      -15.2,
      6.4,
      3.3,
      0.5,
      materials.dark
    );

    for (let x = -2.6; x <= 2.6; x += 1.3) {
      box(
        x,
        2.1,
        -14.9,
        0.18,
        2.2,
        0.18,
        materials.woodLight
      );
    }

    // Distant mosaic wall.
    box(
      0,
      2.1,
      -14.9,
      6.2,
      4.2,
      0.4,
      materials.mosaic
    );

    // Warm light in the distant room.
    const distantLight = new THREE.PointLight(0xffb35d, 1.6, 14, 2);
    distantLight.position.set(0, 3.5, -13.4);
    scene.add(distantLight);

    // -------------------------------------------------------------------------
    // Lighting
    // -------------------------------------------------------------------------

    const hemisphere = new THREE.HemisphereLight(0xd9e5df, 0x33251b, 1.25);
    scene.add(hemisphere);

    const sun = new THREE.DirectionalLight(0xffe0a3, 3.2);
    sun.position.set(-7, 10, 6);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -13;
    sun.shadow.camera.right = 13;
    sun.shadow.camera.top = 13;
    sun.shadow.camera.bottom = -13;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 40;
    sun.shadow.bias = -0.00035;
    sun.shadow.normalBias = 0.025;
    scene.add(sun);

    const coolFill = new THREE.DirectionalLight(0x91b9c3, 1.15);
    coolFill.position.set(8, 5, -8);
    scene.add(coolFill);

    const poolLight = new THREE.PointLight(0x8bc8cf, 1.4, 11, 2);
    poolLight.position.set(0.4, 1.2, 0.1);
    scene.add(poolLight);

    // -------------------------------------------------------------------------
    // Custom camera controls
    // -------------------------------------------------------------------------

    const controls = {
      target: new THREE.Vector3(0, 1.8, -0.7),
      azimuth: 0.68,
      polar: 1.08,
      radius: 18.5,
      dragging: false,
      panning: false,
      lastX: 0,
      lastY: 0
    };

    function updateCamera() {
      const sinPolar = Math.sin(controls.polar);
      camera.position.set(
        controls.target.x + controls.radius * sinPolar * Math.sin(controls.azimuth),
        controls.target.y + controls.radius * Math.cos(controls.polar),
        controls.target.z + controls.radius * sinPolar * Math.cos(controls.azimuth)
      );
      camera.lookAt(controls.target);
    }

    updateCamera();

    renderer.domElement.addEventListener("pointerdown", event => {
      controls.dragging = true;
      controls.panning = event.button === 2 || event.shiftKey;
      controls.lastX = event.clientX;
      controls.lastY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
    });

    renderer.domElement.addEventListener("pointermove", event => {
      if (!controls.dragging) return;

      const dx = event.clientX - controls.lastX;
      const dy = event.clientY - controls.lastY;
      controls.lastX = event.clientX;
      controls.lastY = event.clientY;

      if (controls.panning) {
        const scale = controls.radius * 0.0012;
        const right = new THREE.Vector3();
        const up = new THREE.Vector3();

        camera.getWorldDirection(right);
        right.cross(camera.up).normalize();
        up.cross(right).normalize();

        controls.target.addScaledVector(right, -dx * scale);
        controls.target.addScaledVector(up, dy * scale);
      } else {
        controls.azimuth -= dx * 0.006;
        controls.polar = THREE.MathUtils.clamp(
          controls.polar - dy * 0.005,
          0.38,
          1.42
        );
      }

      updateCamera();
    });

    function endDrag(event) {
      controls.dragging = false;
      controls.panning = false;
      if (event.pointerId !== undefined && renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
    }

    renderer.domElement.addEventListener("pointerup", endDrag);
    renderer.domElement.addEventListener("pointercancel", endDrag);
    renderer.domElement.addEventListener("contextmenu", event => event.preventDefault());

    renderer.domElement.addEventListener("wheel", event => {
      event.preventDefault();
      controls.radius = THREE.MathUtils.clamp(
        controls.radius + event.deltaY * 0.012,
        7,
        30
      );
      updateCamera();
    }, { passive: false });

    // -------------------------------------------------------------------------
    // Resize and animation
    // -------------------------------------------------------------------------

    window.addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    });

    const clock = new THREE.Clock();

    function animate() {
      const elapsed = clock.getElapsedTime();

      for (const shard of glintShards) {
        shard.position.y = shard.userData.baseY + Math.sin(elapsed * 1.15 + shard.userData.phase) * 0.035;
        shard.rotation.y += 0.0007;
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
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
    spawn: { x: 0.0, z: 13.3, yaw: 0 },
    relic: { id: "generic", name: "Tomb Raider Relic", x: -10.0, z: -12.7 },
    env:   { background: 0x11110f, fogColor: 0x11110f, fogDensity: 0.022 },
    doors: {
      next: { x: 12.0, z: -10.7 },
      prev: { x: -12.0, z: 9.3 }
    }
  };
}

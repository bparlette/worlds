// @world {"id": "1015", "title": "Super Mario World 2: Yoshi's Island", "sub": "Yoshi's Island", "system": "3D Render"}
// Converted from 1015-super_mario_world_2_yoshix27s_island_yoshix27s_island.html into a Back Roms World Walker module.

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
  // (strict modules throw where sloppy scripts did not): py, pz
  let py = 0;
  let pz = 0;

    

    // scene redirect
    scene.background = new THREE.Color(0x9fe9f1);
    scene.fog = new THREE.Fog(0x9fe9f1, 28, 65);

    camera = dummyCamera();

    renderer = dummyRenderer();

    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    document.body.prepend(renderer.domElement);

    // Soft, directional sunlight.
    const sun = new THREE.DirectionalLight(0xfff4d7, 3.3);
    sun.position.set(-12, 18, 9);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -22;
    sun.shadow.camera.right = 22;
    sun.shadow.camera.top = 22;
    sun.shadow.camera.bottom = -22;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 55;
    sun.shadow.bias = -0.0008;
    sun.shadow.normalBias = 0.025;
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0x8cd9ff, 1.15);
    fill.position.set(10, 8, -12);
    scene.add(fill);

    // Materials.
    const mat = {
      grass: new THREE.MeshStandardMaterial({
        color: 0x70d65b,
        roughness: 0.92
      }),
      grassDark: new THREE.MeshStandardMaterial({
        color: 0x3fa84d,
        roughness: 1
      }),
      grassLight: new THREE.MeshStandardMaterial({
        color: 0x91e478,
        roughness: 1
      }),
      soil: new THREE.MeshStandardMaterial({
        color: 0xd87843,
        roughness: 0.95
      }),
      path: new THREE.MeshStandardMaterial({
        color: 0xf2d495,
        roughness: 1
      }),
      trunk: new THREE.MeshStandardMaterial({
        color: 0x8b522f,
        roughness: 1
      }),
      leaf: new THREE.MeshStandardMaterial({
        color: 0x39b85f,
        roughness: 0.95
      }),
      leafLight: new THREE.MeshStandardMaterial({
        color: 0x68d66b,
        roughness: 0.95
      }),
      leafDark: new THREE.MeshStandardMaterial({
        color: 0x288e4b,
        roughness: 1
      }),
      mushroom: new THREE.MeshStandardMaterial({
        color: 0xf15b42,
        roughness: 0.85
      }),
      mushroomCap: new THREE.MeshStandardMaterial({
        color: 0xf8c76d,
        roughness: 0.85
      }),
      wood: new THREE.MeshStandardMaterial({
        color: 0x9a5932,
        roughness: 0.9
      }),
      woodDark: new THREE.MeshStandardMaterial({
        color: 0x633d29,
        roughness: 0.95
      }),
      stone: new THREE.MeshStandardMaterial({
        color: 0x6c8590,
        roughness: 0.95
      }),
      stoneLight: new THREE.MeshStandardMaterial({
        color: 0x93aaa9,
        roughness: 0.95
      }),
      cloud: new THREE.MeshStandardMaterial({
        color: 0xf3f7ef,
        roughness: 1
      }),
      rope: new THREE.MeshStandardMaterial({
        color: 0xd99a45,
        roughness: 1
      }),
      flag: new THREE.MeshStandardMaterial({
        color: 0xf26448,
        roughness: 0.9,
        side: THREE.DoubleSide
      }),
      metal: new THREE.MeshStandardMaterial({
        color: 0x6c7780,
        metalness: 0.45,
        roughness: 0.65
      })
    };

    const world = new THREE.Group();
    scene.add(world);

    const voxel = (w, h, d, material, x, y, z, parent = world) => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        material
      );
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    };

    const sphere = (radius, material, x, y, z, parent = world) => {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 12, 8),
        material
      );
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    };

    // Water plane with a voxelized, animated shoreline.
    const water = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100, 1, 1),
      new THREE.MeshStandardMaterial({
        color: 0x48bfd0,
        roughness: 0.38,
        metalness: 0.08
      })
    );
    water.rotation.x = -Math.PI / 2;
    water.position.y = -0.72;
    water.receiveShadow = true;
    scene.add(water);

    const waveMaterial = new THREE.MeshBasicMaterial({
      color: 0xbcefff,
      transparent: true,
      opacity: 0.58,
      depthWrite: false
    });

    const waveRims = [];
    for (let i = 0; i < 15; i++) {
      const angle = (i / 15) * Math.PI * 2 + 0.3;
      const radius = 8.2 + (i % 4) * 0.45;
      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(0.75 + (i % 3) * 0.12, 0.13, 5, 24),
        waveMaterial
      );
      rim.rotation.x = Math.PI / 2;
      rim.rotation.z = angle;
      rim.position.set(
        Math.cos(angle) * radius,
        -0.58,
        Math.sin(angle) * radius
      );
      scene.add(rim);
      waveRims.push(rim);
    }

    // Main island: a chunky voxel plinth with irregular top.
    const island = new THREE.Group();
    world.add(island);

    const islandWidth = 13;
    const islandDepth = 11;

    for (let x = -6; x <= 6; x++) {
      for (let z = -5; z <= 5; z++) {
        const distance = Math.abs(x * 1.25 + z * 0.85);
        const edge = Math.max(0, 1 - distance / 3.2);
        const isShore = edge > 0.45;
        const yTop = isShore ? -0.08 : 0.28;

        voxel(
          1.08,
          1.25,
          1.08,
          mat.soil,
          x,
          -0.55,
          z,
          island
        );

        if (isShore) {
          voxel(
            0.88,
            0.28,
            0.88,
            mat.grassLight,
            x,
            0.08,
            z,
            island
          );
        } else {
          voxel(
            1.08,
            0.38,
            1.08,
            mat.grass,
            x,
            0.3,
            z,
            island
          );
        }
      }
    }

    // A smaller sandy bay on the left.
    for (let x = -4; x <= -1; x++) {
      for (let z = -2; z <= 2; z++) {
        const sand = Math.abs(x + 2.5) < 0.7;
        voxel(
          0.95,
          0.35,
          0.95,
          sand ? mat.path : mat.grassLight,
          x,
          0.02,
          z,
          island
        );
      }
    }

    // Curving path made from individual paving voxels.
    const pathPoints = [
      [-5.4, 0.31, 1.2],
      [-4.3, 0.31, 1.5],
      [-3.1, 0.31, 0.2],
      [-2.1, 0.31, -1.2],
      [-0.7, 0.31, -1.9],
      [0.5, 0.31, -1.25],
      [1.45, 0.31, 0.15],
      [2.25, 0.31, 1.35],
      [3.15, 0.31, 2.25],
      [4.25, 0.31, 2.0]
    ];

    for (const [x, y, z] of pathPoints) {
      voxel(
        0.72,
        0.16,
        0.72,
        mat.path,
        x,
        y,
        z,
        island
      );
    }

    // Clouds as clusters of soft cubes.
    function makeCloud(x, y, z, scale = 1) {
      const cloud = new THREE.Group();
      cloud.position.set(x, y, z);
      cloud.scale.setScalar(scale);

      const puffs = [
        [-1.1, 0, 0, 0.7],
        [-0.3, 0.25, 0, 0.9],
        [0.55, 0.1, 0, 0.72],
        [1.15, -0.05, 0, 0.5],
        [0, -0.25, 0.1, 0.8]
      ];

      for (const [px, py, pz, r] of puffs) {
        const puff = new THREE.Mesh(
          new THREE.BoxGeometry(r * 1.55, r * 0.65, r),
          mat.cloud
        );
        puff.position.set(px, py, pz);
        puff.castShadow = false;
        cloud.add(puff);
      }

      island.add(cloud);
      return cloud;
    }

    makeCloud(-3.8, 1.15, 1.2, 1.1);
    makeCloud(1.65, 1.35, -0.9, 0.9);
    makeCloud(3.6, 1.05, 1.3, 0.8);
    makeCloud(-0.8, 1.2, 2.2, 0.7);

    // Palm trees.
    function makePalm(x, z, scale = 1) {
      const tree = new THREE.Group();
      tree.position.set(x, 0.35, z);
      tree.scale.setScalar(scale);

      voxel(0.34, 2.2, 0.34, mat.trunk, 0, 1.1, 0, tree);

      const crown = new THREE.Group();
      crown.position.y = 2.25;
      tree.add(crown);

      for (let i = 0; i < 7; i++) {
        const angle = (i / 7) * Math.PI * 2;
        const leaf = voxel(
          0.22,
          0.65,
          0.15,
          i % 2 ? mat.leaf : mat.leafLight,
          Math.cos(angle) * 0.25,
          0,
          Math.sin(angle) * 0.25,
          crown
        );
        leaf.rotation.z = Math.cos(angle) * 0.35;
        leaf.rotation.x = Math.sin(angle) * 0.35;
      }

      island.add(tree);
      return tree;
    }

    makePalm(-3.6, 1.8, 0.9);
    makePalm(-4.0, 1.2, 0.72);
    makePalm(-2.9, 2.2, 0.65);
    makePalm(3.95, -2.35, 0.85);

    // Central grove of blocky trees.
    const treePositions = [
      [-1.05, 0.45, 0.2],
      [0.15, 0.45, -0.45],
      [1.15, 0.45, 0.55],
      [-0.25, 0.45, 1.05],
      [0.85, 0.45, -1.35]
    ];

    for (const [x, y, z] of treePositions) {
      const tree = new THREE.Group();
      tree.position.set(x, y, z);

      voxel(0.55, 2.2, 0.55, mat.trunk, 0, 1.1, 0, tree);

      const crown = voxel(
        1.55,
        1.8,
        1.55,
        mat.leaf,
        0,
        2.75,
        0,
        tree
      );

      crown.rotation.y = (x + z) * 0.35;

      const top = voxel(
        0.85,
        0.85,
        0.85,
        mat.leafLight,
        0,
        3.85,
        0,
        tree
      );

      top.rotation.y = crown.rotation.y;
      island.add(tree);
    }

    // Mushroom cluster.
    const mushroomPositions = [
      [-4.15, 0.32, 0.15],
      [-3.75, 0.32, 0.45],
      [-4.45, 0.32, -0.35],
      [2.95, 0.32, -0.7]
    ];

    for (const [x, y, z] of mushroomPositions) {
      voxel(0.25, 0.4, 0.25, mat.mushroom, x, y + 0.2, z, island);
      voxel(
        0.34,
        0.12,
        0.34,
        mat.mushroomCap,
        x,
        y + 0.43,
        z,
        island
      );
    }

    // Castle on the upper plateau.
    const castle = new THREE.Group();
    castle.position.set(0.25, 2.25, -0.45);
    island.add(castle);

    // Main keep.
    voxel(3.6, 3.0, 3.6, mat.stone, 0, 1.5, 0, castle);
    voxel(3.9, 0.35, 3.9, mat.stoneLight, 0, 3.1, 0, castle);

    for (let x = -1.5; x <= 1.5; x += 0.75) {
      for (let z = -1.5; z <= 1.5; z += 0.75) {
        voxel(
          0.48,
          1.7,
          0.48,
          mat.stoneLight,
          x,
          1.55,
          z,
          castle
        );
      }
    }

    // Tower.
    voxel(2.2, 4.2, 2.2, mat.stone, 2.65, 2.1, -0.45, castle);
    voxel(2.45, 0.35, 2.45, mat.stoneLight, 2.65, 4.3, -0.45, castle);

    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const x = 2.65 + Math.cos(a) * 1.1;
      const z = -0.45 + Math.sin(a) * 1.1;
      voxel(
        0.45,
        1.6,
        0.45,
        mat.stoneLight,
        x,
        2.1,
        z,
        castle
      );
    }

    // Roof and battlements.
    const roof = voxel(
      4.1,
      1.15,
      4.1,
      mat.woodDark,
      0,
      4.0,
      0,
      castle
    );
    roof.rotation.z = -0.28;

    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      const x = 2.65 + Math.cos(a) * 1.25;
      const z = -0.45 + Math.sin(a) * 1.25;
      voxel(
        0.55,
        0.7,
        0.55,
        mat.stoneLight,
        x,
        4.75,
        z,
        castle
      );
    }

    // Castle flag.
    const flagPole = voxel(
      0.16,
      3.0,
      0.16,
      mat.woodDark,
      0.2,
      5.25,
      0.25,
      castle
    );

    const flag = new THREE.Mesh(
      new THREE.PlaneGeometry(1.1, 0.65),
      mat.flag
    );
    flag.position.set(0.78, 5.1, 0.25);
    flag.rotation.y = -0.15;
    castle.add(flag);

    // Suspended chains and lanterns.
    for (const [x, y, z] of [[-1.45, 3.45, 1.35], [1.45, 3.45, 1.35]]) {
      voxel(0.12, 0.85, 0.12, mat.metal, x, y, z, castle);
      voxel(0.3, 0.22, 0.3, mat.metal, x, y - 0.48, z, castle);
      voxel(
        0.28,
        0.32,
        0.28,
        new THREE.MeshStandardMaterial({
          color: 0xffd58a,
          emissive: 0xff9c35,
          emissiveIntensity: 0.75,
          roughness: 0.7
        }),
        x,
        y - 0.75,
        z,
        castle
      );
    }

    // Small dock and boat.
    const dock = new THREE.Group();
    dock.position.set(-4.2, 0.35, 2.2);
    dock.rotation.y = -0.18;
    island.add(dock);

    voxel(2.6, 0.25, 0.8, mat.wood, 0, 0.15, 0, dock);
    for (let i = 0; i < 7; i++) {
      voxel(
        0.12,
        0.7,
        0.12,
        mat.woodDark,
        -1.1 + i * 0.37,
        0.5,
        0,
        dock
      );
    }

    const boat = new THREE.Group();
    boat.position.set(0.35, 0.48, 0.05);
    boat.rotation.y = 0.12;
    dock.add(boat);

    const hull = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 12, 8),
      mat.wood
    );
    hull.scale.set(1.25, 0.55, 0.75);
    hull.castShadow = true;
    boat.add(hull);

    voxel(0.12, 0.55, 0.12, mat.woodDark, 0, 0.25, 0, boat);
    voxel(0.45, 0.1, 0.1, mat.metal, 0, 0.55, 0, boat);

    // Helicopter with blocky rotors.
    const helicopter = new THREE.Group();
    helicopter.position.set(8.8, 5.2, 2.6);
    helicopter.rotation.y = -0.35;
    scene.add(helicopter);

    // Body.
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 1.15, 1.35),
      mat.metal
    );
    body.position.y = 0.45;
    body.castShadow = true;
    helicopter.add(body);

    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(1.35, 0.9, 1.15),
      new THREE.MeshStandardMaterial({
        color: 0xf0b63f,
        emissive: 0x5a2600,
        emissiveIntensity: 0.2,
        roughness: 0.65
      })
    );
    cabin.position.set(-0.25, 1.05, 0);
    cabin.castShadow = true;
    helicopter.add(cabin);

    const windowMat = new THREE.MeshStandardMaterial({
      color: 0x173b4c,
      metalness: 0.35,
      roughness: 0.25
    });

    for (const x of [-0.95, 0.42]) {
      const glass = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.5, 0.82),
        windowMat
      );
      glass.position.set(x, 1.08, 0);
      helicopter.add(glass);
    }

    // Tail.
    const tail = voxel(
      0.75,
      0.5,
      0.55,
      mat.metal,
      1.05,
      0.35,
      0,
      helicopter
    );
    tail.rotation.z = -0.35;

    // Main rotor.
    const rotorHub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 0.22, 10),
      mat.metal
    );
    rotorHub.rotation.x = Math.PI / 2;
    rotorHub.position.y = 2.05;
    helicopter.add(rotorHub);

    const rotorBlades = new THREE.Group();
    rotorBlades.position.y = 2.12;
    helicopter.add(rotorBlades);

    for (let i = 0; i < 4; i++) {
      const blade = voxel(
        0.1,
        0.08,
        1.45,
        mat.woodDark,
        0,
        0,
        0,
        rotorBlades
      );
      blade.rotation.y = (i / 4) * Math.PI * 2;
    }

    // Tail rotor.
    const tailRotor = new THREE.Group();
    tailRotor.position.set(1.1, 0.85, 0);
    helicopter.add(tailRotor);

    for (let i = 0; i < 3; i++) {
      const blade = voxel(
        0.08,
        0.08,
        0.65,
        mat.woodDark,
        0,
        0,
        0,
        tailRotor
      );
      blade.rotation.y = (i / 3) * Math.PI;
    }

    // Landing skids.
    for (const x of [-0.65, 0.65]) {
      const skid = voxel(
        0.1,
        0.1,
        1.65,
        mat.metal,
        x,
        -0.35,
        0,
        helicopter
      );
      skid.rotation.z = x < 0 ? -0.18 : 0.18;
    }

    // Landing gear.
    for (const x of [-0.65, 0.65]) {
      voxel(
        0.1,
        0.55,
        0.1,
        mat.metal,
        x,
        -0.05,
        0,
        helicopter
      );
    }

    // Small sign near the path.
    const sign = new THREE.Group();
    sign.position.set(-3.25, 0.3, 0.25);
    sign.rotation.y = 0.3;
    island.add(sign);

    voxel(0.13, 1.25, 0.13, mat.woodDark, 0, 0.62, 0, sign);
    voxel(
      0.72,
      0.42,
      0.1,
      mat.wood,
      0,
      1.3,
      0,
      sign
    );
    voxel(
      0.46,
      0.18,
      0.03,
      new THREE.MeshStandardMaterial({
        color: 0xf16849,
        emissive: 0x5b1505,
        emissiveIntensity: 0.25
      }),
      0,
      1.3,
      0.06,
      sign
    );

    // Tiny path markers.
    for (let i = 0; i < 5; i++) {
      const x = -4.1 + i * 0.8;
      const z = 2.25 - (i % 2) * 0.35;
      voxel(
        0.18,
        0.5,
        0.18,
        mat.woodDark,
        x,
        0.55,
        z,
        island
      );
      voxel(
        0.27,
        0.16,
        0.27,
        mat.mushroomCap,
        x,
        0.8,
        z,
        island
      );
    }

    // Voxel clouds in the sky.
    function makeSkyCloud(x, y, z, scale = 1) {
      const cloud = new THREE.Group();
      cloud.position.set(x, y, z);
      cloud.scale.setScalar(scale);

      const puffs = [
        [-1.0, 0, 0, 0.8],
        [-0.25, 0.2, 0, 1.0],
        [0.55, 0.1, 0, 0.85],
        [1.15, -0.05, 0, 0.55]
      ];

      for (const [px, py, pz, r] of puffs) {
        const puff = new THREE.Mesh(
          new THREE.BoxGeometry(r * 1.5, r * 0.65, r),
          mat.cloud
        );
        puff.position.set(px, py, pz);
        puff.castShadow = false;
        cloud.add(puff);
      }

      scene.add(cloud);
      return cloud;
    }

    makeSkyCloud(-8, 8.5, -7, 1.4);
    makeSkyCloud(8, 10.5, -10, 1.7);
    makeSkyCloud(-11, 12, 4, 1.25);
    makeSkyCloud(12, 13, 3, 1.4);

    // Floating island dust motes.
    const moteMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.45,
      depthWrite: false
    });

    const motes = [];
    for (let i = 0; i < 32; i++) {
      const mote = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.08, 0.08),
        moteMaterial
      );
      mote.position.set(
        (Math.random() - 0.5) * 16,
        1 + Math.random() * 7,
        (Math.random() - 0.5) * 13
      );
      scene.add(mote);
      motes.push(mote);
    }

    // Camera controls implemented directly.
    const target = new THREE.Vector3(0.3, 1.7, 0);
    const spherical = new THREE.Spherical(18.5, 1.02, Math.PI * 0.38);
    const defaultSpherical = spherical.clone();

    let dragging = false;
    let pointerX = 0;
    let pointerY = 0;
    let zoomSpeed = 0;

    function updateCamera() {
      spherical.theta += zoomSpeed;
      spherical.radius += zoomSpeed * 0.0015;
      spherical.radius = THREE.MathUtils.clamp(spherical.radius, 8, 32);

      camera.position.setFromSpherical(spherical).add(target);
      camera.lookAt(target);
    }

    renderer.domElement.addEventListener("pointerdown", (event) => {
      dragging = true;
      pointerX = event.clientX;
      pointerY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
      renderer.domElement.style.cursor = "grabbing";
    });

    renderer.domElement.addEventListener("pointermove", (event) => {
      if (!dragging) return;

      const dx = event.clientX - pointerX;
      const dy = event.clientY - pointerY;
      pointerX = event.clientX;
      pointerY = event.clientY;

      spherical.theta -= dx * 0.006;
      spherical.phi = THREE.MathUtils.clamp(
        spherical.phi - dy * 0.005,
        0.35,
        1.42
      );

      updateCamera();
    });

    function endDrag(event) {
      dragging = false;
      renderer.domElement.style.cursor = "grab";
      if (event.pointerId !== undefined && renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
    }

    renderer.domElement.addEventListener("pointerup", endDrag);
    renderer.domElement.addEventListener("pointercancel", endDrag);
    renderer.domElement.style.cursor = "grab";

    renderer.domElement.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        zoomSpeed = THREE.MathUtils.clamp(
          -event.deltaY * 0.001,
          -0.22,
          0.22
        );
      },
      { passive: false }
    );

    dummyEl().addEventListener("click", () => {
      spherical.copy(defaultSpherical);
      zoomSpeed = 0;
      updateCamera();
    });

    dummyEl().addEventListener("click", () => {
      spherical.theta += Math.PI;
      zoomSpeed = 0;
      updateCamera();
    });

    addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    });

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      const delta = Math.min(clock.getDelta(), 0.05);

      rotorBlades.rotation.y += delta * 18;
      tailRotor.rotation.y += delta * 24;

      waveRims.forEach((rim, i) => {
        rim.rotation.z = rim.rotation.z + delta * (0.025 + i * 0.002);
        rim.position.y = -0.58 + Math.sin(elapsed * 0.8 + i) * 0.025;
      });

      for (let i = 0; i < motes.length; i++) {
        const mote = motes[i];
        mote.position.y += delta * (0.08 + (i % 3) * 0.025);
        mote.position.x += Math.sin(elapsed * 0.45 + i) * delta * 0.045;

        if (mote.position.y > 10) {
          mote.position.y = 0.5;
          mote.position.x = (Math.random() - 0.5) * 16;
          mote.position.z = (Math.random() - 0.5) * 13;
        }
      }

      flag.rotation.z = Math.sin(elapsed * 2.4) * 0.12;
      flag.rotation.y = Math.sin(elapsed * 1.7) * 0.08;

      updateCamera();
      renderer.render(scene, camera);
    }

    updateCamera();
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
    relic: { id: "generic", name: "Super Mario World 2: Yoshi's Island Relic", x: -10.0, z: -12.0 },
    env:   { background: 0x9fe9f1, fogColor: 0x9fe9f1, fogDensity: 0.025 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 },
      east: { x: 12.0, z: 10.0 },
      west: { x: -12.0, z: -10.0 }
    }
  };
}

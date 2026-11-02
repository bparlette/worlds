// @world {"id": "1061", "title": "Super Mario Bros. 3", "sub": "World 1 Diorama", "system": "3D Render"}
// Converted from 1061-super_mario_bros_3_world_1_diorama.html into a Back Roms World Walker module.

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
  // (strict modules throw where sloppy scripts did not): px, py, pz
  let px = 0;
  let py = 0;
  let pz = 0;

    

    // -------------------------------------------------------------------------
    // Renderer and Scene
    // -------------------------------------------------------------------------

    // scene redirect
    scene.background = new THREE.Color(0x101323);
    scene.fog = new THREE.Fog(0x101323, 18, 35);

    camera = dummyCamera();

    renderer = dummyRenderer();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    

    // -------------------------------------------------------------------------
    // Materials
    // -------------------------------------------------------------------------

    const materials = {
      wood: new THREE.MeshStandardMaterial({
        color: 0xd68b43,
        roughness: 0.82
      }),
      woodDark: new THREE.MeshStandardMaterial({
        color: 0x8a4820,
        roughness: 0.9
      }),
      woodLight: new THREE.MeshStandardMaterial({
        color: 0xe1a25d,
        roughness: 0.78
      }),
      interior: new THREE.MeshStandardMaterial({
        color: 0x9ad4ed,
        roughness: 0.88
      }),
      blue: new THREE.MeshStandardMaterial({
        color: 0x3589c9,
        roughness: 0.65
      }),
      blueLight: new THREE.MeshStandardMaterial({
        color: 0x68b6e8,
        roughness: 0.6
      }),
      red: new THREE.MeshStandardMaterial({
        color: 0xd84a43,
        roughness: 0.72
      }),
      redDark: new THREE.MeshStandardMaterial({
        color: 0x8e2928,
        roughness: 0.8
      }),
      green: new THREE.MeshStandardMaterial({
        color: 0x38b967,
        roughness: 0.76
      }),
      greenDark: new THREE.MeshStandardMaterial({
        color: 0x177947,
        roughness: 0.8
      }),
      yellow: new THREE.MeshStandardMaterial({
        color: 0xf2c248,
        roughness: 0.68
      }),
      white: new THREE.MeshStandardMaterial({
        color: 0xf4f2df,
        roughness: 0.9
      }),
      skin: new THREE.MeshStandardMaterial({
        color: 0xdca36e,
        roughness: 0.82
      }),
      brown: new THREE.MeshStandardMaterial({
        color: 0x9a6036,
        roughness: 0.85
      }),
      black: new THREE.MeshStandardMaterial({
        color: 0x181923,
        roughness: 0.7
      })
    };

    // -------------------------------------------------------------------------
    // Voxel Helpers
    // -------------------------------------------------------------------------

    const voxel = (
      size,
      material,
      x = 0,
      y = 0,
      z = 0,
      castShadow = true,
      receiveShadow = true
    ) => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        material
      );

      mesh.position.set(x, y, z);
      mesh.castShadow = castShadow;
      mesh.receiveShadow = receiveShadow;
      return mesh;
    };

    const addVoxel = (
      size,
      material,
      x,
      y,
      z,
      castShadow = true,
      receiveShadow = true
    ) => {
      const mesh = voxel(size, material, x, y, z, castShadow, receiveShadow);
      scene.add(mesh);
      return mesh;
    };

    function voxelBox(
      width,
      height,
      depth,
      material,
      x,
      y,
      z,
      castShadow = true,
      receiveShadow = true
    ) {
      const mesh = voxel(
        Math.max(width, height, depth),
        material,
        x,
        y,
        z,
        castShadow,
        receiveShadow
      );

      // Scale the cube to form a rectangular box.
      mesh.scale.set(width / Math.max(width, height, depth),
        height / Math.max(width, height, depth),
        depth / Math.max(width, height, depth));

      return mesh;
    }

    function addLine(points, material, thickness = 1) {
      const geometry = new THREE.BufferGeometry().setFromPoints(
        points.map(p => new THREE.Vector3(...p))
      );
      const mesh = new THREE.Mesh(
        geometry,
        new THREE.LineBasicMaterial({ color: material.color, transparent: true, opacity: 0.7 })
      );
      scene.add(mesh);
    }

    // -------------------------------------------------------------------------
    // Lighting
    // -------------------------------------------------------------------------

    scene.add(new THREE.HemisphereLight(0xb9e5ff, 0x4a3020, 2.0));

    const keyLight = new THREE.DirectionalLight(0xfff0d0, 3.2);
    keyLight.position.set(7, 12, 9);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.left = -12;
    keyLight.shadow.camera.right = 12;
    keyLight.shadow.camera.top = 12;
    keyLight.shadow.camera.bottom = -12;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 35;
    keyLight.shadow.bias = -0.0003;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x68b9ff, 1.4);
    rimLight.position.set(-8, 7, -7);
    scene.add(rimLight);

    // -------------------------------------------------------------------------
    // Market Frame and Interior
    // -------------------------------------------------------------------------

    // Main frame: vertical posts and top/bottom rails.
    addVoxel(2.2, materials.wood, -5.1, 0, 0);
    addVoxel(2.2, materials.wood, 5.1, 0, 0);
    addVoxel(10.4, materials.wood, 0, 3.95, 0);
    addVoxel(10.4, materials.wood, 0, -3.95, 0);

    // Decorative frame trim.
    for (let i = 0; i < 10; i++) {
      addVoxel(
        0.38,
        materials.woodDark,
        -4.55 + i * 1.05,
        3.45,
        0
      );
    }

    for (let i = 0; i < 10; i++) {
      addVoxel(
        0.38,
        materials.woodDark,
        -4.55 + i * 1.05,
        -3.45,
        0
      );
    }

    // Back wall and side walls.
    voxelBox(10.2, 7.5, 0.45, materials.interior, 0, 0, -4.65);
    voxelBox(0.45, 7.5, 9.2, materials.interior, -5.05, 0, -0.05);
    voxelBox(0.45, 7.5, 9.2, materials.interior, 5.05, 0, -0.05);

    // Ceiling valance.
    for (let i = 0; i < 14; i++) {
      const x = -4.8 + i * 0.64;
      addVoxel(0.52, materials.redDark, x, 4.25, -4.2);
    }

    // Ceiling trim.
    addVoxel(10.2, materials.red, 0, 4.0, -4.25);

    // Floor platform.
    voxelBox(10.8, 0.55, 9.6, materials.wood, 0, -4.25, -0.15);
    voxelBox(10.45, 0.2, 9.35, materials.woodLight, 0, -3.9, -0.15);

    // Front base trim.
    for (let i = 0; i < 16; i++) {
      addVoxel(
        0.32,
        i % 2 === 0 ? materials.woodDark : materials.wood,
        -4.9 + i * 0.64,
        -3.72,
        4.55
      );
    }

    // -------------------------------------------------------------------------
    // Sky backdrop
    // -------------------------------------------------------------------------

    // Back wall upper panel.
    voxelBox(9.6, 3.3, 0.18, materials.blue, 0, 2.65, -4.43);

    // Clouds made from white cubes.
    function addCloud(x, y, z, scale = 1) {
      const cloud = new THREE.Group();
      cloud.position.set(x, y, z);
      cloud.scale.setScalar(scale);

      const puffs = [
        [-1.2, 0, 0, 0.65],
        [-0.55, 0.25, 0, 0.8],
        [0.2, 0.15, 0, 0.7],
        [0.9, 0, 0, 0.62],
        [0.15, -0.1, 0, 0.85]
      ];

      for (const [px, py, pz, s] of puffs) {
        const puff = voxel(
          s * 0.85,
          materials.white,
          px,
          py,
          pz,
          false,
          false
        );
        cloud.add(puff);
      }

      scene.add(cloud);
      return cloud;
    }

    addCloud(-2.8, 3.2, -4.25, 0.8);
    addCloud(0.1, 4.15, -4.28, 0.7);
    addCloud(3.1, 3.0, -4.25, 0.85);
    addCloud(-3.6, 1.25, -4.25, 0.5);

    // Sun.
    addVoxel(
      1.15,
      new THREE.MeshStandardMaterial({
        color: 0xffd36a,
        emissive: 0xffa629,
        emissiveIntensity: 0.55,
        roughness: 0.8
      }),
      4.25,
      4.5,
      -4.25,
      false,
      false
    );

    // -------------------------------------------------------------------------
    // Hanging sign and lantern
    // -------------------------------------------------------------------------

    // Sign support.
    addVoxel(0.16, materials.woodDark, -0.6, 4.55, -3.95);
    addVoxel(0.16, materials.woodDark, 0.6, 4.55, -3.95);

    // Pixel "OPEN" sign.
    const sign = new THREE.Group();
    sign.position.set(0, 4.15, -3.85);

    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 5; col++) {
        const pixel = voxel(
          0.16,
          materials.yellow,
          (col - 2) * 0.2,
          row * 0.2,
          0,
          false,
          false
        );
        sign.add(pixel);
      }
    }

    scene.add(sign);

    // Hanging lantern.
    addVoxel(0.12, materials.woodDark, 1.75, 4.5, -3.95);
    addVoxel(0.12, materials.woodDark, 2.35, 4.5, -3.95);
    addVoxel(0.75, 0.72, 0.72, materials.yellow, 2.05, 3.82, -3.95);
    addVoxel(0.9, 0.12, 0.9, materials.redDark, 2.05, 4.25, -3.95);

    // -------------------------------------------------------------------------
    // Counter and produce
    // -------------------------------------------------------------------------

    // Main counter.
    voxelBox(5.4, 0.65, 1.55, materials.wood, 0, -2.95, -1.25);
    voxelBox(5.65, 0.16, 1.72, materials.woodLight, 0, -2.55, -1.25);

    // Counter front panels.
    for (let i = 0; i < 4; i++) {
      addVoxel(
        0.95,
        materials.woodDark,
        -1.85 + i * 1.28,
        -3.27,
        -0.48
      );

      addVoxel(
        0.12,
        materials.yellow,
        -1.85 + i * 1.28,
        -2.98,
        -0.42
      );
    }

    // Cashier register.
    voxelBox(1.15, 0.45, 0.85, materials.red, 1.85, -2.65, -2.45);
    voxelBox(1.35, 0.14, 0.95, materials.redDark, 1.85, -2.38, -2.45);
    voxelBox(0.72, 0.28, 0.45, materials.black, 1.85, -2.12, -2.45);

    // Coin.
    addVoxel(
      0.22,
      materials.gold || materials.yellow,
      1.85,
      -1.94,
      -2.45
    );

    // Produce crate.
    voxelBox(1.85, 0.32, 1.1, materials.wood, -2.0, -2.73, -1.15);
    voxelBox(1.65, 0.1, 0.9, materials.woodLight, -2.0, -2.52, -1.15);

    // Apples.
    const appleMaterials = [
      new THREE.MeshStandardMaterial({ color: 0xd94a48, roughness: 0.7 }),
      new THREE.MeshStandardMaterial({ color: 0xb83d3f, roughness: 0.7 }),
      new THREE.MeshStandardMaterial({ color: 0xe56b4c, roughness: 0.7 })
    ];

    for (let i = 0; i < 7; i++) {
      const apple = voxel(
        0.34,
        appleMaterials[i % appleMaterials.length],
        -2.55 + (i % 3) * 0.52,
        -2.27 + Math.floor(i / 3) * 0.42,
        -1.15 + (i % 2) * 0.2
      );
      apple.rotation.y = i * 0.5;
    }

    // -------------------------------------------------------------------------
    // Mario
    // -------------------------------------------------------------------------

    function buildMario(x, y, z, rotation = 0) {
      const mario = new THREE.Group();
      mario.position.set(x, y, z);
      mario.rotation.y = rotation;

      // Hat.
      voxelBox(1.05, 0.28, 0.62, materials.red, 0, 1.25, 0);
      voxelBox(0.72, 0.25, 0.64, materials.red, 0, 1.43, 0);

      // Hair.
      voxelBox(0.82, 0.2, 0.5, materials.brown, 0, 1.55, 0);

      // Face.
      voxelBox(0.84, 0.7, 0.48, materials.skin, 0, 1.02, 0);
      voxelBox(0.34, 0.28, 0.5, materials.black, -0.2, 1.02, 0);
      voxelBox(0.34, 0.28, 0.5, materials.black, 0.2, 1.02, 0);

      // Nose.
      voxelBox(0.15, 0.15, 0.15, materials.noseMaterial || materials.black, 0, 0.84, 0.28);

      // Overalls.
      voxelBox(0.92, 0.7, 0.55, materials.blue, 0, 0.5, 0);
      voxelBox(0.28, 0.72, 0.58, materials.yellow, -0.25, 0.5, 0);
      voxelBox(0.28, 0.72, 0.58, materials.yellow, 0.25, 0.5, 0);

      // Arms.
      const leftArm = voxel(0.28, materials.red, -0.58, 0.98, 0);
      const rightArm = voxel(0.28, materials.red, 0.58, 0.98, 0);
      leftArm.rotation.z = -0.25;
      rightArm.rotation.z = 0.25;

      // Legs.
      voxelBox(0.24, 0.7, 0.42, materials.blue, -0.18, 0.02, 0);
      voxelBox(0.24, 0.7, 0.42, materials.blue, 0.18, 0.02, 0);

      mario.traverse(object => {
        if (object.isMesh) {
          object.castShadow = true;
          object.receiveShadow = true;
        }
      });

      scene.add(mario);
      return mario;
    }

    const mario = buildMario(-0.75, -3.43, -1.55, -0.35);

    // -------------------------------------------------------------------------
    // Toad
    // -------------------------------------------------------------------------

    function buildToad(x, y, z, rotation = 0) {
      const toad = new THREE.Group();
      toad.position.set(x, y, z);
      toad.rotation.y = rotation;

      // White head.
      voxelBox(0.72, 0.68, 0.55, materials.white, 0, 0.95, 0);
      voxelBox(0.54, 0.28, 0.58, materials.white, 0, 1.29, 0);

      // Eyes.
      voxelBox(0.1, 0.13, 0.08, materials.black, -0.14, 1.31, 0.3);
      voxelBox(0.1, 0.13, 0.08, materials.black, 0.14, 1.31, 0.3);

      // Nose.
      voxelBox(0.13, 0.1, 0.1, materials.red, 0, 1.16, 0.32);

      // Mouth.
      voxelBox(0.34, 0.09, 0.08, materials.black, 0, 1.08, 0.3);

      // Stem.
      voxelBox(0.3, 0.6, 0.3, materials.green, 0, 0.48, 0);
      voxelBox(0.42, 0.14, 0.42, materials.green, 0, 0.8, 0);

      // Cap.
      voxelBox(0.9, 0.18, 0.72, materials.red, 0, 1.5, 0);

      toad.traverse(object => {
        if (object.isMesh) {
          object.castShadow = true;
          object.receiveShadow = true;
        }
      });

      scene.add(toad);
      return toad;
    }

    const toad = buildToad(2.25, -3.43, -1.55, 0.4);

    // -------------------------------------------------------------------------
    // Cacti
    // -------------------------------------------------------------------------

    function buildCactus(x, y, z, height = 1.65) {
      const cactus = new THREE.Group();
      cactus.position.set(x, y, z);

      // Main body.
      for (let i = 0; i < 6; i++) {
        voxel(
          0.48,
          materials.green,
          0,
          0.18 + i * 0.27,
          0
        );
      }

      // Arms.
      for (const side of [-1, 1]) {
        for (let i = 0; i < 3; i++) {
          voxel(
            0.22,
            materials.green,
            side * 0.34,
            0.35 + i * 0.27,
            0
          );
        }

        voxel(
          0.22,
          materials.green,
          side * 0.34,
          1.17,
          0
        );
      }

      // Spines.
      for (let i = 0; i < 6; i++) {
        for (const side of [-1, 1]) {
          voxel(
            0.08,
            materials.white,
            side * 0.25,
            0.2 + i * 0.27,
            0.23
          );
        }
      }

      cactus.traverse(object => {
        if (object.isMesh) {
          object.castShadow = true;
          object.receiveShadow = true;
        }
      });

      scene.add(cactus);
      return cactus;
    }

    const cactusA = buildCactus(3.35, -3.43, -2.55, 1.8);
    const cactusB = buildCactus(4.55, -3.43, -2.65, 1.45);
    cactusB.rotation.y = -0.25;

    // -------------------------------------------------------------------------
    // Brick wall and blocks
    // -------------------------------------------------------------------------

    // Brick wall on the right.
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        const y = -3.25 + row * 0.67;
        const x = 4.05 + (col % 2) * 0.35 + Math.floor(row / 2) * 0.35;

        addVoxel(
          0.34,
          (row + col) % 2 === 0 ? materials.woodDark : materials.wood,
          x,
          y,
          -3.8
        );
      }
    }

    // Floating wooden platform.
    const floatingPlatform = new THREE.Group();
    floatingPlatform.position.set(2.2, 2.15, -2.7);

    voxelBox(3.2, 0.34, 1.1, materials.wood, 0, 0, 0);
    voxelBox(3.35, 0.12, 1.2, materials.woodLight, 0, 0.2, 0);

    for (let i = 0; i < 7; i++) {
      addVoxel(
        0.18,
        materials.woodDark,
        -1.2 + i * 0.4,
        -0.22,
        0
      );
    }

    floatingPlatform.traverse(object => {
      if (object.isMesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });

    scene.add(floatingPlatform);

    // Small hanging object on the floating platform.
    addVoxel(0.1, materials.woodDark, 0.9, 2.55, -2.7);
    addVoxel(0.1, materials.woodDark, 0.9, 1.8, -2.7);
    addVoxel(0.3, 0.3, 0.3, materials.yellow, 0.9, 1.5, -2.7);

    // -------------------------------------------------------------------------
    // Small foreground blocks
    // -------------------------------------------------------------------------

    // Green crate.
    voxelBox(2.2, 0.42, 1.15, materials.green, 0.25, -3.22, 2.25);
    voxelBox(2.35, 0.12, 1.25, materials.greenDark, 0.25, -3.0, 2.25);

    for (let i = 0; i < 5; i++) {
      const carrot = voxel(
        0.28,
        appleMaterials[i % appleMaterials.length],
        -0.55 + (i % 2) * 0.55,
        -2.73,
        2.25 + (i % 2) * 0.22
      );
      carrot.rotation.y = i * 0.4;
    }

    // Red crate.
    voxelBox(1.55, 0.38, 1.05, materials.red, -3.35, -3.24, 2.4);
    voxelBox(1.7, 0.12, 1.15, materials.redDark, -3.35, -3.02, 2.4);

    // -------------------------------------------------------------------------
    // Animation
    // -------------------------------------------------------------------------

    const clock = new THREE.Clock();
    const animated = [];

    // Store references to elements that should move.
    animated.push({
      object: mario,
      phase: 0,
      type: "bob"
    });

    animated.push({
      object: toad,
      phase: 1.7,
      type: "bob"
    });

    animated.push({
      object: cactusA,
      phase: 3.2,
      type: "sway"
    });

    animated.push({
      object: cactusB,
      phase: 4.1,
      type: "sway"
    });

    animated.push({
      object: floatingPlatform,
      phase: 0.4,
      type: "float"
    });

    function animate() {
      const elapsed = clock.getElapsedTime();

      for (const item of animated) {
        if (item.type === "bob") {
          item.object.position.y = Math.sin(elapsed * 1.7 + item.phase) * 0.035;
        } else if (item.type === "sway") {
          item.object.rotation.z = Math.sin(elapsed * 1.1 + item.phase) * 0.035;
        } else if (item.type === "float") {
          item.object.position.y = Math.sin(elapsed * 1.25 + item.phase) * 0.05;
        }
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    animate();

    // -------------------------------------------------------------------------
    // Custom camera controls: orbit and zoom
    // -------------------------------------------------------------------------

    const target = new THREE.Vector3(0, 0.2, -0.5);
    const spherical = new THREE.Spherical(15.8, Math.PI * 0.39, Math.PI * 0.29);
    const initialSpherical = spherical.clone();

    let dragging = false;
    let previousX = 0;
    let previousY = 0;

    renderer.domElement.addEventListener("pointerdown", event => {
      dragging = true;
      previousX = event.clientX;
      previousY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
      renderer.domElement.style.cursor = "grabbing";
    });

    renderer.domElement.addEventListener("pointermove", event => {
      if (!dragging) return;

      const deltaX = event.clientX - previousX;
      const deltaY = event.clientY - previousY;

      previousX = event.clientX;
      previousY = event.clientY;

      spherical.theta -= deltaX * 0.006;
      spherical.phi -= deltaY * 0.005;
      spherical.phi = THREE.MathUtils.clamp(spherical.phi, 0.18, Math.PI * 0.82);

      updateCamera();
    });

    function endDrag(event) {
      dragging = false;
      renderer.domElement.style.cursor = "grab";

      if (event && renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
    }

    renderer.domElement.addEventListener("pointerup", endDrag);
    renderer.domElement.addEventListener("pointercancel", endDrag);
    renderer.domElement.style.cursor = "grab";

    renderer.domElement.addEventListener("wheel", event => {
      event.preventDefault();
      spherical.radius = THREE.MathUtils.clamp(
        spherical.radius + event.deltaY * 0.012,
        11.5,
        22
      );
      updateCamera();
    }, { passive: false });

    function updateCamera() {
      camera.position.setFromSpherical(spherical).add(target);
      camera.lookAt(target);
    }

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Start with a slightly more front-facing angle.
    spherical.theta = Math.PI * 0.27;
    updateCamera();
  

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
    relic: { id: "generic", name: "Super Mario Bros. 3 Relic", x: -10.0, z: -12.0 },
    env:   { background: 0x101323, fogColor: 0x101323, fogDensity: 0.025 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 },
      east: { x: 12.0, z: 10.0 },
      west: { x: -12.0, z: -10.0 }
    }
  };
}

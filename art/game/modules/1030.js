// @world {"id": "1030", "title": "The Legend of Zelda: Ocarina of Time", "sub": "Kakariko Village", "system": "3D Render"}
// Converted from 1030-the_legend_of_zelda_ocarina_of_time_kakariko_village.html into a Back Roms World Walker module.

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
  // (strict modules throw where sloppy scripts did not): pan, roofDark, roofEdge, zoom
  let pan = 0;
  let roofDark = 0;
  let roofEdge = 0;
  let zoom = 0;

    

    // ------------------------------------------------------------
    // Renderer and scene
    // ------------------------------------------------------------
    renderer = dummyRenderer();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    

    // scene redirect
    scene.background = new THREE.Color(0xb9d8e8);
    scene.fog = new THREE.Fog(0xb9d8e8, 38, 88);

    camera = dummyCamera();

    // ------------------------------------------------------------
    // Direct camera controls: orbit, pan, zoom, touch
    // ------------------------------------------------------------
    const controls = {
      target: new THREE.Vector3(0, 3, 0),
      radius: 37,
      theta: Math.PI * 0.22,
      phi: Math.PI * 0.29,
      dragging: false,
      panning: false,
      lastX: 0,
      lastY: 0,
      pointerId: null
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

    function resetCamera() {
      controls.target.set(0, 3, 0);
      controls.radius = 37;
      controls.theta = Math.PI * 0.22;
      controls.phi = Math.PI * 0.29;
      updateCamera();
    }

    renderer.domElement.addEventListener("pointerdown", (event) => {
      controls.dragging = true;
      controls.panning = event.button === 2 || event.shiftKey;
      controls.lastX = event.clientX;
      controls.lastY = event.clientY;
      controls.pointerId = event.pointerId;
      renderer.domElement.setPointerCapture(event.pointerId);
    });

    renderer.domElement.addEventListener("pointermove", (event) => {
      if (!controls.dragging || event.pointerId !== controls.pointerId) return;

      const dx = event.clientX - controls.lastX;
      const dy = event.clientY - controls.lastY;
      controls.lastX = event.clientX;
      controls.lastY = event.clientY;

      if (controls.panning) {
        const right = new THREE.Vector3();
        const up = new THREE.Vector3();
        camera.matrixWorld.extractBasis(right, up, new THREE.Vector3());

        const scale = controls.radius * 0.0016;
        controls.target.addScaledVector(right, -dx * scale);
        controls.target.addScaledVector(up, dy * scale);
        controls.target.x = THREE.MathUtils.clamp(controls.target.x, -18, 18);
        controls.target.z = THREE.MathUtils.clamp(controls.target.z, -18, 18);
      } else {
        controls.theta -= dx * 0.006;
        controls.phi = THREE.MathUtils.clamp(
          controls.phi - dy * 0.005,
          0.18,
          Math.PI * 0.48
        );
      }

      updateCamera();
    });

    function endPointer(event) {
      if (event.pointerId !== controls.pointerId) return;
      controls.dragging = false;
      controls.panning = false;
      controls.pointerId = null;
    }

    renderer.domElement.addEventListener("pointerup", endPointer);
    renderer.domElement.addEventListener("pointercancel", endPointer);
    renderer.domElement.addEventListener("contextmenu", (event) => event.preventDefault());

    renderer.domElement.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        controls.radius = THREE.MathUtils.clamp(
          controls.radius * Math.exp(event.deltaY * 0.001),
          15,
          68
        );
        updateCamera();
      },
      { passive: false }
    );

    renderer.domElement.addEventListener("dblclick", resetCamera);
    updateCamera();

    // ------------------------------------------------------------
    // Materials
    // ------------------------------------------------------------
    const material = (color, roughness = 0.85) =>
      new THREE.MeshStandardMaterial({
        color,
        roughness,
        metalness: 0
      });

    const mats = {
      grass: material(0x78b95b),
      grassDark: material(0x568c48),
      grassLight: material(0x91c86b),
      grassEdge: material(0x3f8149),
      path: material(0xd8c79a),
      pathLight: material(0xead7a7),
      pathDark: material(0xbba978),
      wood: material(0x9c6538),
      woodLight: material(0xc18a50),
      woodDark: material(0x684329),
      roof: material(0x4b829f),
      roofDark: material(0x355e75),
      roofEdge: material(0x1f4960),
      cream: material(0xe7d7b0),
      black: material(0x263238),
      gold: material(0xd6a44f, 0.55),
      leaf: material(0x4f9b50),
      leafLight: material(0x70aa55),
      leafDark: material(0x31783f),
      flowerPink: material(0xd98591),
      flowerYellow: material(0xf2c45c),
      water: material(0x6bb8c5, 0.35),
      stone: material(0x78817b)
    };

    // ------------------------------------------------------------
    // Voxel helpers
    // ------------------------------------------------------------
    const voxel = (x, y, z, sx, sy, sz, mat, parent = scene) => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(sx, sy, sz),
        mat
      );
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    };

    function block(x, y, z, size = 1, mat = mats.grass) {
      return voxel(x, y, z, size, size, size, mat);
    }

    function building({
      x,
      z,
      width = 5,
      depth = 4,
      height = 3,
      color = mats.wood,
      roofColor = mats.roof,
      roofStyle = "gable"
    }) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      scene.add(group);

      // Main walls.
      voxel(0, 1.15, 0, width, 2.3, depth, color, group);
      voxel(0, 3.45, 0, width, 0.65, depth, color, group);

      // Stone base.
      voxel(0, 0.35, 0, width + 0.25, 0.7, depth + 0.25, mats.stone, group);

      // Roof: stepped gable using rows of blocks.
      if (roofStyle === "gable") {
        const half = Math.ceil(width / 2);

        for (let row = 0; row < 3; row++) {
          const inset = row;
          const y = 4.15 + row * 0.58;

          voxel(
            0,
            y,
            0,
            width - inset * 1.45,
            0.58,
            depth + 0.35,
            roofColor,
            group
          );

          voxel(
            0,
            y + 0.3,
            0,
            width - inset * 1.45,
            0.18,
            depth + 0.45,
            roofDark,
            group
          );
        }

        // Ridge cap.
        voxel(0, 5.85, 0, 0.55, 0.35, depth + 0.5, roofEdge, group);
      } else {
        // Flat/sloped tile roof.
        for (let row = 0; row < 4; row++) {
          voxel(
            0,
            4.05 + row * 0.48,
            0,
            width + 0.35,
            0.48,
            depth + 0.35,
            roofColor,
            group
          );
        }
      }

      // Front and side windows.
      const windowMat = mats.black;
      const frameMat = mats.woodLight;

      for (const side of [-1, 1]) {
        voxel(
          side * (width * 0.31),
          2.25,
          depth / 2 + 0.06,
          1.05,
          1.0,
          0.18,
          frameMat,
          group
        );
        voxel(
          side * (width * 0.31),
          2.25,
          depth / 2 + 0.17,
          0.82,
          0.78,
          0.12,
          windowMat,
          group
        );
      }

      // Door.
      voxel(
        0,
        1.65,
        depth / 2 + 0.13,
        1.15,
        2.3,
        0.25,
        mats.woodDark,
        group
      );
      voxel(
        0,
        1.7,
        depth / 2 + 0.27,
        0.68,
        0.85,
        0.12,
        mats.gold,
        group
      );

      // Chimney.
      voxel(
        width * 0.28,
        5.25,
        -depth * 0.18,
        0.65,
        2.1,
        0.65,
        mats.stone,
        group
      );
      voxel(
        width * 0.28,
        6.4,
        -depth * 0.18,
        0.85,
        0.3,
        0.85,
        roofDark,
        group
      );

      // Small sign above door.
      voxel(
        0,
        3.85,
        depth / 2 + 0.18,
        1.65,
        0.55,
        0.25,
        mats.woodDark,
        group
      );
      voxel(
        0,
        3.85,
        depth / 2 + 0.32,
        1.25,
        0.16,
        0.1,
        mats.gold,
        group
      );

      // Steps.
      voxel(0, 0.22, depth / 2 + 0.55, 2.1, 0.45, 0.8, mats.stone, group);
      voxel(0, 0.08, depth / 2 + 0.95, 2.6, 0.2, 1.0, mats.path, group);

      return group;
    }

    function tree(x, z, scale = 1, pink = false) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      group.scale.setScalar(scale);
      scene.add(group);

      // Root blocks.
      voxel(0, 0.25, 0, 1.35, 0.5, 1.35, mats.woodDark, group);
      voxel(0, 0.55, 0, 1.05, 0.5, 1.05, mats.wood, group);

      // Trunk.
      voxel(0, 1.35, 0, 0.42, 2.2, 0.42, mats.woodDark, group);
      voxel(0, 2.35, 0, 0.55, 0.65, 0.55, mats.wood, group);

      // Foliage, all made from cubic blocks.
      const leafMats = [mats.leaf, mats.leafLight, mats.leafDark];

      for (let i = 0; i < 14; i++) {
        const angle = (i / 14) * Math.PI * 2;
        const radius = 0.75 + (i % 3) * 0.2;
        const lx = Math.cos(angle) * radius;
        const lz = Math.sin(angle) * radius;
        const y = 2.85 + (i % 3) * 0.42;
        const mat = leafMats[i % leafMats.length];

        voxel(lx, y, lz, 0.9, 0.72, 0.9, mat, group);
      }

      voxel(0, 3.55, 0, 1.55, 0.85, 1.55, leafMats[1], group);
      voxel(0, 4.05, 0, 1.05, 0.7, 1.05, leafMats[0], group);

      if (pink) {
        for (let i = 0; i < 7; i++) {
          const angle = (i / 7) * Math.PI * 2;
          voxel(
            Math.cos(angle) * 0.58,
            3.75 + (i % 2) * 0.35,
            Math.sin(angle) * 0.58,
            0.48,
            0.48,
            0.48,
            mats.flowerPink,
            group
          );
        }
      }

      return group;
    }

    function planter(x, z, color = mats.flowerPink) {
      voxel(x, 0.35, z, 1.3, 0.7, 1.3, mats.stone);
      voxel(x, 0.78, z, 0.9, 0.4, 0.9, mats.woodDark);
      voxel(x, 1.12, z, 0.65, 0.35, 0.65, color);
    }

    function bench(x, z, rotation = 0) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      group.rotation.y = rotation;
      scene.add(group);

      voxel(0, 0.55, 0, 2.4, 0.45, 0.55, mats.wood, group);
      voxel(0, 1.05, 0, 2.4, 0.45, 0.55, mats.wood, group);
      voxel(-0.9, 0.25, 0, 0.35, 0.5, 0.55, mats.woodDark, group);
      voxel(0.9, 0.25, 0, 0.35, 0.5, 0.55, mats.woodDark, group);
      voxel(0, 1.3, 0, 2.6, 0.18, 0.65, mats.woodDark, group);
    }

    function lamp(x, z) {
      voxel(x, 0.45, z, 0.5, 0.9, 0.5, mats.stone);
      voxel(x, 1.35, z, 0.25, 0.55, 0.25, mats.gold);
      voxel(x, 1.7, z, 0.45, 0.3, 0.45, mats.flowerYellow);
    }

    function road(x1, z1, x2, z2, width = 2.3) {
      const dx = x2 - x1;
      const dz = z2 - z1;
      const length = Math.hypot(dx, dz);
      const angle = Math.atan2(dx, dz);
      const group = new THREE.Group();
      group.position.set((x1 + x2) / 2, 0, (z1 + z2) / 2);
      group.rotation.y = -angle;
      scene.add(group);

      const count = Math.ceil(length / 0.8);
      for (let i = 0; i < count; i++) {
        const t = i / (count - 1);
        const x = x1 + dx * t;
        const z = z1 + dz * t;
        const mat = i % 3 === 0 ? mats.path : mats.pathLight;
        voxel(x, 0.12, z, 0.8, 0.24, 0.8, mat, group);
      }

      // Sidewalk curbs.
      for (let i = 0; i < count; i++) {
        const t = i / (count - 1);
        const x = x1 + dx * t;
        const z = z1 + dz * t;
        voxel(x - 0.9, 0.16, z, 0.65, 0.3, 0.65, mats.pathDark, group);
        voxel(x + 0.9, 0.16, z, 0.65, 0.3, 0.65, mats.pathDark, group);
      }
    }

    // ------------------------------------------------------------
    // Village layout
    // ------------------------------------------------------------

    // Main plaza and roads.
    road(-14, -6, 14, -6, 2.5);
    road(-14, -6, -14, 12, 2.5);
    road(14, -6, 14, 12, 2.5);
    road(-14, 12, 14, 12, 2.5);
    road(-5, 12, 5, 12, 2.5);

    // Central fountain.
    const fountain = new THREE.Group();
    fountain.position.set(0, 0, -7.5);
    scene.add(fountain);

    voxel(0, 0.25, 0, 3.2, 0.5, 3.2, mats.stone, fountain);
    voxel(0, 0.75, 0, 2.1, 0.5, 2.1, mats.water, fountain);
    voxel(0, 1.25, 0, 0.85, 1.1, 0.85, mats.stone, fountain);
    voxel(0, 1.95, 0, 0.55, 0.85, 0.55, mats.gold, fountain);
    voxel(0, 2.45, 0, 0.9, 0.35, 0.9, mats.water, fountain);

    // Houses.
    building({
      x: -9,
      z: -3,
      width: 6,
      depth: 5,
      height: 3,
      color: mats.wood,
      roofColor: mats.roof
    });

    building({
      x: 9,
      z: -3,
      width: 6,
      depth: 5,
      height: 3,
      color: mats.woodLight,
      roofColor: mats.roofDark
    });

    building({
      x: 0,
      z: 8.3,
      width: 7,
      depth: 5.5,
      height: 3.5,
      color: mats.wood,
      roofColor: mats.roof,
      roofStyle: "flat"
    });

    building({
      x: -12.5,
      z: 8,
      width: 4.5,
      depth: 4,
      height: 2.7,
      color: mats.woodDark,
      roofColor: mats.roofDark
    });

    building({
      x: 12.5,
      z: 7.5,
      width: 4.5,
      depth: 4,
      height: 2.7,
      color: mats.wood,
      roofColor: mats.roof
    });

    // Background houses.
    building({
      x: -8,
      z: -12,
      width: 5,
      depth: 4,
      height: 3,
      color: mats.woodLight,
      roofColor: mats.roofDark
    });

    building({
      x: 8,
      z: -12,
      width: 5,
      depth: 4,
      height: 3,
      color: mats.wood,
      roofColor: mats.roof
    });

    // Gardens and hedges.
    function hedge(x, z, width = 8, depth = 2) {
      for (let i = 0; i < width; i++) {
        const px = x - width / 2 + i;
        voxel(px, 0.35, z, 0.85, 0.7, 1.3, mats.grassDark);
        voxel(px, 0.85, z, 0.7, 0.55, 1.0, mats.leaf);
        voxel(px, 1.15, z, 0.45, 0.3, 0.75, mats.leafLight);
      }
    }

    hedge(-9, 1, 7, 2);
    hedge(9, 1, 7, 2);
    hedge(-9, 10, 7, 2);
    hedge(9, 10, 7, 2);
    hedge(0, 15, 12, 2);

    // Flower beds.
    for (const x of [-13.5, 13.5]) {
      for (let i = 0; i < 3; i++) {
        voxel(x, 0.3, 12 + i * 1.6, 1.6, 0.6, 0.8, mats.pathDark);
        voxel(x, 0.65, 12 + i * 1.6, 1.25, 0.3, 0.55, mats.flowerPink);
      }
    }

    // Trees.
    tree(-14.5, -10, 1.15);
    tree(14.5, -10, 1.15);
    tree(-14.5, 14.5, 0.95);
    tree(14.5, 14.5, 0.95);
    tree(-4.5, -14.5, 0.9);
    tree(4.5, -14.5, 0.9);
    tree(-14.5, 2, 0.85, true);
    tree(14.5, 2, 0.85, true);

    // Benches and lamps.
    bench(-4.5, 5.8);
    bench(4.5, 5.8);
    bench(-7.8, -8.7, Math.PI / 2);
    bench(7.8, -8.7, Math.PI / 2);
    bench(0, 15, 0);
    lamp(-5.2, -8.2);
    lamp(5.2, -8.2);
    lamp(-5.2, 15.2);
    lamp(5.2, 15.2);

    // Decorative barrels.
    function barrel(x, z, color = mats.woodDark) {
      voxel(x, 0.4, z, 0.85, 0.8, 0.85, mats.wood, scene);
      voxel(x, 0.83, z, 0.9, 0.16, 0.9, color, scene);
      voxel(x, 1.25, z, 0.9, 0.16, 0.9, color, scene);
    }

    barrel(-13.7, 11.8, mats.woodDark);
    barrel(-12.2, 11.8, mats.woodDark);
    barrel(13.7, 11.8, mats.woodDark);
    barrel(12.2, 11.8, mats.woodDark);

    // Small foreground details.
    for (let i = 0; i < 5; i++) {
      planter(-7 + i * 1.6, 17.5, i % 2 ? mats.flowerPink : mats.flowerYellow);
    }

    // Pixel-style street signs.
    for (const x of [-4.2, 4.2]) {
      voxel(x, 0.45, 11.8, 0.35, 0.9, 0.35, mats.stone);
      voxel(x, 1.05, 11.8, 1.0, 0.65, 0.25, mats.woodDark);
      voxel(x, 1.05, 12.0, 0.7, 0.35, 0.1, mats.gold);
    }

    // Ground and decorative border.
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(65, 65),
      mats.grass
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    scene.add(ground);

    // Blocky border around the village.
    for (let x = -24; x <= 24; x += 1) {
      voxel(x, 0.15, -21, 0.9, 0.3, 0.9, mats.grassEdge);
      voxel(x, 0.15, 21, 0.9, 0.3, 0.9, mats.grassEdge);
    }
    for (let z = -21; z <= 21; z += 1) {
      voxel(-24, 0.15, z, 0.9, 0.3, 0.9, mats.grassEdge);
      voxel(24, 0.15, z, 0.9, 0.3, 0.9, mats.grassEdge);
    }

    // Tiny clouds in the sky.
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xf3f6ef,
      roughness: 1
    });

    function cloud(x, y, z, scale) {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      group.scale.setScalar(scale);
      scene.add(group);

      voxel(0, 0, 0, 2.2, 0.8, 1.1, cloudMat, group);
      voxel(-1.1, 0, 0, 1.2, 0.8, 1.0, cloudMat, group);
      voxel(1.1, 0, 0, 1.2, 0.8, 1.0, cloudMat, group);
      voxel(0, 0.55, 0, 1.5, 0.55, 0.9, cloudMat, group);
    }

    cloud(-18, 13, -20, 1.4);
    cloud(17, 15, -22, 1.2);
    cloud(22, 12, 12, 1.0);

    // ------------------------------------------------------------
    // Lighting
    // ------------------------------------------------------------
    const hemisphere = new THREE.HemisphereLight(0xdff4ff, 0x6c8752, 2.0);
    scene.add(hemisphere);

    const sun = new THREE.DirectionalLight(0xfff0cf, 3.0);
    sun.position.set(-18, 28, 16);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -30;
    sun.shadow.camera.right = 30;
    sun.shadow.camera.top = 30;
    sun.shadow.camera.bottom = -30;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 75;
    sun.shadow.bias = -0.0004;
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0x8bc9e8, 0.75);
    fill.position.set(18, 12, -20);
    scene.add(fill);

    // ------------------------------------------------------------
    // Animation and resize
    // ------------------------------------------------------------
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle water shimmer.
      mats.water.color.offsetHSL(0, 0, Math.sin(elapsed * 0.7) * 0.025);

      renderer.render(scene, camera);
    }

    animate();

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
    relic: { id: "generic", name: "The Legend of Zelda: Ocarina of Time Relic", x: -10.0, z: -12.0 },
    env:   { background: 0xb9d8e8, fogColor: 0xb9d8e8, fogDensity: 0.025 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 },
      east: { x: 12.0, z: 10.0 },
      west: { x: -12.0, z: -10.0 }
    }
  };
}

// @world {"id": "1043", "title": "Castlevania", "sub": "Dracula's Castle", "system": "3D Render"}
// Converted from 1043-castlevania_draculax27s_castle.html into a Back Roms World Walker module.

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

    

    // -------------------------------------------------------------------------
    // Renderer and scene
    // -------------------------------------------------------------------------

    container = dummyEl();

    renderer = dummyRenderer();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // scene redirect
    scene.background = new THREE.Color(0x110b27);
    scene.fog = new THREE.FogExp2(0x110b27, 0.018);

    camera = dummyCamera();

    // -------------------------------------------------------------------------
    // Direct camera controls: orbit, pan-free rotation, and wheel zoom
    // -------------------------------------------------------------------------

    const cameraState = {
      target: new THREE.Vector3(0, 5, 0),
      azimuth: Math.PI * 0.24,
      polar: Math.PI * 0.34,
      radius: 34
    };

    const initialCamera = {
      target: cameraState.target.clone(),
      azimuth: cameraState.azimuth,
      polar: cameraState.polar,
      radius: cameraState.radius
    };

    function updateCamera() {
      const sinPolar = Math.sin(cameraState.polar);

      camera.position.set(
        cameraState.target.x + cameraState.radius * sinPolar * Math.sin(cameraState.azimuth),
        cameraState.target.y + cameraState.radius * Math.cos(cameraState.polar),
        cameraState.target.z + cameraState.radius * sinPolar * Math.cos(cameraState.azimuth)
      );

      camera.lookAt(cameraState.target);
    }

    let dragging = false;
    let previousX = 0;
    let previousY = 0;

    renderer.domElement.addEventListener("pointerdown", (event) => {
      dragging = true;
      previousX = event.clientX;
      previousY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
    });

    renderer.domElement.addEventListener("pointermove", (event) => {
      if (!dragging) return;

      const deltaX = event.clientX - previousX;
      const deltaY = event.clientY - previousY;

      previousX = event.clientX;
      previousY = event.clientY;

      cameraState.azimuth -= deltaX * 0.006;
      cameraState.polar = THREE.MathUtils.clamp(
        cameraState.polar - deltaY * 0.005,
        0.18,
        Math.PI * 0.49
      );

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

    renderer.domElement.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        cameraState.radius = THREE.MathUtils.clamp(
          cameraState.radius + event.deltaY * 0.025,
          18,
          62
        );
        updateCamera();
      },
      { passive: false }
    );

    updateCamera();

    // -------------------------------------------------------------------------
    // Materials
    // -------------------------------------------------------------------------

    const materials = {
      cliff: new THREE.MeshStandardMaterial({
        color: 0x6e4238,
        roughness: 0.96,
        flatShading: true
      }),
      cliffLight: new THREE.MeshStandardMaterial({
        color: 0x98614c,
        roughness: 0.95,
        flatShading: true
      }),
      cliffDark: new THREE.MeshStandardMaterial({
        color: 0x492d2b,
        roughness: 1,
        flatShading: true
      }),
      grass: new THREE.MeshStandardMaterial({
        color: 0x526d43,
        roughness: 1,
        flatShading: true
      }),
      grassLight: new THREE.MeshStandardMaterial({
        color: 0x71845a,
        roughness: 1,
        flatShading: true
      }),
      trunk: new THREE.MeshStandardMaterial({
        color: 0x5c3827,
        roughness: 1,
        flatShading: true
      }),
      foliage: new THREE.MeshStandardMaterial({
        color: 0x244c3a,
        roughness: 1,
        flatShading: true
      }),
      foliageLight: new THREE.MeshStandardMaterial({
        color: 0x39694c,
        roughness: 1,
        flatShading: true
      }),
      stone: new THREE.MeshStandardMaterial({
        color: 0x827b78,
        roughness: 0.9,
        flatShading: true
      }),
      stoneLight: new THREE.MeshStandardMaterial({
        color: 0xa6a098,
        roughness: 0.86,
        flatShading: true
      }),
      stoneDark: new THREE.MeshStandardMaterial({
        color: 0x555758,
        roughness: 0.95,
        flatShading: true
      }),
      roof: new THREE.MeshStandardMaterial({
        color: 0x415e70,
        roughness: 0.85,
        flatShading: true
      }),
      roofLight: new THREE.MeshStandardMaterial({
        color: 0x607d90,
        roughness: 0.8,
        flatShading: true
      }),
      gold: new THREE.MeshStandardMaterial({
        color: 0xd6a857,
        roughness: 0.55,
        metalness: 0.25,
        flatShading: true
      }),
      window: new THREE.MeshStandardMaterial({
        color: 0xffc76b,
        emissive: 0xff8a2f,
        emissiveIntensity: 1.6,
        roughness: 0.5
      }),
      water: new THREE.MeshStandardMaterial({
        color: 0x287f9b,
        roughness: 0.25,
        metalness: 0.15,
        flatShading: true
      }),
      waterLight: new THREE.MeshStandardMaterial({
        color: 0x4aa4b5,
        roughness: 0.22,
        metalness: 0.12,
        flatShading: true
      }),
      curtain: new THREE.MeshStandardMaterial({
        color: 0x8e623f,
        roughness: 1,
        flatShading: true
      })
    };

    // -------------------------------------------------------------------------
    // Voxel helpers
    // -------------------------------------------------------------------------

    const island = new THREE.Group();
    scene.add(island);

    function voxelBox(parent, x, y, z, sx, sy, sz, material, castShadow = true) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(sx, sy, sz),
        material
      );
      mesh.position.set(x, y, z);
      mesh.castShadow = castShadow;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    }

    function solidColumn(parent, x, y, z, width, height, depth, material) {
      return voxelBox(parent, x, y, z, width, height, depth, material);
    }

    function addTree(parent, x, y, z, scale = 1, light = false) {
      const tree = new THREE.Group();
      tree.position.set(x, y, z);
      tree.scale.setScalar(scale);

      solidColumn(tree, 0, 0.55, 0, 0.34, 1.1, 0.34, materials.trunk);

      const crown = voxelBox(
        tree,
        0,
        1.55,
        0,
        1.15,
        0.9,
        1.15,
        light ? materials.foliageLight : materials.foliage
      );

      voxelBox(
        tree,
        0,
        2.05,
        0,
        0.78,
        0.72,
        0.78,
        light ? materials.foliageLight : materials.foliage
      );

      parent.add(tree);
      return tree;
    }

    function addHouse(parent, x, y, z, scale = 1, roofColor = materials.roof) {
      const house = new THREE.Group();
      house.position.set(x, y, z);
      house.scale.setScalar(scale);

      solidColumn(house, 0, 0.65, 0, 1.65, 1.3, 1.65, materials.stoneLight);

      const roof = voxelBox(
        house,
        0,
        1.65,
        0,
        2.1,
        0.38,
        2.1,
        roofColor
      );
      roof.rotation.y = Math.PI / 4;

      voxelBox(house, 0, 1.42, 0.84, 1.1, 0.72, 0.16, materials.stoneDark);
      voxelBox(house, 0, 1.42, 0.96, 0.28, 0.48, 0.12, materials.window);
      voxelBox(house, -0.78, 0.9, 0, 0.16, 0.8, 0.16, materials.stoneDark);
      voxelBox(house, 0.78, 0.9, 0, 0.16, 0.8, 0.16, materials.stoneDark);

      parent.add(house);
      return house;
    }

    function addTower(parent, x, y, z, width = 1.6, height = 5, roof = false) {
      const tower = new THREE.Group();
      tower.position.set(x, y, z);

      solidColumn(tower, 0, height / 2, 0, width, height, width, materials.stone);

      const cap = voxelBox(
        tower,
        0,
        height + 0.18,
        0,
        width + 0.35,
        0.36,
        width + 0.35,
        materials.stoneLight
      );
      cap.rotation.y = Math.PI / 4;

      if (roof) {
        const cone = voxelBox(
          tower,
          0,
          height + 0.72,
          0,
          width + 0.65,
          0.55,
          width + 0.65,
          materials.roof
        );
        cone.rotation.y = Math.PI / 4;

        solidColumn(tower, 0, height + 1.08, 0, 0.22, 0.65, 0.22, materials.gold);
      }

      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const windowX = Math.cos(angle) * (width / 2 + 0.08);
        const windowZ = Math.sin(angle) * (width / 2 + 0.08);

        voxelBox(
          tower,
          windowX,
          height * 0.48,
          windowZ,
          0.22,
          0.48,
          0.12,
          materials.window
        );
      }

      parent.add(tower);
      return tower;
    }

    function addBanners(parent, x, y, z, color = materials.curtain) {
      const banner = voxelBox(
        parent,
        x,
        y,
        z,
        0.18,
        2.1,
        0.18,
        color
      );
      banner.rotation.z = -0.16;
      return banner;
    }

    // -------------------------------------------------------------------------
    // Island terrain
    // -------------------------------------------------------------------------

    const islandWidth = 22;
    const islandDepth = 19;
    const terrain = new THREE.Group();

    // Main irregular island shape.
    for (let x = -11; x <= 11; x++) {
      for (let z = -9; z <= 9; z++) {
        const edge = Math.max(
          Math.abs(x) / 11,
          Math.abs(z) / 9
        );

        const rounded =
          Math.pow(Math.max(0, 1 - edge * edge), 0.72);

        const height = 1.8 + rounded * 5.8;

        voxelBox(
          terrain,
          x,
          height * 0.5,
          z,
          1.25,
          1.25,
          1.25,
          materials.cliffDark
        );

        voxelBox(
          terrain,
          x,
          height,
          z,
          1.05,
          0.45,
          1.05,
          materials.cliff
        );

        const grassChance = Math.random();
        if (grassChance > 0.58) {
          voxelBox(
            terrain,
            x + 0.12,
            height + 0.2,
            z + 0.12,
            0.8,
            0.2,
            0.8,
            Math.random() > 0.5 ? materials.grass : materials.grassLight
          );
        }
      }
    }

    // Front cliff and waterfall.
    for (let x = -7; x <= 7; x += 1) {
      for (let z = 8; z <= 10; z += 1) {
        const h = 2.2 + Math.random() * 2.4;

        voxelBox(
          terrain,
          x,
          h * 0.5,
          z,
          1.1,
          h,
          1.1,
          materials.cliff
        );

        voxelBox(
          terrain,
          x,
          h + 0.15,
          z,
          1.0,
          0.3,
          1.0,
          materials.cliffLight
        );
      }
    }

    // River winding around the island.
    const riverSegments = [
      [-10, 3.6],
      [-9, 2.4],
      [-7, 1.2],
      [-5, 0.1],
      [-2, 0.6],
      [1, -0.5],
      [4, -1.2],
      [7, -0.1],
      [9, 1.1],
      [10, 2.5],
      [8, 3.7]
    ];

    for (const [x, z] of riverSegments) {
      voxelBox(
        terrain,
        x,
        0.28,
        z,
        1.15,
        0.55,
        1.15,
        materials.water
      );
      voxelBox(
        terrain,
        x,
        0.58,
        z,
        0.82,
        0.16,
        0.82,
        materials.waterLight
      );
    }

    // -------------------------------------------------------------------------
    // Castle
    // -------------------------------------------------------------------------

    const castle = new THREE.Group();
    castle.position.y = 3.2;
    island.add(castle);

    // Main palace.
    solidColumn(castle, 0, 1.4, 0, 8.8, 2.8, 7.2, materials.stone);

    const palaceRoof = voxelBox(
      castle,
      0,
      3.15,
      0,
      9.7,
      0.7,
      8.1,
      materials.roof
    );
    palaceRoof.rotation.y = Math.PI / 4;

    // Central tall spire.
    addTower(castle, 0, 2.8, 0, 3.0, 7.2, true);

    // Side towers.
    addTower(castle, -5.8, 1.2, 1.2, 2.1, 5.8, false);
    addTower(castle, 5.8, 1.2, 1.2, 2.1, 5.8, false);
    addTower(castle, -5.8, 1.2, -1.2, 1.8, 4.7, false);
    addTower(castle, 5.8, 1.2, -1.2, 1.8, 4.7, false);

    // Upper palace structures.
    for (const x of [-3.1, 0, 3.1]) {
      solidColumn(castle, x, 4.0, -0.4, 2.2, 2.4, 2.4, materials.stoneLight);

      const roof = voxelBox(
        castle,
        x,
        5.45,
        -0.4,
        2.8,
        0.55,
        3.0,
        materials.roofLight
      );
      roof.rotation.y = Math.PI / 4;
    }

    // Bridges and gatehouse.
    solidColumn(castle, -5.1, 1.1, 0, 2.2, 2.2, 2.2, materials.stone);
    solidColumn(castle, 5.1, 1.1, 0, 2.2, 2.2, 2.2, materials.stone);

    const gate = voxelBox(
      castle,
      0,
      1.45,
      3.55,
      3.3,
      2.8,
      1.6,
      materials.stoneLight
    );

    const gateRoof = voxelBox(
      castle,
      0,
      3.05,
      3.55,
      4.0,
      0.55,
      2.2,
      materials.roof
    );
    gateRoof.rotation.y = Math.PI / 4;

    // Banners.
    addBanners(castle, -4.7, 2.0, 3.75);
    addBanners(castle, 4.7, 2.0, 3.75);

    // Windows and warm lights.
    for (const x of [-3.6, -1.2, 1.2, 3.6]) {
      voxelBox(castle, x, 2.25, 3.65, 0.42, 0.72, 0.16, materials.window);
    }

    for (const x of [-4.2, 4.2]) {
      voxelBox(castle, x, 1.4, 3.65, 0.45, 1.1, 0.16, materials.window);
    }

    // Hanging lanterns.
    for (const x of [-2.6, 0, 2.6]) {
      solidColumn(castle, x, 3.25, 0, 0.12, 0.7, 0.12, materials.gold);
      voxelBox(castle, x, 3.65, 0, 0.45, 0.24, 0.45, materials.gold);
    }

    // Exterior walkway.
    for (let z = 4; z <= 8; z += 1) {
      voxelBox(castle, 0, 1.45, z, 7.5, 0.55, 0.9, materials.stoneLight);
    }

    // -------------------------------------------------------------------------
    // Village
    // -------------------------------------------------------------------------

    const village = new THREE.Group();
    village.position.set(-4.5, 1.2, -3.5);

    addHouse(village, 0, 0, 0, 1.15, materials.roof);
    addHouse(village, 2.4, 0, -0.8, 0.85, materials.roofLight);
    addHouse(village, -2.5, 0, 1.0, 0.8, materials.roof);

    addHouse(village, 1.4, 0, 2.2, 0.6, materials.roofLight);
    addHouse(village, -1.5, 0, 2.2, 0.6, materials.roof);

    addBanners(village, 0, 1.75, 0.55, materials.curtain);
    addBanners(village, 2.4, 1.35, -1.65, materials.curtain);

    island.add(village);

    // -------------------------------------------------------------------------
    // Forest
    // -------------------------------------------------------------------------

    const forest = new THREE.Group();
    forest.position.set(3.2, 1.1, -3.3);

    const treePositions = [
      [-4, 0, -2, 1.0],
      [-2.7, 0, 1.2, 0.85],
      [-1.2, 0, -1.6, 1.1],
      [1.2, 0, -2.2, 0.9],
      [2.7, 0, -1.3, 1.15],
      [4.0, 0, -2.8, 0.85],
      [-4.5, 0, 1.8, 0.9],
      [-3.0, 0, 2.4, 1.1],
      [-1.4, 0, 2.5, 0.8],
      [1.0, 0, 2.4, 0.9],
      [2.8, 0, 2.8, 1.0],
      [4.4, 0, 1.7, 0.85]
    ];

    treePositions.forEach((tree, index) => {
      addTree(forest, tree[0], 0, tree[1], tree[2], index % 3 === 0);
    });

    island.add(forest);

    // -------------------------------------------------------------------------
    // Waterfall and lower pool
    // -------------------------------------------------------------------------

    const waterfall = new THREE.Group();
    waterfall.position.set(0, 0.1, 10.2);

    for (let i = 0; i < 5; i++) {
      const drop = voxelBox(
        waterfall,
        (i - 2) * 0.22,
        0.7 + i * 0.35,
        0,
        0.55,
        0.3,
        0.35,
        i % 2 === 0 ? materials.waterLight : materials.water
      );
      drop.rotation.z = (i - 2) * 0.035;
    }

    voxelBox(
      waterfall,
      0,
      0.18,
      0.55,
      3.2,
      0.35,
      1.8,
      materials.water
    );

    island.add(waterfall);

    // Small foreground pool.
    voxelBox(
      island,
      0,
      0.35,
      12.2,
      7.5,
      0.5,
      2.4,
      materials.water
    );

    // -------------------------------------------------------------------------
    // Clouds
    // -------------------------------------------------------------------------

    const cloudMaterial = new THREE.MeshStandardMaterial({
      color: 0x9c83b5,
      roughness: 1,
      flatShading: true
    });

    const clouds = [];

    function addCloud(x, y, z, scale) {
      const cloud = new THREE.Group();
      cloud.position.set(x, y, z);
      cloud.scale.setScalar(scale);

      for (let i = 0; i < 5; i++) {
        const puff = voxelBox(
          cloud,
          (i - 2) * 1.15,
          Math.sin(i * 1.7) * 0.45,
          Math.cos(i * 2.1) * 0.4,
          1.6,
          0.75,
          1.15,
          cloudMaterial
        );
        puff.rotation.y = i * 0.3;
      }

      scene.add(cloud);
      clouds.push(cloud);
    }

    addCloud(-12, 13, -10, 2.2);
    addCloud(11, 15, -8, 2.6);
    addCloud(8, 10, 10, 1.6);
    addCloud(-9, 9, 12, 1.3);

    // -------------------------------------------------------------------------
    // Lighting
    // -------------------------------------------------------------------------

    const hemisphere = new THREE.HemisphereLight(
      0x8ea9ff,
      0x352018,
      1.45
    );
    scene.add(hemisphere);

    const sun = new THREE.DirectionalLight(0xffe2b0, 3.2);
    sun.position.set(12, 22, 14);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -24;
    sun.shadow.camera.right = 24;
    sun.shadow.camera.top = 24;
    sun.shadow.camera.bottom = -24;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 65;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.025;
    scene.add(sun);

    const rimLight = new THREE.DirectionalLight(0x728dff, 1.8);
    rimLight.position.set(-15, 10, -18);
    scene.add(rimLight);

    const warmFill = new THREE.PointLight(0xff9a4b, 22, 28, 2);
    warmFill.position.set(0, 5, 4);
    scene.add(warmFill);

    // -------------------------------------------------------------------------
    // Subtle animated water glints
    // -------------------------------------------------------------------------

    const waterGlints = [];

    function addWaterGlint(x, y, z, size = 0.8) {
      const material = new THREE.MeshBasicMaterial({
        color: 0xb9edf2,
        transparent: true,
        opacity: 0.55,
        depthWrite: false
      });

      const glint = voxelBox(
        scene,
        x,
        y,
        z,
        size,
        0.08,
        size,
        material,
        false
      );

      waterGlints.push({
        mesh: glint,
        baseY: y,
        phase: Math.random() * Math.PI * 2
      });
    }

    riverSegments.forEach(([x, z]) => {
      addWaterGlint(x, 0.69, z, 0.55);
      addWaterGlint(x + 0.45, 0.69, z + 0.25, 0.35);
    });

    // -------------------------------------------------------------------------
    // Resize and render loop
    // -------------------------------------------------------------------------

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const clock = new THREE.Clock();

    function animate() {
      const elapsed = clock.getElapsedTime();

      waterGlints.forEach((glint) => {
        glint.mesh.position.y =
          glint.baseY + Math.sin(elapsed * 1.4 + glint.phase) * 0.035;
      });

      clouds.forEach((cloud, index) => {
        cloud.position.x += Math.sin(elapsed * 0.08 + index) * 0.0008;
      });

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
    spawn: { x: 0.0, z: 14.0, yaw: 0 },
    relic: { id: "generic", name: "Castlevania Relic", x: -10.0, z: -12.0 },
    env:   { background: 0x110b27, fogColor: 0x110b27, fogDensity: 0.018 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 },
      east: { x: 12.0, z: 10.0 },
      west: { x: -12.0, z: -10.0 }
    }
  };
}

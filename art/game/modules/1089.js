// @world {"id": "1089", "title": "Halo: Reach", "sub": "Condemned \u2014 Gamma Station", "system": "3D Render"}
// Converted from 1089-halo_reach_condemned_gamma_station.html into a Back Roms World Walker module.

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
    scene.background = new THREE.Color(0x17212a);
    scene.fog = new THREE.FogExp2(0x17212a, 0.018);

    camera = dummyCamera();

    renderer = dummyRenderer();
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    dummyEl().appendChild(renderer.domElement);

    // ------------------------------------------------------------
    // Materials
    // ------------------------------------------------------------

    const mat = {
      hull: new THREE.MeshStandardMaterial({
        color: 0x68767e,
        roughness: 0.72,
        metalness: 0.58
      }),
      darkHull: new THREE.MeshStandardMaterial({
        color: 0x27323a,
        roughness: 0.68,
        metalness: 0.65
      }),
      black: new THREE.MeshStandardMaterial({
        color: 0x11191f,
        roughness: 0.55,
        metalness: 0.7
      }),
      steel: new THREE.MeshStandardMaterial({
        color: 0xa6b1b6,
        roughness: 0.48,
        metalness: 0.78
      }),
      pale: new THREE.MeshStandardMaterial({
        color: 0xb8c2c4,
        roughness: 0.58,
        metalness: 0.45
      }),
      yellow: new THREE.MeshStandardMaterial({
        color: 0xd7a72b,
        roughness: 0.55,
        metalness: 0.45
      }),
      orange: new THREE.MeshStandardMaterial({
        color: 0xc76725,
        roughness: 0.6,
        metalness: 0.4
      }),
      blue: new THREE.MeshStandardMaterial({
        color: 0x367a91,
        roughness: 0.38,
        metalness: 0.62
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: 0x78b5ca,
        roughness: 0.12,
        metalness: 0.08,
        transmission: 0.38,
        transparent: true,
        opacity: 0.72,
        thickness: 0.25,
        ior: 1.45
      }),
      floor: new THREE.MeshStandardMaterial({
        color: 0x434d52,
        roughness: 0.8,
        metalness: 0.4
      }),
      floorDark: new THREE.MeshStandardMaterial({
        color: 0x293137,
        roughness: 0.86,
        metalness: 0.35
      }),
      white: new THREE.MeshStandardMaterial({
        color: 0xd6dde0,
        roughness: 0.62,
        metalness: 0.25
      })
    };

    const voxel = (w, h, d, material, x = 0, y = 0, z = 0) => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        material
      );
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      return mesh;
    };

    // ------------------------------------------------------------
    // Main corridor dimensions
    // ------------------------------------------------------------

    const corridor = {
      length: 25,
      width: 7.4,
      height: 6.2,
      centerX: 0,
      centerZ: 0,
      side: 3.7
    };

    // Floor: central walkway and side service strips.
    voxel(
      corridor.length,
      0.42,
      1.55,
      mat.floor,
      0,
      -0.22,
      0
    );

    // Darker floor panels.
    for (let z = 1.9; z < corridor.length; z += 1.9) {
      voxel(
        corridor.length - 0.4,
        0.08,
        1.45,
        mat.floorDark,
        0,
        0.02,
        z
      );
    }

    // Side floor strips.
    for (const side of [-1, 1]) {
      voxel(
        corridor.length,
        0.34,
        1.05,
        mat.floorDark,
        0,
        -0.2,
        side * 2.85
      );
    }

    // Diamond plate effect: repeated small raised plates.
    const plateGeometry = new THREE.BoxGeometry(0.48, 0.035, 0.48);
    for (let z = 0.6; z < corridor.length - 0.3; z += 0.62) {
      for (let x = -3.15; x <= 3.15; x += 0.62) {
        const rotated = new THREE.Mesh(plateGeometry, mat.floor);
        rotated.rotation.y = Math.PI / 4;
        rotated.position.set(x, 0.065, z);
        rotated.scale.setScalar(0.88);
        rotated.receiveShadow = true;
        scene.add(rotated);
      }
    }

    // Yellow safety lines.
    for (const side of [-1, 1]) {
      voxel(
        corridor.length - 0.4,
        0.035,
        0.075,
        mat.yellow,
        0,
        0.095,
        side * 0.78
      );
    }

    // Floor drain / service channels.
    for (let z = 1.1; z < corridor.length - 0.5; z += 0.48) {
      voxel(
        0.16,
        0.035,
        0.32,
        mat.black,
        0,
        0.08,
        z
      );
    }

    // ------------------------------------------------------------
    // Ceiling
    // ------------------------------------------------------------

    voxel(
      corridor.length,
      0.35,
      corridor.width + 0.5,
      mat.darkHull,
      0,
      corridor.height + 0.15,
      0
    );

    // Ceiling ribs.
    for (let z = -1.4; z <= corridor.length + 1.4; z += 1.45) {
      voxel(
        corridor.width + 0.4,
        0.22,
        0.22,
        mat.hull,
        0,
        corridor.height + 0.38,
        z
      );
    }

    // Long overhead beams.
    for (const side of [-1, 1]) {
      voxel(
        corridor.length,
        0.26,
        0.28,
        mat.steel,
        0,
        corridor.height + 0.1,
        side * 2.95
      );
    }

    // Ceiling pipes / conduits.
    for (let z = -1.5; z < corridor.length; z += 2.3) {
      voxel(
        0.18,
        0.34,
        0.95,
        mat.blue,
        -1.7,
        corridor.height + 0.35,
        z
      );
      voxel(
        0.18,
        0.34,
        0.95,
        mat.yellow,
        1.7,
        corridor.height + 0.35,
        z + 0.4
      );
    }

    // Long fluorescent lights.
    for (let z = -1.2; z < corridor.length; z += 3.2) {
      voxel(
        2.1,
        0.12,
        0.32,
        mat.white,
        0,
        corridor.height + 0.7,
        z
      );
      voxel(
        2.15,
        0.05,
        0.36,
        mat.black,
        0,
        corridor.height + 0.8,
        z
      );
    }

    // ------------------------------------------------------------
    // Left wall and service bays
    // ------------------------------------------------------------

    voxel(
      corridor.length,
      corridor.height,
      0.35,
      mat.hull,
      0,
      corridor.height / 2,
      -corridor.side
    );

    // Wall ribs.
    for (let z = -1.4; z < corridor.length; z += 1.45) {
      voxel(
        corridor.width,
        0.18,
        0.22,
        mat.darkHull,
        0,
        3.95,
        -corridor.side
      );
    }

    // Vertical wall panels.
    for (let z = -0.8; z < corridor.length; z += 1.4) {
      voxel(
        0.18,
        5.1,
        0.78,
        mat.darkHull,
        -3.35,
        2.55,
        z
      );
    }

    // Door frames and doors.
    for (let z = -0.45; z < corridor.length - 0.4; z += 2.25) {
      voxel(
        0.18,
        3.65,
        0.18,
        mat.steel,
        -3.5,
        1.82,
        z
      );
      voxel(
        0.18,
        3.65,
        0.18,
        mat.steel,
        -3.5,
        1.82,
        z + 1.8
      );
      voxel(
        0.18,
        3.65,
        0.18,
        mat.steel,
        -3.5,
        1.82,
        z + 0.9
      );
      voxel(
        0.12,
        3.15,
        1.5,
        mat.darkHull,
        -3.6,
        1.65,
        z + 0.9
      );
      voxel(
        0.14,
        0.36,
        0.08,
        mat.yellow,
        -3.46,
        1.05,
        z + 1.68
      );
      voxel(
        0.1,
        0.16,
        0.06,
        mat.steel,
        -3.34,
        1.8,
        z + 1.7
      );
    }

    // Wall utility cabinets.
    for (let z = 0.2; z < corridor.length - 0.6; z += 2.1) {
      voxel(
        0.85,
        1.55,
        0.7,
        mat.hull,
        -3.0,
        0.85,
        z
      );
      voxel(
        0.68,
        1.36,
        0.08,
        mat.darkHull,
        -3.0,
        0.86,
        z + 0.39
      );
      voxel(
        0.22,
        0.12,
        0.08,
        mat.yellow,
        -2.75,
        1.25,
        z + 0.47
      );
      voxel(
        0.3,
        0.18,
        0.08,
        mat.black,
        -2.5,
        0.72,
        z + 0.47
      );
    }

    // Yellow-black hazard corner.
    const hazardMat = new THREE.MeshStandardMaterial({
      color: 0x4b350b,
      roughness: 0.65,
      metalness: 0.35
    });

    for (let y = 0.25; y < 3.4; y += 0.5) {
      voxel(
        0.32,
        0.24,
        0.48,
        y % 0.5 < 0.25 ? mat.yellow : hazardMat,
        -3.48,
        y,
        -3.35
      );
    }

    // ------------------------------------------------------------
    // Right window wall
    // ------------------------------------------------------------

    // Outer frame.
    for (let z = -2.2; z < corridor.length + 0.2; z += 1.65) {
      voxel(
        0.32,
        corridor.height,
        0.34,
        mat.darkHull,
        corridor.side,
        corridor.height / 2,
        z
      );
      voxel(
        0.2,
        corridor.height,
        0.2,
        mat.steel,
        corridor.side + 0.18,
        corridor.height / 2,
        z + 0.82
      );
      voxel(
        0.2,
        corridor.height,
        0.2,
        mat.steel,
        corridor.side + 0.18,
        corridor.height / 2,
        z - 0.82
      );
    }

    // Window panes.
    for (let z = -1.95; z < corridor.length - 0.15; z += 1.65) {
      voxel(
        2.35,
        3.35,
        0.12,
        mat.glass,
        corridor.side,
        2.35,
        z
      );
    }

    // Window mullions.
    for (let z = -2.2; z < corridor.length + 0.2; z += 1.65) {
      voxel(
        0.16,
        3.5,
        0.22,
        mat.steel,
        corridor.side + 0.17,
        2.35,
        z
      );
    }

    // Window sill and lower console.
    for (let z = -2.4; z < corridor.length + 0.2; z += 1.65) {
      voxel(
        2.7,
        0.22,
        0.55,
        mat.hull,
        corridor.side,
        1.35,
        z
      );

      voxel(
        1.7,
        0.75,
        0.8,
        mat.darkHull,
        corridor.side - 0.1,
        0.78,
        z + 0.65
      );

      voxel(
        0.85,
        0.12,
        0.55,
        mat.black,
        corridor.side - 0.1,
        1.22,
        z + 0.65
      );

      // Small status lights.
      for (let i = 0; i < 3; i++) {
        voxel(
          0.1,
          0.08,
          0.05,
          i === 0 ? mat.yellow : mat.blue,
          corridor.side - 0.7,
          1.3,
          z + 0.4 + i * 0.2
        );
      }
    }

    // Exterior city visible through windows.
    const cityMaterials = [
      new THREE.MeshStandardMaterial({ color: 0x263744, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color: 0x354652, roughness: 0.85 }),
      new THREE.MeshStandardMaterial({ color: 0x465967, roughness: 0.8 }),
      new THREE.MeshStandardMaterial({ color: 0x1c2831, roughness: 0.9 })
    ];

    function cityBlock(x, y, z, w, h, d, materialIndex) {
      voxel(
        w,
        h,
        d,
        cityMaterials[materialIndex % cityMaterials.length],
        x,
        y,
        z
      );
    }

    // Distant structures.
    cityBlock(-11, 1.2, -12, 4, 7, 4, 0);
    cityBlock(-5, 0.5, -17, 3, 5, 3, 1);
    cityBlock(3, 1.4, -14, 5, 8, 4, 2);
    cityBlock(10, 0.8, -18, 3, 6, 3, 0);
    cityBlock(-13, 0.4, -24, 4, 4, 3, 1);
    cityBlock(14, 0.4, -25, 5, 5, 4, 2);
    cityBlock(-2, 0.3, -30, 6, 3, 4, 0);

    // Blue sky / atmospheric background.
    voxel(
      80,
      35,
      80,
      new THREE.MeshStandardMaterial({
        color: 0x315c70,
        roughness: 1
      }),
      0,
      12,
      -35
    );

    // High windows / distant structures.
    voxel(
      80,
      0.4,
      80,
      new THREE.MeshStandardMaterial({
        color: 0x183342,
        roughness: 0.95
      }),
      0,
      30,
      -35
    );

    // ------------------------------------------------------------
    // Cargo container in center
    // ------------------------------------------------------------

    const cargo = new THREE.Group();
    cargo.position.set(0, 0.48, 4.3);
    scene.add(cargo);

    const cargoBody = new THREE.Mesh(
      new THREE.BoxGeometry(2.55, 1.55, 2.2),
      mat.hull
    );
    cargoBody.castShadow = true;
    cargoBody.receiveShadow = true;
    cargo.add(cargoBody);

    // Panel seams.
    const seamMaterial = mat.darkHull;
    voxel(
      2.58,
      0.055,
      0.055,
      seamMaterial,
      0,
      0.35,
      0
    );
    voxel(
      2.58,
      0.055,
      0.055,
      seamMaterial,
      0,
      -0.35,
      0
    );
    voxel(
      0.055,
      1.58,
      0.055,
      seamMaterial,
      0,
      0,
      0
    );

    // White side panel.
    voxel(
      1.7,
      0.72,
      0.08,
      mat.white,
      0,
      0.05,
      1.14
    );

    // Dark inset / technical marking.
    voxel(
      0.9,
      0.3,
      0.08,
      mat.black,
      -0.3,
      0.12,
      1.21
    );

    // Corner posts.
    for (const x of [-1.29, 1.29]) {
      for (const z of [-1.12, 1.12]) {
        voxel(
          0.18,
          1.7,
          0.18,
          mat.steel,
          x,
          0.85,
          z
        );
      }
    }

    // Cargo straps.
    for (const x of [-0.85, 0.85]) {
      voxel(
        0.11,
        1.68,
        2.28,
        mat.yellow,
        x,
        0.85,
        0
      );
    }

    // Lift handles.
    for (const z of [-1.1, 1.1]) {
      voxel(
        0.1,
        0.48,
        0.1,
        mat.black,
        -0.95,
        0.85,
        z
      );
      voxel(
        0.1,
        0.48,
        0.1,
        mat.black,
        0.95,
        0.85,
        z
      );
    }

    // Small cargo ID light.
    voxel(
      0.25,
      0.12,
      0.1,
      mat.yellow,
      0,
      1.08,
      1.22
    );

    // ------------------------------------------------------------
    // Wall-mounted tools and details
    // ------------------------------------------------------------

    // Tool rack on left wall.
    voxel(
      1.6,
      0.12,
      0.45,
      mat.hull,
      -3.0,
      2.75,
      -2.95
    );

    for (let i = 0; i < 4; i++) {
      const x = -3.55 + i * 0.38;
      voxel(
        0.18,
        0.75,
        0.2,
        i % 2 ? mat.steel : mat.darkHull,
        x,
        2.42,
        -2.9
      );
      voxel(
        0.2,
        0.1,
        0.08,
        mat.yellow,
        x,
        2.8,
        -2.78
      );
    }

    // Wall pipes.
    for (let z = -0.2; z < corridor.length; z += 1.4) {
      voxel(
        0.16,
        0.2,
        0.8,
        mat.blue,
        -3.1,
        4.15,
        z
      );
      voxel(
        0.16,
        0.2,
        0.8,
        mat.steel,
        -2.86,
        4.15,
        z
      );
    }

    // ------------------------------------------------------------
    // Lighting
    // ------------------------------------------------------------

    scene.add(new THREE.HemisphereLight(0xb9d8ed, 0x30302c, 1.25));

    const ambient = new THREE.AmbientLight(0x7f99aa, 0.35);
    scene.add(ambient);

    // RectAreaLight is in core but requires no addon; however, to stay
    // robust with only core imports, use directional and point lights.
    const keyLight = new THREE.DirectionalLight(0xe4f1ff, 3.1);
    keyLight.position.set(4, 9, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.left = -12;
    keyLight.shadow.camera.right = 12;
    keyLight.shadow.camera.top = 12;
    keyLight.shadow.camera.bottom = -12;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 40;
    keyLight.shadow.bias = -0.0004;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x7fb7d1, 1.3);
    fillLight.position.set(-7, 5, -8);
    scene.add(fillLight);

    for (const z of [-1.2, 2.2, 6.2, 10.2]) {
      const light = new THREE.PointLight(0xe5f2ff, 18, 10, 2);
      light.position.set(0, 3.7, z);
      scene.add(light);
    }

    // ------------------------------------------------------------
    // Camera controls implemented directly
    // ------------------------------------------------------------

    const yaw = -0.48;
    const pitch = 0.1;
    const distance = 14.2;
    const target = new THREE.Vector3(0, 2.2, 0);

    const cameraState = {
      yaw,
      pitch,
      distance,
      target
    };

    function updateCamera() {
      const horizontal = Math.cos(cameraState.pitch) * cameraState.distance;
      camera.position.set(
        cameraState.target.x + Math.sin(cameraState.yaw) * horizontal,
        cameraState.target.y + Math.sin(cameraState.pitch) * cameraState.distance,
        cameraState.target.z + Math.cos(cameraState.yaw) * horizontal
      );
      camera.lookAt(cameraState.target);
    }

    updateCamera();

    let dragging = false;
    let previousX = 0;
    let previousY = 0;
    let moved = false;

    renderer.domElement.addEventListener("pointerdown", (event) => {
      dragging = true;
      moved = false;
      previousX = event.clientX;
      previousY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
    });

    renderer.domElement.addEventListener("pointermove", (event) => {
      if (!dragging) return;

      const dx = event.clientX - previousX;
      const dy = event.clientY - previousY;
      previousX = event.clientX;
      previousY = event.clientY;

      if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;

      cameraState.yaw -= dx * 0.0045;
      cameraState.pitch = THREE.MathUtils.clamp(
        cameraState.pitch + dy * 0.0035,
        -0.28,
        0.78
      );

      updateCamera();
    });

    function endDrag(event) {
      dragging = false;
      if (renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
    }

    renderer.domElement.addEventListener("pointerup", endDrag);
    renderer.domElement.addEventListener("pointercancel", endDrag);

    renderer.domElement.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        moved = true;
        cameraState.distance = THREE.MathUtils.clamp(
          cameraState.distance + event.deltaY * 0.012,
          5.2,
          24
        );
        updateCamera();
      },
      { passive: false }
    );

    window.addEventListener("keydown", (event) => {
      const step = 0.16;
      if (event.key === "ArrowLeft") cameraState.yaw += step;
      if (event.key === "ArrowRight") cameraState.yaw -= step;
      if (event.key === "ArrowUp") cameraState.pitch += step * 0.5;
      if (event.key === "ArrowDown") cameraState.pitch -= step * 0.5;
      cameraState.pitch = THREE.MathUtils.clamp(cameraState.pitch, -0.28, 0.78);
      updateCamera();
    });

    // ------------------------------------------------------------
    // Resize and render loop
    // ------------------------------------------------------------

    window.addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    });

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
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
    relic: { id: "generic", name: "Halo: Reach Relic", x: -10.0, z: -12.0 },
    env:   { background: 0x17212a, fogColor: 0x17212a, fogDensity: 0.018 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 },
      east: { x: 12.0, z: 10.0 },
      west: { x: -12.0, z: -10.0 }
    }
  };
}

// @world {"id": "1085", "title": "Counter-Strike", "sub": "Dust II (de_dust2)", "system": "3D Render"}
// Converted from 1085-counter_strike_dust_ii_de_dust2.html into a Back Roms World Walker module.

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
    scene.background = new THREE.Color(0x7c8791);
    scene.fog = new THREE.FogExp2(0x7c8791, 0.012);

    camera = dummyCamera();

    renderer = dummyRenderer();

    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    

    // ------------------------------------------------------------
    // Materials
    // ------------------------------------------------------------
    const materials = {
      sand: new THREE.MeshStandardMaterial({
        color: 0xc69b63,
        roughness: 0.95
      }),
      sandDark: new THREE.MeshStandardMaterial({
        color: 0x987042,
        roughness: 1
      }),
      stone: new THREE.MeshStandardMaterial({
        color: 0xb89b69,
        roughness: 0.9
      }),
      stoneLight: new THREE.MeshStandardMaterial({
        color: 0xd0b17a,
        roughness: 0.87
      }),
      stoneDark: new THREE.MeshStandardMaterial({
        color: 0x8f7350,
        roughness: 0.95
      }),
      trim: new THREE.MeshStandardMaterial({
        color: 0xd2b77e,
        roughness: 0.82
      }),
      wood: new THREE.MeshStandardMaterial({
        color: 0x59412c,
        roughness: 0.95
      }),
      woodLight: new THREE.MeshStandardMaterial({
        color: 0x765438,
        roughness: 0.9
      }),
      crate: new THREE.MeshStandardMaterial({
        color: 0x61726d,
        roughness: 0.82,
        metalness: 0.16
      }),
      crateDark: new THREE.MeshStandardMaterial({
        color: 0x384845,
        roughness: 0.85,
        metalness: 0.2
      }),
      hazard: new THREE.MeshStandardMaterial({
        color: 0xe4b63f,
        roughness: 0.7,
        metalness: 0.08
      }),
      metal: new THREE.MeshStandardMaterial({
        color: 0x52615f,
        roughness: 0.55,
        metalness: 0.45
      }),
      iron: new THREE.MeshStandardMaterial({
        color: 0x343c3d,
        roughness: 0.62,
        metalness: 0.65
      }),
      roof: new THREE.MeshStandardMaterial({
        color: 0x59666b,
        roughness: 0.7,
        metalness: 0.3
      })
    };

    // ------------------------------------------------------------
    // Voxel helpers
    // ------------------------------------------------------------
    const voxel = new THREE.Group();

    function addVoxel(parent, x, y, z, sx, sy, sz, material) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(sx, sy, sz),
        material
      );
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    }

    function addBox(parent, x, y, z, sx, sy, sz, material) {
      return addVoxel(parent, x, y, z, sx, sy, sz, material);
    }

    function addWall(parent, x, z, width, depth, height, material = materials.stone) {
      const wall = new THREE.Group();
      wall.position.set(x, 0, z);

      // Main stone body.
      addBox(wall, 0, height * 0.5, 0, width, height, depth, material);

      // Individual block seams by overlaying thin dark strips.
      const blockHeight = 0.42;
      const blockWidth = 0.56;

      for (let row = 0; row < Math.ceil(height / blockHeight); row++) {
        const y = height * 0.5 - blockHeight * (row + 0.5);

        for (let col = 0; col < Math.ceil(width / blockWidth); col++) {
          const bx =
            -width * 0.5 + blockWidth * (col + 0.5) +
            (row % 2) * blockWidth * 0.18;
          const by = y + (row % 2) * blockHeight * 0.12;
          const bw = blockWidth - 0.025;
          const bh = blockHeight - 0.025;

          addBox(
            wall,
            bx,
            by,
            -depth * 0.5 + 0.025,
            bw,
            bh,
            0.055,
            materials.stoneDark
          );
        }
      }

      // Decorative cornice.
      addBox(wall, 0, height + 0.03, 0, width + 0.18, 0.18, depth + 0.16, materials.trim);
      addBox(wall, 0, height + 0.2, 0, width + 0.08, 0.1, depth + 0.08, materials.trim);

      // Repeated relief blocks along the front.
      const reliefCount = Math.max(2, Math.floor(width / 0.38));
      for (let i = 0; i < reliefCount; i++) {
        const rx =
          -width * 0.5 + (width / reliefCount) * (i + 0.5);
        addBox(
          wall,
          rx,
          height + 0.16,
          depth * 0.5 + 0.12,
          0.22,
          0.13,
          0.12,
          materials.trim
        );
      }

      parent.add(wall);
      return wall;
    }

    function addWindow(parent, x, y, z, width = 0.85, height = 1.25) {
      const group = new THREE.Group();
      group.position.set(x, y, z);

      addBox(group, 0, 0, 0, width, height, 0.18, materials.wood);
      addBox(group, 0, 0, 0.13, 0.09, height + 0.1, 0.1, materials.iron);
      addBox(group, 0, 0, 0.15, width + 0.1, 0.09, 0.1, materials.iron);
      addBox(group, 0, 0, 0.18, 0.055, height, 0.14, materials.iron);

      parent.add(group);
      return group;
    }

    function addDoor(parent, x, y, z, width = 1.45, height = 2.45) {
      const group = new THREE.Group();
      group.position.set(x, y, z);

      addBox(group, 0, 0, 0, width, height, 0.2, materials.wood);
      addBox(group, 0, 0, 0.15, 0.12, height + 0.1, 0.12, materials.iron);
      addBox(group, 0, 0, 0.19, width + 0.1, 0.12, 0.16, materials.iron);
      addBox(group, -width * 0.25, 0, 0.2, width * 0.5, 0.12, 0.16, materials.iron);
      addBox(group, width * 0.25, 0, 0.2, width * 0.5, 0.12, 0.16, materials.iron);

      parent.add(group);
      return group;
    }

    function addCrate(parent, x, y, z, size = 0.85, material = materials.crate) {
      const group = new THREE.Group();
      group.position.set(x, y, z);

      addBox(group, 0, 0, 0, size, size, size, material);

      // Structural bands.
      addBox(group, 0, size * 0.3, size * 0.51, size + 0.03, size * 0.12, 0.06, materials.crateDark);
      addBox(group, 0, -size * 0.3, size * 0.51, size + 0.03, size * 0.12, 0.06, materials.crateDark);

      // Metal corner pieces.
      for (const sx of [-1, 1]) {
        for (const sz of [-1, 1]) {
          addBox(
            group,
            sx * size * 0.43,
            size * 0.43,
            sz * size * 0.43,
            0.12,
            0.12,
            0.12,
            materials.metal
          );
        }
      }

      parent.add(group);
      return group;
    }

    function addHazardBand(parent, y, z, size = 0.85) {
      const group = new THREE.Group();
      group.position.set(0, y, z);

      for (let i = 0; i < 10; i++) {
        const stripe = addBox(
          group,
          -size * 0.46 + i * size * 0.095,
          0,
          size * 0.52,
          size * 0.083,
          size * 0.18,
          0.035,
          i % 2 === 0 ? materials.hazard : materials.crateDark
        );
        stripe.rotation.y = -0.12;
      }

      parent.add(group);
      return group;
    }

    // ------------------------------------------------------------
    // Ground and courtyard
    // ------------------------------------------------------------
    const world = new THREE.Group();

    // Large ground plane made from a grid of square voxels.
    const tile = 0.62;
    const ground = new THREE.Group();

    for (let x = -15; x <= 15; x++) {
      for (let z = -15; z <= 15; z++) {
        const edge = Math.max(
          0,
          Math.max(Math.abs(x) - 12, Math.abs(z) - 12)
        );

        const material =
          edge > 2
            ? materials.sandDark
            : materials.sand;

        const variation = ((x * 13 + z * 7) % 5 - 2) * 0.006;
        const tileMesh = addBox(
          ground,
          x * tile,
          -0.04,
          z * tile,
          tile * 0.97,
          0.08,
          tile * 0.97,
          material
        );
        tileMesh.receiveShadow = true;
      }
    }

    world.add(ground);

    // Paved central walkway, slightly lighter and more ordered.
    for (let x = -6; x <= 6; x++) {
      for (let z = -4; z <= 4; z++) {
        const material = (x + z) % 3 === 0
          ? materials.stoneLight
          : materials.stone;

        addBox(
          world,
          x * 0.72,
          0.015,
          z * 0.72,
          0.69,
          0.09,
          0.69,
          material
        );
      }
    }

    // ------------------------------------------------------------
    // Buildings
    // ------------------------------------------------------------
    const architecture = new THREE.Group();

    // Left wall with arched windows.
    addWall(architecture, -5.2, -1.2, 10.4, 2.3, 3.4);
    addWindow(architecture, -7.25, 2.25, -0.96, 0.9, 1.25);
    addWindow(architecture, -3.25, 2.25, -0.96, 0.9, 1.25);

    // Back-left building.
    addWall(architecture, -4.75, -6.1, 7.2, 3.2, 3.2);
    addWindow(architecture, -6.3, 2.05, -5.86, 0.85, 1.2);
    addWindow(architecture, -3.2, 2.05, -5.86, 0.85, 1.2);

    // Central rear structure and arch.
    addWall(architecture, -0.2, -5.8, 4.1, 2.6, 3.0);
    addWall(architecture, -0.2, -2.8, 1.1, 2.4, 2.7);

    // Arch helper.
    function addArch(parent, x, y, z, width, height, depth = 0.55, material = materials.stone) {
      const group = new THREE.Group();
      group.position.set(x, y, z);

      // Side piers.
      addBox(group, -width * 0.43, 0, 0, width * 0.22, height, depth, material);
      addBox(group, width * 0.43, 0, 0, width * 0.22, height, depth, material);

      // Stepped arch blocks.
      for (let level = 0; level < 4; level++) {
        const halfWidth = width * (0.55 - level * 0.075);
        const heightBand = height * (0.24 - level * 0.035);

        addBox(
          group,
          0,
          heightBand * 0.5,
          0,
          halfWidth * 2,
          heightBand,
          depth,
          material
        );
      }

      // Dark interior.
      addBox(group, 0, -0.05, depth * 0.48, width * 0.8, height * 0.85, 0.04, materials.sandDark);

      parent.add(group);
      return group;
    }

    addArch(architecture, 0.2, 1.35, -2.35, 1.55, 2.45, 0.5);

    // Right wall with doorway.
    addWall(architecture, 5.15, -1.2, 10.4, 2.3, 3.4);
    addDoor(architecture, 5.15, 1.7, -0.94, 1.55, 2.45);

    // Rear right wall.
    addWall(architecture, 5.15, -6.1, 7.2, 3.2, 3.2);

    // Small roofed structure at the back.
    addWall(architecture, 1.0, -8.15, 5.0, 2.8, 2.7);
    addBox(architecture, 1.0, 3.45, -8.15, 5.2, 0.25, 3.0, materials.roof);
    addBox(architecture, 1.0, 3.65, -8.15, 4.8, 0.12, 2.6, materials.roof);

    // ------------------------------------------------------------
    // Crates and props
    // ------------------------------------------------------------
    const props = new THREE.Group();

    // Stacked crates against the left wall.
    addCrate(props, -7.85, 0.43, 0.15, 0.8);
    addCrate(props, -6.95, 0.43, 0.15, 0.8);
    addCrate(props, -7.85, 1.28, 0.15, 0.8);

    // Another pair near the center.
    addCrate(props, -1.85, 0.43, 0.15, 0.8);
    addCrate(props, -0.95, 0.43, 0.15, 0.8);
    addCrate(props, -1.85, 1.28, 0.15, 0.8);

    // Large foreground crate with hazard bands.
    const bigCrate = addCrate(props, 2.25, 0.43, 2.65, 1.15);
    addHazardBand(bigCrate, 0.62, 0.58, 1.15);
    addHazardBand(bigCrate, -0.62, 0.58, 1.15);

    // Low foreground crate.
    addCrate(props, -2.8, 0.22, 3.25, 0.72, materials.crateDark);
    addCrate(props, -1.9, 0.22, 3.25, 0.72, materials.crate);

    // Small crate on the raised right platform.
    addBox(props, 7.05, 0.22, -3.25, 3.4, 0.44, 1.4, materials.stoneDark);
    addBox(props, 7.05, 0.46, -3.25, 3.55, 0.12, 1.5, materials.trim);
    addCrate(props, 6.65, 0.67, -3.25, 0.72);

    // Small barrel-like voxel cylinder.
    function addBarrel(parent, x, y, z, radius = 0.38, height = 0.85) {
      const group = new THREE.Group();
      group.position.set(x, y, z);

      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        addBox(
          group,
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius,
          radius * 1.7,
          height,
          radius * 0.7,
          materials.woodLight
        );
      }

      addBox(group, 0, 0, radius * 0.7, radius * 2.1, height + 0.08, 0.08, materials.iron);
      parent.add(group);
      return group;
    }

    addBarrel(props, 3.65, 0.43, 0.35, 0.38, 0.85);
    addBarrel(props, 4.1, 0.43, 0.35, 0.38, 0.85);

    // A few small crates and a low bench.
    addCrate(props, 7.0, 0.43, 0.2, 0.65);
    addCrate(props, 7.65, 0.43, 0.2, 0.65);

    addBox(props, -4.65, 0.42, 2.1, 1.8, 0.18, 0.65, materials.wood);
    for (const x of [-5.35, -3.95]) {
      addBox(props, x, 0.2, 2.1, 0.18, 0.4, 0.5, materials.wood);
    }

    // ------------------------------------------------------------
    // Distant scenery
    // ------------------------------------------------------------
    const landscape = new THREE.Group();

    // Low distant hills made from large flattened cubes.
    for (let i = 0; i < 22; i++) {
      const x = -30 + i * 2.8;
      const z = -24 - (i % 3) * 2.2;
      const h = 1.2 + (i % 4) * 0.45;

      addBox(
        landscape,
        x,
        h * 0.5,
        z,
        2.6,
        h,
        2.2,
        i % 3 === 0 ? materials.sandDark : materials.sand
      );
    }

    // Sparse voxel trees.
    function addTree(parent, x, z, scale = 1) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      group.scale.setScalar(scale);

      addBox(group, 0, 0.35, 0, 0.65, 0.7, 0.65, materials.sandDark);

      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const leaf = addBox(
          group,
          Math.cos(angle) * 0.32,
          0.9 + (i % 2) * 0.28,
          Math.sin(angle) * 0.32,
          0.7,
          0.62,
          0.7,
          i % 2 ? materials.woodLight : materials.wood
        );
        leaf.rotation.y = angle;
      }

      parent.add(group);
      return group;
    }

    addTree(landscape, -11.5, -12.5, 1.1);
    addTree(landscape, -8.5, -14.2, 0.85);
    addTree(landscape, 10.5, -13.5, 1.0);
    addTree(landscape, 14.2, -10.5, 0.75);
    addTree(landscape, -16, -8, 0.9);
    addTree(landscape, 17, -4, 0.8);

    landscape.add(landscape.children[0]);

    world.add(architecture);
    world.add(props);
    world.add(landscape);
    scene.add(world);

    // ------------------------------------------------------------
    // Lighting
    // ------------------------------------------------------------
    const hemisphere = new THREE.HemisphereLight(0xd7e5ed, 0x795735, 1.65);
    scene.add(hemisphere);

    // Warm directional sun from the left.
    const sun = new THREE.DirectionalLight(0xffd39a, 3.2);
    sun.position.set(-12, 15, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -18;
    sun.shadow.camera.right = 18;
    sun.shadow.camera.top = 18;
    sun.shadow.camera.bottom = -18;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 55;
    sun.shadow.bias = -0.00025;
    sun.shadow.normalBias = 0.025;
    scene.add(sun);

    // Cool fill light from the opposite side.
    const fill = new THREE.DirectionalLight(0x9eb9d0, 0.75);
    fill.position.set(10, 8, -12);
    scene.add(fill);

    // ------------------------------------------------------------
    // Direct orbit controls
    // ------------------------------------------------------------
    const controls = {
      target: new THREE.Vector3(0, 1.2, -1.3),
      radius: 18.5,
      theta: Math.PI * 0.22,
      phi: Math.PI * 0.28,
      dragging: false,
      pointerX: 0,
      pointerY: 0,
      zoom: 1
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
      controls.pointerX = event.clientX;
      controls.pointerY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
      renderer.domElement.style.cursor = "grabbing";
    });

    renderer.domElement.addEventListener("pointermove", (event) => {
      if (!controls.dragging) return;

      const dx = event.clientX - controls.pointerX;
      const dy = event.clientY - controls.pointerY;

      controls.pointerX = event.clientX;
      controls.pointerY = event.clientY;

      controls.theta -= dx * 0.005;
      controls.phi = THREE.MathUtils.clamp(
        controls.phi + dy * 0.004,
        0.18,
        Math.PI * 0.48
      );

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

    renderer.domElement.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        controls.zoom = THREE.MathUtils.clamp(
          controls.zoom * Math.exp(-event.deltaY * 0.001),
          0.65,
          2.4
        );

        updateCamera();
      },
      { passive: false }
    );

    window.addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    });

    updateCamera();

    // Gentle idle camera drift until the user interacts.
    let idle = true;
    let drift = 0;

    function animate() {
      requestAnimationFrame(animate);

      if (idle) {
        drift = Math.sin(performance.now() * 0.00035) * 0.025;
        controls.theta += drift;
        updateCamera();
      }

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
    spawn: { x: 0.0, z: 12.7, yaw: 0 },
    relic: { id: "generic", name: "Counter-Strike Relic", x: 10.0, z: -13.3 },
    env:   { background: 0x7c8791, fogColor: 0x7c8791, fogDensity: 0.012 },
    doors: {
      next: { x: 12.0, z: -11.3 },
      prev: { x: -12.0, z: 8.7 },
      east: { x: 12.0, z: 8.7 },
      west: { x: -12.0, z: -11.3 }
    }
  };
}

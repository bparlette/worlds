// @world {"id": "1092", "title": "Halo 4", "sub": "Haven", "system": "3D Render"}
// Converted from 1092-halo_4_haven.html into a Back Roms World Walker module.

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

    

    // -------------------------------------------------------------------------
    // Renderer and scene
    // -------------------------------------------------------------------------

    // scene redirect
    scene.background = new THREE.Color(0x9aa8b5);
    scene.fog = new THREE.Fog(0x9aa8b5, 28, 78);

    camera = dummyCamera();

    renderer = dummyRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    

    // -------------------------------------------------------------------------
    // Voxel materials
    // -------------------------------------------------------------------------

    const voxelMaterials = {
      shell: new THREE.MeshStandardMaterial({
        color: 0xb7b8ae,
        roughness: 0.88,
        metalness: 0.08
      }),
      shellDark: new THREE.MeshStandardMaterial({
        color: 0x68717a,
        roughness: 0.78,
        metalness: 0.18
      }),
      shellLight: new THREE.MeshStandardMaterial({
        color: 0xd2d2c8,
        roughness: 0.78,
        metalness: 0.08
      }),
      black: new THREE.MeshStandardMaterial({
        color: 0x252c31,
        roughness: 0.72,
        metalness: 0.35
      }),
      orange: new THREE.MeshStandardMaterial({
        color: 0xe28b37,
        roughness: 0.58,
        metalness: 0.22,
        emissive: 0x5e2500,
        emissiveIntensity: 0.35
      }),
      cyan: new THREE.MeshStandardMaterial({
        color: 0x79b7bd,
        roughness: 0.48,
        metalness: 0.35,
        emissive: 0x163d42,
        emissiveIntensity: 0.5
      }),
      glass: new THREE.MeshStandardMaterial({
        color: 0x6d9ca7,
        roughness: 0.25,
        metalness: 0.25,
        transparent: true,
        opacity: 0.48
      })
    };

    // -------------------------------------------------------------------------
    // Voxel construction helpers
    // -------------------------------------------------------------------------

    const voxels = [];

    function addVoxel(x, y, z, material, size = 1) {
      const voxel = new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        material
      );

      voxel.position.set(x, y, z);
      voxel.castShadow = true;
      voxel.receiveShadow = true;
      scene.add(voxel);
      voxels.push(voxel);
      return voxel;
    }

    function solidBox(x, y, z, sx, sy, sz, material) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(sx, sy, sz),
        material
      );

      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      return mesh;
    }

    function lineX(x, y, z, start, end, material, thickness = 1) {
      const length = Math.abs(end - start);
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(length, thickness, thickness),
        material
      );

      mesh.position.set(x, y, (start + end) / 2, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      return mesh;
    }

    function lineZ(x, y, z, start, end, material, thickness = 1) {
      const length = Math.abs(end - start);
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(thickness, thickness, length),
        material
      );

      mesh.position.set(x, y, (start + end) / 2);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      return mesh;
    }

    function lineY(x, y, z, start, end, material, thickness = 1) {
      const length = Math.abs(end - start);
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(thickness, length, thickness),
        material
      );

      mesh.position.set(x, (start + end) / 2, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      return mesh;
    }

    // -------------------------------------------------------------------------
    // Ground and surrounding platforms
    // -------------------------------------------------------------------------

    addVoxel(0, -0.55, 0, voxelMaterials.black, 2);

    // Main plinth
    solidBox(0, -0.1, 0, 15, 0.8, 12, voxelMaterials.shellDark);

    // Central raised platform
    solidBox(0, 0.3, 0, 7.5, 0.65, 6.5, voxelMaterials.shell);

    // Floor inlay and central conduit
    for (let x = -3; x <= 3; x += 1) {
      addVoxel(x, 0.04, 0, voxelMaterials.black, 0.48);
    }

    lineY(0, 0.08, 0, -2.5, 2.5, voxelMaterials.orange, 0.18);

    // Side platforms
    solidBox(-7.5, 0.05, 0, 4.5, 0.7, 7, voxelMaterials.shellDark);
    solidBox(7.5, 0.05, 0, 4.5, 0.7, 7, voxelMaterials.shellDark);

    // Side platform edge details
    for (let i = 0; i < 7; i++) {
      addVoxel(-5.8 + i, 0.48, -2.7, voxelMaterials.shellLight, 0.65);
      addVoxel(-5.8 + i, 0.48, 2.7, voxelMaterials.shellLight, 0.65);
      addVoxel(5.8 - i, 0.48, -2.7, voxelMaterials.shellLight, 0.65);
      addVoxel(5.8 - i, 0.48, 2.7, voxelMaterials.shellLight, 0.65);
    }

    // -------------------------------------------------------------------------
    // Main gateway: voxelized central spandrel
    // -------------------------------------------------------------------------

    const gateway = new THREE.Group();
    scene.add(gateway);

    const V = 1;

    function addGateVoxel(x, y, z, material) {
      addVoxel(x, y, z, material, V);
    }

    // Vertical side towers
    for (let y = 0; y <= 12; y++) {
      for (let x = 0; x <= 4; x++) {
        const px = -5 + x;

        // Main structural spine
        if (x === 0 || x === 4) {
          addGateVoxel(px, y, 0, voxelMaterials.shell);
        }

        // Inner recessed panels
        if (y < 9) {
          addGateVoxel(px, y, 0, voxelMaterials.shellDark);
        }

        // Outer shoulder armor
        if (y <= 2 || y >= 10) {
          addGateVoxel(px, y, 0, voxelMaterials.shellLight);
        }

        // Angled inward shoulders
        if (y >= 3 && y <= 6) {
          addGateVoxel(px + (x === 0 ? 1 : -1), y, 0, voxelMaterials.shell);
        }

        // Orange service strips
        if (y === 1 || y === 11) {
          addGateVoxel(px, y, 0, voxelMaterials.orange);
        }
      }
    }

    // Upper circular ring, built from discrete blocks
    const ringRadius = 2.4;

    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const x = Math.cos(angle) * ringRadius;
      const z = Math.sin(angle) * ringRadius;

      addGateVoxel(x, 8.2, z, voxelMaterials.shellLight);

      // Alternate darker inner blocks and orange markers
      if (i % 3 === 0) {
        addGateVoxel(x * 0.72, 8.2, z * 0.72, voxelMaterials.shellDark);
      }

      if (i % 4 === 0) {
        addGateVoxel(x, 8.2, z, voxelMaterials.orange);
      }
    }

    // Ring support arms
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + Math.PI / 8;
      const x = Math.cos(angle) * 3.1;
      const z = Math.sin(angle) * 3.1;

      addGateVoxel(x, 8.2, z, voxelMaterials.shell);
      addGateVoxel(x * 0.78, 8.2, z * 0.78, voxelMaterials.shellDark);
    }

    // Top cap
    addGateVoxel(0, 12.5, 0, voxelMaterials.shellLight);
    addGateVoxel(0, 12.5, 0, voxelMaterials.orange);

    // Lower fork
    for (let y = 0; y <= 5; y++) {
      const spread = Math.max(0, 1 - y * 0.22);

      for (let x = 0; x <= 3; x++) {
        const px = -2.5 + spread + x;

        addGateVoxel(px, y, 0, voxelMaterials.shell);
        addGateVoxel(px, y, 0, voxelMaterials.shellDark);

        if (y === 0 || y === 5) {
          addGateVoxel(px, y, 0, voxelMaterials.shellLight);
        }

        if (y === 1 || y === 4) {
          addGateVoxel(px, y, 0, voxelMaterials.orange);
        }
      }
    }

    // Lower support columns
    for (let x = 0; x <= 2; x++) {
      addGateVoxel(-2 + x, 0.8, 0, voxelMaterials.shellDark);
    }

    // -------------------------------------------------------------------------
    // Side pylons and architectural framing
    // -------------------------------------------------------------------------

    function buildSidePylon(side) {
      const group = new THREE.Group();
      group.position.x = side * 8.2;
      scene.add(group);

      const V = 0.9;

      for (let y = 0; y <= 10; y++) {
        for (let x = 0; x <= 3; x++) {
          const px = x;

          addVoxel(px, y, 0, voxelMaterials.shell, V);
          addVoxel(px, y, 0, voxelMaterials.shellDark);

          if (y <= 2 || y >= 8) {
            addVoxel(px, y, 0, voxelMaterials.shellLight, V);
          }

          if (y === 1 || y === 9) {
            addVoxel(px, y, 0, voxelMaterials.orange, V);
          }
        }
      }

      // Curved shoulder
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        addVoxel(
          Math.cos(angle) * 3.1,
          7.2,
          Math.sin(angle) * 3.1,
          voxelMaterials.shell,
          V
        );
      }

      // Outer face panels
      for (let y = 2; y <= 9; y += 2) {
        addVoxel(side * 4.5, y, 0, voxelMaterials.shellLight, V);
      }

      // Base
      solidBox(side * 8.2, 0.05, 0, 4.8, 0.7, 5.5, voxelMaterials.shellDark);
    }

    buildSidePylon(-1);
    buildSidePylon(1);

    // -------------------------------------------------------------------------
    // Wings and mechanical details
    // -------------------------------------------------------------------------

    function buildWing(side) {
      const group = new THREE.Group();
      group.position.x = side * 7.2;
      group.rotation.y = side * -0.12;
      scene.add(group);

      const V = 0.85;

      for (let i = 0; i < 5; i++) {
        const x = side * (1.2 + i * 1.25);

        addVoxel(x, 0.3, 0, voxelMaterials.shellDark, V);
        addVoxel(x, 0.3, 0, voxelMaterials.shell);

        addVoxel(x, 0.3, 0, voxelMaterials.shellLight, V);
        addVoxel(x, 0.3, 0, voxelMaterials.orange, V);
      }

      // Long side beam
      for (let x = 1.2; x <= 5.7; x += 0.85) {
        addVoxel(side * x, 1.2, 0, voxelMaterials.shell, V);
        addVoxel(side * x, 1.2, 0, voxelMaterials.shellDark, V);
      }

      // Diagonal braces
      for (let i = 0; i < 3; i++) {
        addVoxel(
          side * (1.2 + i * 1.25),
          0.25 + i * 0.75,
          0,
          voxelMaterials.shellLight,
          V
        );
      }

      // Engine / sensor pods
      for (const z of [-1.2, 1.2]) {
        addVoxel(side * 4.8, 0.3, z, voxelMaterials.black, V);
        addVoxel(side * 4.8, 0.3, z, voxelMaterials.cyan, V * 0.72);
      }
    }

    buildWing(-1);
    buildWing(1);

    // Lower side wings
    function buildLowerWing(side) {
      const group = new THREE.Group();
      group.position.x = side * 7.2;
      scene.add(group);

      for (let i = 0; i < 4; i++) {
        const x = side * (1.1 + i * 1.15);

        addVoxel(x, -0.15, 0, voxelMaterials.shell, 0.75);
        addVoxel(x, -0.15, 0, voxelMaterials.shellDark, 0.75);
        addVoxel(x, -0.15, 0, voxelMaterials.shellLight, 0.75);
        addVoxel(x, -0.15, 0, voxelMaterials.orange, 0.75);
      }

      // Outer angled panels
      for (let i = 0; i < 4; i++) {
        addVoxel(
          side * (1.1 + i * 1.15),
          -0.15,
          0,
          voxelMaterials.shellLight,
          0.75
        );
      }
    }

    buildLowerWing(-1);
    buildLowerWing(1);

    // -------------------------------------------------------------------------
    // Atmospheric background: voxel clouds
    // -------------------------------------------------------------------------

    const cloudMaterial = new THREE.MeshStandardMaterial({
      color: 0xd9e1e4,
      roughness: 1,
      metalness: 0
    });

    function addCloud(x, y, z, scale) {
      const cloud = new THREE.Group();
      cloud.position.set(x, y, z);
      cloud.scale.setScalar(scale);
      scene.add(cloud);

      const pieces = [
        [-2, 0, 0, 2.2],
        [0, 0.5, 0, 2.7],
        [2.2, 0, 0, 1.8],
        [-1.2, -0.5, 0, 1.5],
        [1.5, -0.4, 0, 1.6],
        [0.3, -0.8, 0, 1.3]
      ];

      for (const [px, py, pz, s] of pieces) {
        const puff = new THREE.Mesh(
          new THREE.IcosahedronGeometry(s, 1),
          cloudMaterial
        );

        puff.position.set(px, py, pz);
        puff.scale.y = 0.65;
        cloud.add(puff);
      }
    }

    addCloud(-10, 9, -18, 2.4);
    addCloud(11, 13, -24, 2.8);
    addCloud(18, 5, -15, 1.7);
    addCloud(-17, 4, -22, 1.5);

    // -------------------------------------------------------------------------
    // Lighting
    // -------------------------------------------------------------------------

    scene.add(new THREE.HemisphereLight(0xddeeff, 0x52606c, 2.0));

    const sun = new THREE.DirectionalLight(0xfff1d6, 3.2);
    sun.position.set(-12, 18, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -22;
    sun.shadow.camera.right = 22;
    sun.shadow.camera.top = 22;
    sun.shadow.camera.bottom = -22;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 60;
    sun.shadow.bias = -0.0005;
    scene.add(sun);

    const rim = new THREE.DirectionalLight(0x8ec8e4, 1.2);
    rim.position.set(14, 8, -15);
    scene.add(rim);

    const warmFill = new THREE.DirectionalLight(0xffa45c, 0.65);
    warmFill.position.set(-8, 4, -10);
    scene.add(warmFill);

    // -------------------------------------------------------------------------
    // Camera controls implemented directly
    // -------------------------------------------------------------------------

    const controls = {
      target: new THREE.Vector3(0, 5.4, 0),
      radius: 23,
      theta: 0,
      phi: Math.PI / 2,
      dragging: false,
      lastX: 0,
      lastY: 0
    };

    const initialCamera = {
      radius: 23,
      theta: 0,
      phi: Math.PI / 2
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
      controls.phi = THREE.MathUtils.clamp(
        controls.phi - dy * 0.005,
        0.25,
        Math.PI - 0.25
      );

      updateCamera();
    });

    function endDrag(event) {
      controls.dragging = false;
      renderer.domElement.style.cursor = "grab";

      if (event.pointerId !== undefined) {
        try {
          renderer.domElement.releasePointerCapture(event.pointerId);
        } catch (_) {
          // Pointer capture may already have been released.
        }
      }
    }

    renderer.domElement.addEventListener("pointerup", endDrag);
    renderer.domElement.addEventListener("pointercancel", endDrag);
    renderer.domElement.style.cursor = "grab";

    renderer.domElement.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();

        controls.radius = THREE.MathUtils.clamp(
          controls.radius + event.deltaY * 0.012,
          10,
          42
        );

        updateCamera();
      },
      { passive: false }
    );

    // Keyboard controls
    window.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();

      if (key === "arrowleft") controls.theta += 0.08;
      if (key === "arrowright") controls.theta -= 0.08;
      if (key === "arrowup") controls.phi = Math.max(0.25, controls.phi - 0.06);
      if (key === "arrowdown") controls.phi = Math.min(Math.PI - 0.25, controls.phi + 0.06);

      updateCamera();
    });

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    updateCamera();

    // -------------------------------------------------------------------------
    // Animation
    // -------------------------------------------------------------------------

    const clock = new THREE.Clock();

    function animate() {
      const elapsed = clock.getElapsedTime();

      // Subtle energy pulse along the gateway.
      const pulse = 0.5 + 0.5 * Math.sin(elapsed * 1.7);

      voxelMaterials.orange.emissiveIntensity = 0.22 + pulse * 0.55;
      voxelMaterials.cyan.emissiveIntensity = 0.35 + pulse * 0.35;

      // Very subtle moving light across the floor.
      const floorLight = new THREE.PointLight(0x8bdce4, 0.4, 12, 2);
      floorLight.position.set(0, 1.2, 0);
      floorLight.intensity = 0.25 + pulse * 0.45;
      scene.add(floorLight);

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
    relic: { id: "generic", name: "Halo 4 Relic", x: 10.0, z: -12.0 },
    env:   { background: 0x9aa8b5, fogColor: 0x9aa8b5, fogDensity: 0.025 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 },
      east: { x: 12.0, z: 10.0 },
      west: { x: -12.0, z: -10.0 }
    }
  };
}

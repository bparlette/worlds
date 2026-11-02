// @world {"id": "1065", "title": "Donkey Kong", "sub": "25M \u2014 Level 1", "system": "3D Render"}
// Converted from 1065-donkey_kong_25m_level_1.html into a Back Roms World Walker module.

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

    renderer = dummyRenderer();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    

    // scene redirect
    scene.background = new THREE.Color(0x020408);
    scene.fog = new THREE.FogExp2(0x020408, 0.035);

    camera = dummyCamera();

    // -------------------------------------------------------------------------
    // Lighting
    // -------------------------------------------------------------------------

    scene.add(new THREE.HemisphereLight(0x6b9dbb, 0x180808, 0.8));

    const keyLight = new THREE.DirectionalLight(0xffd0a0, 2.2);
    keyLight.position.set(7, 11, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.left = -12;
    keyLight.shadow.camera.right = 12;
    keyLight.shadow.camera.top = 12;
    keyLight.shadow.camera.bottom = -12;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 35;
    keyLight.shadow.bias = -0.0008;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x288dff, 1.4);
    rimLight.position.set(-8, 5, -9);
    scene.add(rimLight);

    const redLight = new THREE.PointLight(0xff3322, 18, 18, 2);
    redLight.position.set(2, 4, 5);
    scene.add(redLight);

    const cyanLight = new THREE.PointLight(0x25d8ff, 10, 14, 2);
    cyanLight.position.set(-2, 7, -3);
    scene.add(cyanLight);

    // -------------------------------------------------------------------------
    // Materials
    // -------------------------------------------------------------------------

    const materials = {
      red: new THREE.MeshStandardMaterial({
        color: 0xff3322,
        roughness: 0.58,
        metalness: 0.18,
        emissive: 0x4d0600,
        emissiveIntensity: 0.45
      }),
      redDark: new THREE.MeshStandardMaterial({
        color: 0x8f1009,
        roughness: 0.72,
        metalness: 0.12,
        emissive: 0x280200,
        emissiveIntensity: 0.3
      }),
      black: new THREE.MeshStandardMaterial({
        color: 0x101419,
        roughness: 0.82,
        metalness: 0.28
      }),
      steel: new THREE.MeshStandardMaterial({
        color: 0x56616a,
        roughness: 0.48,
        metalness: 0.72
      }),
      cyan: new THREE.MeshStandardMaterial({
        color: 0x8cecff,
        roughness: 0.35,
        metalness: 0.25,
        emissive: 0x138bc2,
        emissiveIntensity: 0.8
      }),
      yellow: new THREE.MeshStandardMaterial({
        color: 0xf1b82e,
        roughness: 0.65,
        metalness: 0.15,
        emissive: 0x5a3100,
        emissiveIntensity: 0.28
      }),
      floor: new THREE.MeshStandardMaterial({
        color: 0x090c12,
        roughness: 0.9,
        metalness: 0.1
      })
    };

    // -------------------------------------------------------------------------
    // Voxel construction helpers
    // -------------------------------------------------------------------------

    const platform = new THREE.Group();
    scene.add(platform);

    const voxel = (
      x,
      y,
      z,
      size = 1,
      material,
      parent = platform
    ) => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        material
      );
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    };

    function makeBeam(x1, z1, x2, z2, y, thickness = 1, material = materials.red) {
      const dx = x2 - x1;
      const dz = z2 - z1;
      const length = Math.hypot(dx, dz);
      const count = Math.max(1, Math.ceil(length));

      for (let i = 0; i < count; i++) {
        const t = i / (count - 1);
        const x = THREE.MathUtils.lerp(x1, x2, t);
        const z = THREE.MathUtils.lerp(z1, z2, t);
        voxel(x, y, z, thickness, material);
      }
    }

    function makeCrossBeam(x, z, y, depth = 1) {
      voxel(x, y, z, depth, materials.red);
      voxel(x, y, z, 0.52, materials.redDark);
    }

    function makeLadder(x, z, y, level, width = 1.25) {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      platform.add(group);

      const sideX = width * 0.43;

      for (const side of [-1, 1]) {
        voxel(
          side * sideX,
          level * 0.48,
          0,
          0.12,
          materials.cyan,
          group
        );
      }

      for (let rung = 0; rung < 11; rung++) {
        voxel(
          0,
          rung * 0.48,
          0,
          width,
          materials.cyan,
          group
        );
      }

      for (const side of [-1, 1]) {
        voxel(
          side * sideX,
          level * 0.48,
          0,
          0.12,
          materials.cyan,
          group
        );
      }
    }

    function makeBarrel(x, y, z, radius = 0.55) {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      platform.add(group);

      // Barrel body made from stacked square voxel rings.
      for (let layer = 0; layer < 4; layer++) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(radius * 0.94, 0.16, 5, 10),
          materials.yellow
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.y = layer * 0.25;
        ring.castShadow = true;
        group.add(ring);
      }

      // Top and bottom caps.
      const top = new THREE.Mesh(
        new THREE.CylinderGeometry(radius * 0.75, radius * 0.75, 0.12, 10),
        materials.yellow
      );
      top.position.y = 1.0;
      top.castShadow = true;
      group.add(top);

      const bottom = new THREE.Mesh(
        new THREE.CylinderGeometry(radius * 0.75, radius * 0.75, 0.12, 10),
        materials.yellow
      );
      bottom.position.y = -1.0;
      bottom.castShadow = true;
      group.add(bottom);

      // Vertical ribs.
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        voxel(
          Math.cos(angle) * radius,
          0.4,
          Math.sin(angle) * radius,
          0.09,
          materials.yellow,
          group
        );
      }
    }

    function makePallet(x, z, y) {
      // Two crossed beams.
      makeBeam(x - 0.9, z - 0.5, x + 0.9, z + 0.5, y, 0.25, materials.redDark);
      makeBeam(x - 0.5, z - 0.9, x + 0.5, z + 0.9, y, 0.25, materials.redDark);
    }

    // -------------------------------------------------------------------------
    // Main platform structure
    // -------------------------------------------------------------------------

    const levels = [
      { y: 0.45 },
      { y: 1.65 },
      { y: 2.85 },
      { y: 4.05 },
      { y: 5.25 },
      { y: 6.45 },
      { y: 7.65 }
    ];

    // Main horizontal platforms.
    for (const level of levels) {
      makeCrossBeam(0, level.y, 0, 3.4);
      makeCrossBeam(-2.2, level.y, 0, 0.7, 1.2);
      makeCrossBeam(2.2, level.y, 0, 0.7, 1.2);
    }

    // Cross braces between adjacent levels.
    for (let i = 0; i < levels.length - 1; i++) {
      const lower = levels[i];
      const upper = levels[i + 1];

      makeBeam(-1.8, lower.y, -1.8, upper.y, 0, 0.34, materials.redDark);
      makeBeam(1.8, lower.y, 1.8, upper.y, 0, 0.34, materials.redDark);
      makeBeam(-0.8, lower.y, 0.8, upper.y, 0, 0.34, materials.redDark);
    }

    // Vertical corner columns.
    for (const x of [-2.55, 2.55]) {
      for (const z of [-1.25, 1.25]) {
        voxel(x, 3.85, z, 0.48, materials.redDark);
        voxel(x, 5.35, z, 0.48, materials.redDark);
        voxel(x, 6.85, z, 0.48, materials.redDark);
      }
    }

    // Main central ladder.
    makeLadder(0, 0, 0.65, 8, 1.55);

    // Side ladders.
    makeLadder(-1.95, 0, 0.65, 5, 1.2);
    makeLadder(1.95, 0, 0.65, 5, 1.2);

    // Upper platform with additional ladders.
    voxel(0, 8.05, 0, 3.7, materials.red);
    voxel(-1.8, 8.05, 0, 0.7, materials.red);
    voxel(1.8, 8.05, 0, 0.7, materials.red);

    makeLadder(-1.15, 0, 8.35, 3, 1.05);
    makeLadder(1.15, 0, 8.35, 3, 1.05);

    // Small upper bridge.
    makeBeam(-1.35, 0, 1.35, 0, 8.95, 0.75, materials.red);
    makeLadder(-0.7, 0, 9.3, 1.5, 0.85);

    // -------------------------------------------------------------------------
    // Decorative objects
    // -------------------------------------------------------------------------

    // Top-left barrel stack.
    makeBarrel(-1.45, 8.35, -0.55, 0.5);
    makeBarrel(-1.45, 9.15, -0.55, 0.46);
    makeBarrel(-2.1, 8.25, -0.75, 0.48);

    // Small control box on the top platform.
    voxel(-2.15, 9.35, -0.55, 0.65, materials.black);
    voxel(-2.15, 9.65, -0.55, 0.35, materials.cyan);
    voxel(-2.15, 9.7, -0.55, 0.18, materials.black);

    // Lower platform barrel.
    makeBarrel(-1.65, 0.55, 0.8, 0.55);

    // Small hanging lamps.
    for (const [x, z] of [[-1.8, 0.4], [1.8, -0.6], [0, -1.7]]) {
      voxel(x, 0.45, z, 0.12, materials.black);
      voxel(x, 0.25, z, 0.3, materials.black);
      voxel(x, 0.08, z, 0.18, materials.cyan);
    }

    // Hanging support cables.
    for (const x of [-2.55, 2.55]) {
      for (const z of [-1.25, 1.25]) {
        voxel(x, 0.25, z, 0.1, materials.black);
      }
    }

    // Small foreground beam.
    makeBeam(-3.8, 0.2, 3.8, 0.2, 0.2, 0.5, materials.redDark);

    // -------------------------------------------------------------------------
    // Ground platform
    // -------------------------------------------------------------------------

    const ground = new THREE.Group();
    scene.add(ground);

    voxel(0, -0.55, 0, 13, materials.floor, ground);
    voxel(0, -0.95, 0, 11, materials.black, ground);

    // Subtle grid of dark floor tiles.
    for (let x = -5; x <= 5; x++) {
      for (let z = -4; z <= 4; z++) {
        voxel(
          x,
          -0.96,
          z,
          0.94,
          materials.black,
          ground
        );
      }
    }

    // -------------------------------------------------------------------------
    // Floating dust particles
    // -------------------------------------------------------------------------

    const particleCount = 420;
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 22;
      particlePositions[i * 3 + 1] = Math.random() * 14 - 1;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 22;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: 0x78b8d4,
        size: 0.035,
        transparent: true,
        opacity: 0.45,
        depthWrite: false
      })
    );
    scene.add(particles);

    // -------------------------------------------------------------------------
    // Custom camera controls
    // -------------------------------------------------------------------------

    const target = new THREE.Vector3(0, 4.2, 0);
    const spherical = new THREE.Spherical(13.8, Math.PI * 0.43, Math.PI * 0.25);
    const initialTarget = target.clone();
    const initialSpherical = spherical.clone();

    let dragging = false;
    let panning = false;
    let previousX = 0;
    let previousY = 0;

    const canvas = renderer.domElement;

    canvas.addEventListener("contextmenu", event => event.preventDefault());

    canvas.addEventListener("pointerdown", event => {
      dragging = true;
      panning = event.button === 2 || event.shiftKey;
      previousX = event.clientX;
      previousY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = panning ? "move" : "grabbing";
    });

    canvas.addEventListener("pointermove", event => {
      if (!dragging) return;

      const dx = event.clientX - previousX;
      const dy = event.clientY - previousY;
      previousX = event.clientX;
      previousY = event.clientY;

      if (panning) {
        const right = new THREE.Vector3();
        const up = new THREE.Vector3();

        camera.getWorldDirection(right);
        right.cross(camera.up).normalize();
        up.cross(right).normalize();

        const scale = spherical.radius * 0.0015;
        target.addScaledVector(right, -dx * scale);
        target.addScaledVector(up, dy * scale);
        target.lerp(initialTarget, 0.12);
      } else {
        spherical.theta -= dx * 0.006;
        spherical.phi = THREE.MathUtils.clamp(
          spherical.phi - dy * 0.005,
          0.18,
          Math.PI * 0.82
        );
      }
    });

    function endDrag(event) {
      dragging = false;
      panning = false;
      canvas.style.cursor = "grab";

      if (event && canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
    }

    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);
    canvas.addEventListener("pointerleave", event => {
      if (dragging && event.buttons === 0) endDrag(event);
    });

    canvas.addEventListener("wheel", event => {
      event.preventDefault();
      spherical.radius = THREE.MathUtils.clamp(
        spherical.radius + event.deltaY * 0.01,
        7,
        24
      );
    }, { passive: false });

    canvas.style.cursor = "grab";

    // -------------------------------------------------------------------------
    // Resize and animation
    // -------------------------------------------------------------------------

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    const clock = new THREE.Clock();

    function animate() {
      const elapsed = clock.getElapsedTime();

      particles.rotation.y = elapsed * 0.012;
      particles.position.y = Math.sin(elapsed * 0.22) * 0.12;

      redLight.intensity = 17 + Math.sin(elapsed * 2.1) * 2.5;
      cyanLight.intensity = 9 + Math.sin(elapsed * 1.7 + 1) * 2;

      camera.position.setFromSpherical(spherical).add(target);
      camera.lookAt(target);

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
    relic: { id: "generic", name: "Donkey Kong Relic", x: -10.0, z: -12.0 },
    env:   { background: 0x020408, fogColor: 0x020408, fogDensity: 0.035 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 },
      east: { x: 12.0, z: 10.0 },
      west: { x: -12.0, z: -10.0 }
    }
  };
}

// @world {"id": "1080", "title": "Silent Hill 3", "sub": "The Cathedral", "system": "3D Render"}
// Converted from 1080-silent_hill_3_the_cathedral.html into a Back Roms World Walker module.

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

    

    container = dummyEl();

    // scene redirect
    scene.background = new THREE.Color(0x100c12);
    scene.fog = new THREE.FogExp2(0x17111a, 0.017);

    camera = dummyCamera();

    renderer = dummyRenderer();
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    container.appendChild(renderer.domElement);

    // ---------------------------------------------------------------------
    // Shared voxel palette
    // ---------------------------------------------------------------------
    const M = {
      floor: 0x514038,
      floorDark: 0x302723,
      floorLight: 0x655044,
      wall: 0x493936,
      wallDark: 0x302727,
      wallLight: 0x5a4640,
      stone: 0x68574b,
      stoneDark: 0x493b34,
      stoneLight: 0x7d6956,
      wood: 0x4a2c22,
      woodDark: 0x2d1713,
      woodLight: 0x6b3c28,
      gold: 0xc59a45,
      goldDark: 0x75531e,
      red: 0x6c1719,
      blue: 0x183546,
      green: 0x244535,
      ivory: 0xd5c49a,
      black: 0x111013
    };

    const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
    const allMaterials = [];

    function material(color, options = {}) {
      const key = color + JSON.stringify(options);
      if (!allMaterials[key]) {
        const mat = new THREE.MeshStandardMaterial({
          color,
          roughness: 0.88,
          metalness: 0.02,
          ...options
        });
        allMaterials[key] = mat;
      }
      return allMaterials[key];
    }

    function voxel(x, y, z, color, sx = 1, sy = 1, sz = 1, opts = {}) {
      const mesh = new THREE.Mesh(cubeGeo, material(color, opts));
      mesh.position.set(x, y, z);
      mesh.scale.set(sx, sy, sz);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      return mesh;
    }

    function blockBox(x, y, z, w, h, d, color, opts = {}) {
      const mesh = new THREE.Mesh(cubeGeo, material(color, opts));
      mesh.position.set(x, y, z);
      mesh.scale.set(w, h, d);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      return mesh;
    }

    // ---------------------------------------------------------------------
    // Lighting
    // ---------------------------------------------------------------------
    scene.add(new THREE.HemisphereLight(0x8c7760, 0x161017, 1.15));

    const sun = new THREE.DirectionalLight(0xffd28a, 3.2);
    sun.position.set(-12, 18, 7);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -18;
    sun.shadow.camera.right = 18;
    sun.shadow.camera.top = 18;
    sun.shadow.camera.bottom = -18;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 60;
    sun.shadow.bias = -0.0004;
    scene.add(sun);

    const altarLight = new THREE.PointLight(0xffb45c, 32, 22, 2);
    altarLight.position.set(0, 5.2, -10.5);
    scene.add(altarLight);

    const warmFill = new THREE.PointLight(0xb86c32, 14, 28, 2);
    warmFill.position.set(0, 3.2, 2);
    scene.add(warmFill);

    // ---------------------------------------------------------------------
    // Materials helpers
    // ---------------------------------------------------------------------
    const mat = (c, o = {}) => material(c, o);

    // ---------------------------------------------------------------------
    // Floor: broad central carpet, side stone floors, aisle details
    // ---------------------------------------------------------------------
    blockBox(0, 0.12, 0, 19, 0.24, 39, M.floorDark, { roughness: 0.95 });

    for (let z = -18; z <= 18; z += 1.5) {
      voxel(0, 0.27, z, z % 3 === 0 ? M.floor : M.floorLight, 0.08, 0.08, 1.45);
    }

    for (let x = -8.5; x <= 8.5; x += 1.5) {
      voxel(x, 0.28, 0, x % 2 === 0 ? M.floor : M.floorDark, 1.45, 0.08, 0.08);
    }

    for (let z = -16; z <= 16; z += 2) {
      voxel(-7.7, 0.31, z, M.stoneDark, 0.12, 0.12, 0.85);
      voxel(7.7, 0.31, z, M.stoneDark, 0.12, 0.12, 0.85);
    }

    // ---------------------------------------------------------------------
    // Side walls and lower wall panels
    // ---------------------------------------------------------------------
    for (const side of [-1, 1]) {
      blockBox(side * 10.2, 1.25, 0, 0.8, 2.5, 38, M.wallDark);
      blockBox(side * 10.2, 3.15, 0, 0.65, 0.65, 38, M.wall);

      for (let z = -18; z <= 18; z += 2) {
        voxel(side * 10.2, 0.35, z, M.stoneDark, 0.35, 0.35, 1.95);
      }

      for (let z = -17; z <= 17; z += 4) {
        blockBox(side * 9.7, 0.75, z, 0.35, 1.2, 1.55, M.wallDark);
      }
    }

    // ---------------------------------------------------------------------
    // Arches and columns, built as stacked cubes
    // ---------------------------------------------------------------------
    const columnWidth = 0.72;
    const archDepth = 1.15;
    const archRise = 4.2;
    const bayDepth = 4.5;

    function column(x, z) {
      const baseY = 0.42;
      voxel(x, baseY, z, M.stoneDark, 1.45, 0.35, 1.45);
      voxel(x, baseY + 0.22, z, M.stoneLight, 1.15, 0.44, 1.15);

      for (let y = 0.75; y < 4.8; y += 0.55) {
        voxel(x, y, z, y % 1.1 === 0 ? M.stone : M.stoneDark, 0.82, 0.5, 0.82);
      }

      voxel(x, 4.78, z, M.stoneLight, 1.15, 0.38, 1.15);
      voxel(x, 5.05, z, M.stoneDark, 1.35, 0.28, 1.35);
    }

    function arch(x, z, direction = 1) {
      // The arch is assembled from stepped voxel blocks.
      const left = x - 2.15;
      const right = x + 2.15;
      const springY = 4.9;

      for (let i = 0; i < 7; i++) {
        const t = i / 6;
        const y = springY + 4.25 * Math.sin(t * Math.PI * 0.5);
        const halfWidth = 2.15 * Math.cos(t * Math.PI * 0.5);

        for (let j = -1; j <= 1; j++) {
          voxel(
            left + direction * halfWidth + j * 0.48,
            y,
            z,
            i % 2 ? M.stone : M.stoneDark,
            0.46,
            0.46,
            0.55
          );
        }
      }

      for (let i = 0; i < 4; i++) {
        const t = i / 3;
        const y = springY + 4.25 * Math.sin(t * Math.PI * 0.5);
        const halfWidth = 2.15 * Math.cos(t * Math.PI * 0.5);

        for (let j = -1; j <= 1; j++) {
          voxel(
            left + direction * halfWidth + j * 0.48,
            y,
            z,
            i % 2 ? M.stone : M.stoneDark,
            0.46,
            0.46,
            0.55
          );
        }
      }
    }

    for (let z = -15; z <= 15; z += bayDepth) {
      column(-7.55, z);
      column(7.55, z);
      arch(-7.55, z, -1);
      arch(7.55, z, 1);
    }

    // Higher arches frame the apse.
    for (const z of [-15, -10.5, -6, -1.5, 3, 7.5, 12]) {
      column(-7.55, z);
      column(7.55, z);
      arch(-7.55, z, -1);
      arch(7.55, z, 1);
    }

    // ---------------------------------------------------------------------
    // Ceiling ribs
    // ---------------------------------------------------------------------
    for (let z = -15; z <= 15; z += bayDepth) {
      for (const x of [-7.55, 0, 7.55]) {
        for (let y = 4.95; y < 10.5; y += 0.65) {
          voxel(x, y, z, y % 1.3 === 0 ? M.stoneLight : M.stone, 0.72, 0.6, 0.72);
        }
      }

      for (let x = -7.55; x <= 7.55; x += 2.5) {
        const t = (x + 7.55) / 15.1;
        const y = 4.95 + 5.55 * (1 - Math.pow(t, 2));
        voxel(x, y, z, M.stoneLight, 0.72, 0.6, 0.72);
      }
    }

    // ---------------------------------------------------------------------
    // Wooden pews
    // ---------------------------------------------------------------------
    function pew(x, z, rotation = 0) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      group.rotation.y = rotation;

      const seatMat = mat(M.wood);
      const backMat = mat(M.woodDark);
      const trimMat = mat(M.woodLight);

      const seat = new THREE.Mesh(cubeGeo, seatMat);
      seat.scale.set(3.25, 0.28, 0.95);
      seat.position.y = 0.73;
      seat.castShadow = true;
      seat.receiveShadow = true;
      group.add(seat);

      const back = new THREE.Mesh(cubeGeo, backMat);
      back.scale.set(3.25, 1.25, 0.25);
      back.position.set(0, 1.34, 0.38);
      back.castShadow = true;
      back.receiveShadow = true;
      group.add(back);

      for (const px of [-1.42, 1.42]) {
        const leg = new THREE.Mesh(cubeGeo, trimMat);
        leg.scale.set(0.22, 0.72, 0.72);
        leg.position.set(px, 0.36, 0);
        leg.castShadow = true;
        group.add(leg);
      }

      scene.add(group);
    }

    for (let z = -13.5; z <= 12.5; z += 2.25) {
      pew(-4.85, z);
      pew(4.85, z);
    }

    // ---------------------------------------------------------------------
    // Wall paintings: small framed voxel art
    // ---------------------------------------------------------------------
    function painting(side, z, index) {
      const x = side * 9.65;
      const y = 3.05;

      blockBox(x, y, z, 1.45, 2.05, 0.18, M.woodDark);
      blockBox(x, y, z + side * 0.12, 1.15, 1.72, 0.12, M.goldDark);

      const artMat = mat(index % 3 === 0 ? M.red : index % 3 === 1 ? M.blue : M.green);
      blockBox(x, y, z + side * 0.23, 0.92, 1.45, 0.08, artMat);

      for (let i = 0; i < 5; i++) {
        voxel(
          x + (index % 2 ? -0.16 : 0.16),
          y + 0.48 + i * 0.25,
          z + side * 0.29,
          i % 2 ? M.ivory : artMat,
          0.23,
          0.13,
          0.06
        );
      }
    }

    for (let z = -16; z <= 16; z += 4) {
      painting(-1, z, 0);
      painting(1, z, 1);
    }

    // ---------------------------------------------------------------------
    // Altar and apse
    // ---------------------------------------------------------------------
    blockBox(0, 2.5, -12.2, 4.2, 2.2, 2.0, M.woodDark);
    blockBox(0, 3.75, -12.2, 3.55, 0.3, 1.5, M.woodLight);
    blockBox(0, 4.15, -12.2, 2.7, 0.18, 1.1, M.gold);
    blockBox(0, 4.38, -12.2, 1.8, 0.65, 0.8, M.ivory);

    // Altar candles
    for (const x of [-0.65, 0.65]) {
      voxel(x, 4.72, -12.15, M.ivory, 0.12, 0.55, 0.12);
      voxel(x, 5.08, -12.15, M.gold, 0.17, 0.1, 0.17);
    }

    // Apse wall and rounded-looking stepped arch
    blockBox(0, 3.1, -17.3, 17.2, 6.2, 1.2, M.wall);
    blockBox(0, 6.35, -17.3, 15.8, 0.5, 1.05, M.wallLight);

    for (let i = 0; i < 8; i++) {
      const t = i / 7;
      const x = -7.3 + 14.6 * t;
      const y = 6.95 + 1.65 * Math.sin(t * Math.PI * 0.5);
      voxel(x, y, -17.2, M.stoneLight, 1.05, 0.65, 0.9);
    }

    // ---------------------------------------------------------------------
    // Stained-glass windows
    // ---------------------------------------------------------------------
    function stainedWindow(x, z, colors, centerIndex = 1) {
      blockBox(x, 6.2, z, 3.4, 5.3, 0.35, M.woodDark);

      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 7; col++) {
          const panel = mat(
            colors[(row + col) % colors.length],
            { roughness: 0.55, metalness: 0.08 }
          );
          voxel(
            x - 1.4 + col * 0.47,
            5.65 + row * 1.05,
            z + 0.22,
            panel,
            0.42,
            0.98,
            0.18
          );
        }
      }

      for (let col = 0; col < 7; col++) {
        voxel(
          x - 1.4 + col * 0.47,
          8.65,
          z + 0.25,
          M.gold,
          0.43,
          0.35,
          0.25
        );
      }

      voxel(x, 6.2, z + 0.34, M.ivory, 0.42, 1.4, 0.15);
    }

    stainedWindow(-4.55, -16.4, [M.red, M.gold, M.blue, M.green, M.red]);
    stainedWindow(0, -16.45, [M.gold, M.red, M.blue, M.green, M.gold], 2);
    stainedWindow(4.55, -16.4, [M.red, M.gold, M.blue, M.green, M.red]);

    // ---------------------------------------------------------------------
    // Hanging lanterns
    // ---------------------------------------------------------------------
    function lantern(x, y, z, color = 0xffb55d) {
      const group = new THREE.Group();
      group.position.set(x, y, z);

      const chain = new THREE.Mesh(cubeGeo, mat(M.goldDark));
      chain.scale.set(0.045, 0.75, 0.045);
      chain.position.y = 0.35;
      group.add(chain);

      const glassMat = mat(color, {
        roughness: 0.3,
        metalness: 0.15,
        emissive: color,
        emissiveIntensity: 0.45
      });

      const glass = new THREE.Mesh(cubeGeo, glassMat);
      glass.scale.set(0.42, 0.78, 0.42);
      glass.position.y = -0.02;
      glass.castShadow = false;
      group.add(glass);

      const top = new THREE.Mesh(cubeGeo, mat(M.gold));
      top.scale.set(0.62, 0.18, 0.62);
      top.position.y = 0.46;
      group.add(top);

      const bottom = new THREE.Mesh(cubeGeo, mat(M.gold));
      bottom.scale.set(0.48, 0.12, 0.48);
      bottom.position.y = -0.48;
      group.add(bottom);

      scene.add(group);
    }

    for (const z of [-12, -6, 0, 6, 12]) {
      lantern(0, 9.35, z);
    }

    // ---------------------------------------------------------------------
    // Dust motes
    // ---------------------------------------------------------------------
    const moteMat = new THREE.MeshBasicMaterial({
      color: 0xffd99a,
      transparent: true,
      opacity: 0.35,
      depthWrite: false
    });

    const motes = [];
    for (let i = 0; i < 120; i++) {
      const x = (Math.random() - 0.5) * 18;
      const y = 0.6 + Math.random() * 9;
      const z = (Math.random() - 0.5) * 34;
      const size = 0.025 + Math.random() * 0.055;
      const mote = new THREE.Mesh(cubeGeo, moteMat);
      mote.position.set(x, y, z);
      mote.scale.setScalar(size);
      scene.add(mote);
      motes.push({
        mesh: mote,
        speed: 0.08 + Math.random() * 0.12,
        phase: Math.random() * Math.PI * 2
      });
    }

    // ---------------------------------------------------------------------
    // Camera controls implemented directly
    // ---------------------------------------------------------------------
    const yaw = 0;
    const pitch = 0.03;
    const cameraTarget = new THREE.Vector3(0, 3, -11);
    const cameraPosition = new THREE.Vector3(0, 3.15, 18);

    function updateCamera() {
      camera.position.set(
        cameraTarget.x + Math.sin(yaw) * 1.1,
        cameraTarget.y + Math.sin(pitch) * 1.1,
        cameraTarget.z + Math.cos(yaw) * 1.1
      );
      camera.lookAt(cameraTarget);
    }

    updateCamera();

    const keys = new Set();
    let moving = false;
    let walkSpeed = 0;
    const start = performance.now();

    addEventListener("keydown", e => {
      keys.add(e.key.toLowerCase());
      if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
      }
    });

    addEventListener("keyup", e => {
      keys.delete(e.key.toLowerCase());
    });

    addEventListener("wheel", e => {
      e.preventDefault();
      moving = true;
      walkSpeed = Math.min(walkSpeed + 0.015, 1.8);
    }, { passive: false });

    addEventListener("blur", () => {
      moving = false;
      walkSpeed = 0;
    });

    function animate(now) {
      const dt = Math.min((now - start) / 1000, 0.05);
      const time = now * 0.001;

      if (moving) {
        const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
        const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
        const speed = walkSpeed * dt;

        if (keys.has("w") || keys.has("arrowup")) cameraTarget.addScaledVector(forward, speed);
        if (keys.has("s") || keys.has("arrowdown")) cameraTarget.addScaledVector(forward, -speed);
        if (keys.has("a") || keys.has("arrowleft")) cameraTarget.addScaledVector(right, -speed);
        if (keys.has("d") || keys.has("arrowright")) cameraTarget.addScaledVector(right, speed);

        cameraTarget.x = THREE.MathUtils.clamp(cameraTarget.x, -12, 12);
        cameraTarget.z = THREE.MathUtils.clamp(cameraTarget.z, -19, 16);
        cameraTarget.y = THREE.MathUtils.clamp(cameraTarget.y, 1.1, 8.5);
      }

      yaw += (keys.has("left") ? -1 : keys.has("right") ? 1 : 0) * 0.008;
      pitch += (keys.has("up") ? 1 : keys.has("down") ? -1 : 0) * 0.006;
      pitch = THREE.MathUtils.clamp(pitch, -0.75, 0.8);

      updateCamera();

      for (const mote of motes) {
        mote.mesh.position.y += mote.speed * dt;
        mote.mesh.rotation.x += dt * 0.25;
        mote.mesh.rotation.y += dt * 0.15;
        if (mote.mesh.position.y > 10) {
          mote.mesh.position.y = 0.4;
        }
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    });

    requestAnimationFrame(animate);
  

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
    relic: { id: "generic", name: "Silent Hill 3 Relic", x: -10.0, z: -12.0 },
    env:   { background: 0x100c12, fogColor: 0x17111a, fogDensity: 0.017 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 },
      east: { x: 12.0, z: 10.0 },
      west: { x: -12.0, z: -10.0 }
    }
  };
}

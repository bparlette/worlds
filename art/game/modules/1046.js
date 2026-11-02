// @world {"id": "1046", "title": "Hollow Knight", "sub": "The Knight's Shell Cavern", "system": "3D Render"}
// Converted from 1046-hollow_knight_the_knightx27s_shell_cavern.html into a Back Roms World Walker module.

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
  // (strict modules throw where sloppy scripts did not): zoom
  let zoom = 0;

    

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
    scene.background = new THREE.Color(0x050812);
    scene.fog = new THREE.FogExp2(0x050812, 0.035);

    camera = dummyCamera();

    // -------------------------------------------------------------------------
    // Direct camera controls: orbit, zoom, and touch
    // -------------------------------------------------------------------------

    const controls = {
      target: new THREE.Vector3(0, 1.65, 0),
      radius: 11.8,
      theta: 0.34,
      phi: 1.18,
      minRadius: 6.2,
      maxRadius: 19,
      minPhi: 0.45,
      maxPhi: 1.48,
      dragging: false,
      previousX: 0,
      previousY: 0
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

    updateCamera();

    renderer.domElement.addEventListener("pointerdown", (event) => {
      controls.dragging = true;
      controls.previousX = event.clientX;
      controls.previousY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
    });

    renderer.domElement.addEventListener("pointermove", (event) => {
      if (!controls.dragging) return;

      const dx = event.clientX - controls.previousX;
      const dy = event.clientY - controls.previousY;

      controls.previousX = event.clientX;
      controls.previousY = event.clientY;

      controls.theta -= dx * 0.006;
      controls.phi = THREE.MathUtils.clamp(
        controls.phi - dy * 0.005,
        controls.minPhi,
        controls.maxPhi
      );

      updateCamera();
    });

    function endDrag(event) {
      controls.dragging = false;
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
        controls.radius = THREE.MathUtils.clamp(
          controls.radius + event.deltaY * 0.008,
          controls.minRadius,
          controls.maxRadius
        );
        updateCamera();
      },
      { passive: false }
    );

    // -------------------------------------------------------------------------
    // Materials
    // -------------------------------------------------------------------------

    const materials = {
      shell: new THREE.MeshStandardMaterial({
        color: 0x172c3c,
        roughness: 0.58,
        metalness: 0.18
      }),
      shellLight: new THREE.MeshStandardMaterial({
        color: 0x4a6578,
        roughness: 0.48,
        metalness: 0.22
      }),
      shellDark: new THREE.MeshStandardMaterial({
        color: 0x09141f,
        roughness: 0.72,
        metalness: 0.1
      }),
      horn: new THREE.MeshStandardMaterial({
        color: 0xe3e8e8,
        roughness: 0.48,
        metalness: 0.06
      }),
      hair: new THREE.MeshStandardMaterial({
        color: 0x172a42,
        roughness: 0.78,
        metalness: 0.03
      }),
      hairLight: new THREE.MeshStandardMaterial({
        color: 0x436183,
        roughness: 0.72
      }),
      eye: new THREE.MeshStandardMaterial({
        color: 0x010307,
        roughness: 0.2,
        metalness: 0.5
      }),
      coral: new THREE.MeshStandardMaterial({
        color: 0xe36a3d,
        roughness: 0.72
      }),
      coralDark: new THREE.MeshStandardMaterial({
        color: 0x6f2b28,
        roughness: 0.85
      }),
      coralBlue: new THREE.MeshStandardMaterial({
        color: 0x3596a8,
        roughness: 0.72
      }),
      coralLight: new THREE.MeshStandardMaterial({
        color: 0x77d9d2,
        roughness: 0.65
      }),
      candle: new THREE.MeshStandardMaterial({
        color: 0xe4dfc9,
        roughness: 0.82
      }),
      flame: new THREE.MeshBasicMaterial({
        color: 0xff9a32
      }),
      flameBlue: new THREE.MeshBasicMaterial({
        color: 0x65b9ff
      }),
      stone: new THREE.MeshStandardMaterial({
        color: 0x263746,
        roughness: 0.9
      }),
      stoneLight: new THREE.MeshStandardMaterial({
        color: 0x536b7c,
        roughness: 0.88
      })
    };

    // -------------------------------------------------------------------------
    // Voxel helpers
    // -------------------------------------------------------------------------

    const voxelGeometry = new THREE.BoxGeometry(0.42, 0.42, 0.42);

    function addVoxel(parent, x, y, z, material, sx = 1, sy = 1, sz = 1) {
      const voxel = new THREE.Mesh(voxelGeometry, material);
      voxel.position.set(x, y, z);
      voxel.scale.set(sx, sy, sz);
      voxel.castShadow = true;
      voxel.receiveShadow = true;
      parent.add(voxel);
      return voxel;
    }

    function voxelColumn(parent, x, y, z, material, count, spacing = 0.42) {
      for (let i = 0; i < count; i++) {
        addVoxel(
          parent,
          x,
          y + i * spacing,
          z,
          material
        );
      }
    }

    function voxelSphere(parent, x, y, z, material, radius = 1) {
      const shell = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 10, 7),
        material
      );
      shell.position.set(x, y, z);
      shell.castShadow = true;
      shell.receiveShadow = true;
      parent.add(shell);
      return shell;
    }

    // -------------------------------------------------------------------------
    // Sanctuary shell / backdrop
    // -------------------------------------------------------------------------

    const sanctuary = new THREE.Group();
    scene.add(sanctuary);

    // Large shell interior.
    const shellOuter = new THREE.Mesh(
      new THREE.SphereGeometry(6.2, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      materials.shell
    );
    shellOuter.position.y = 0.2;
    shellOuter.scale.set(1, 0.82, 1);
    shellOuter.castShadow = true;
    shellOuter.receiveShadow = true;
    sanctuary.add(shellOuter);

    // Shell rim made from segmented voxels.
    const rimSegments = 32;
    const rimStart = 0.38;

    for (let i = 0; i < rimSegments; i++) {
      const angle = (i / rimSegments) * Math.PI * 2;
      const x = Math.cos(angle) * 5.95;
      const z = Math.sin(angle) * 5.95;
      const y = 0.25 + Math.sin(angle * 2) * 0.12;

      addVoxel(sanctuary, x, y, z, materials.shellDark, 0.65, 0.7, 0.65);

      // Inner rim tiles.
      addVoxel(
        sanctuary,
        x * 0.89,
        y + 0.18,
        z * 0.89,
        i % 4 === 0 ? materials.shellLight : materials.shell
      );
    }

    // Upper shell roof.
    voxelColumn(sanctuary, 0, 5.75, 0, materials.shellDark, 5, 0.48);
    addVoxel(sanctuary, 0, 6.35, 0, materials.shellLight);

    // Central shell spiral, built as stacked voxel rings.
    const spiral = new THREE.Group();
    sanctuary.add(spiral);

    for (let layer = 0; layer < 10; layer++) {
      const radius = 1.15 + layer * 0.19;
      const y = 2.15 + layer * 0.34;

      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        const material = layer % 3 === 0
          ? materials.shellLight
          : layer % 2 === 0
            ? materials.shell
            : materials.shellDark;

        addVoxel(spiral, x, y, z, material, 0.76, 0.72, 0.76);
      }
    }

    // Spiral center and rim.
    voxelSphere(spiral, 0, 3.05, 0, materials.shellLight, 0.68);
    addVoxel(spiral, 0, 3.72, 0, materials.shellDark);

    // -------------------------------------------------------------------------
    // Knight figure
    // -------------------------------------------------------------------------

    const knight = new THREE.Group();
    sanctuary.add(knight);

    // Body.
    addVoxel(knight, 0, 1.2, 0, materials.hair, 0.72, 1.05, 0.62);
    addVoxel(knight, 0, 1.72, 0, materials.horn, 0.58, 0.68, 0.55);

    // Horns.
    const leftHorn = new THREE.Group();
    const rightHorn = new THREE.Group();
    knight.add(leftHorn, rightHorn);

    for (let i = 0; i < 6; i++) {
      const t = i / 6;
      const x = leftHorn === 0
        ? -0.3 - t * 0.36
        : 0.3 + t * 0.36;

      const y = 2.05 - t * 0.48;
      const z = t * 0.22;

      addVoxel(
        i === 0 ? leftHorn : rightHorn,
        x,
        y,
        z,
        materials.horn,
        0.24,
        0.36,
        0.24
      );
    }

    // Face.
    addVoxel(knight, 0, 2.22, 0.3, materials.horn, 0.95, 0.58, 0.34);
    addVoxel(knight, -0.24, 2.18, 0.42, materials.eye, 0.25, 0.25, 0.14);
    addVoxel(knight, 0.24, 2.18, 0.42, materials.eye, 0.25, 0.25, 0.14);

    // Hair mask / fringe.
    for (let i = 0; i < 9; i++) {
      const x = -0.36 + i * 0.18;
      const y = 1.95 - Math.abs(i - 4) * 0.045;
      addVoxel(knight, x, y, 0.31, materials.hair, 0.16, 0.34, 0.18);
    }

    // Hair sides.
    for (let i = 0; i < 5; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const y = 1.65 + i * 0.28;

      addVoxel(
        knight,
        side * (0.45 + (i % 3) * 0.08),
        y,
        0.18,
        i % 2 === 0 ? materials.hair : materials.hairLight,
        0.2,
        0.42,
        0.2
      );
    }

    // Hair back.
    for (let i = 0; i < 7; i++) {
      addVoxel(
        knight,
        0,
        2.95 - i * 0.2,
        -0.22 - i * 0.025,
        i % 2 === 0 ? materials.hair : materials.hairLight,
        0.3,
        0.38,
        0.25
      );
    }

    // Arms and gauntlets.
    const leftArm = new THREE.Group();
    const rightArm = new THREE.Group();
    knight.add(leftArm, rightArm);

    for (let i = 0; i < 4; i++) {
      const t = i / 4;
      addVoxel(
        leftArm,
        -0.56 - t * 0.25,
        1.35 - t * 0.25,
        0,
        materials.hair,
        0.23,
        0.36,
        0.25
      );

      addVoxel(
        rightArm,
        0.56 + t * 0.25,
        1.35 - t * 0.25,
        0,
        materials.hair,
        0.23,
        0.36,
        0.25
      );
    }

    addVoxel(leftArm, -0.88, 0.82, 0, materials.shellLight, 0.36, 0.5, 0.4);
    addVoxel(rightArm, 0.88, 0.82, 0, materials.shellLight, 0.36, 0.5, 0.4);

    // Spear.
    const spear = new THREE.Group();
    spear.rotation.z = -0.12;
    knight.add(spear);

    voxelColumn(spear, 0.83, 1.45, 0.05, materials.candle, 7, 0.32);
    addVoxel(spear, 0.83, 2.25, 0.05, materials.shellLight, 0.22, 0.7, 0.22);
    addVoxel(spear, 0.83, 2.7, 0.05, materials.shellDark, 0.18, 0.42, 0.18);

    // Spear tip.
    addVoxel(spear, 0.83, 3.02, 0.05, materials.horn, 0.2, 0.2, 0.2);

    // -------------------------------------------------------------------------
    // Candle altar and surrounding crystals
    // -------------------------------------------------------------------------

    const altar = new THREE.Group();
    sanctuary.add(altar);

    // Altar base.
    voxelColumn(altar, 0, 0.55, 0.8, materials.stone, 4, 0.48);
    voxelColumn(altar, 0, 1.05, 0.8, materials.stoneLight, 3, 0.48);

    // Main candle.
    voxelColumn(altar, 0, 1.65, 0.8, materials.candle, 7, 0.38);
    addVoxel(altar, 0, 2.35, 0.8, materials.candle, 0.55, 0.34, 0.55);

    const leftFlame = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 8, 6),
      materials.flame
    );
    leftFlame.scale.set(0.65, 1.45, 0.65);
    leftFlame.position.set(-0.08, 2.58, 0.8);
    altar.add(leftFlame);

    const rightFlame = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 8, 6),
      materials.flameBlue
    );
    rightFlame.scale.set(0.55, 1.3, 0.55);
    rightFlame.position.set(0.1, 2.53, 0.8);
    altar.add(rightFlame);

    // Crystal clusters.
    function crystalCluster(parent, x, y, z, count, material, scale = 1) {
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + Math.sin(i * 2.1) * 0.3;
        const radius = 0.25 + (i % 3) * 0.22;
        const height = 0.65 + (i % 4) * 0.2;

        addVoxel(
          parent,
          x + Math.cos(angle) * radius,
          y + height * 0.5 * scale,
          z + Math.sin(angle) * radius,
          material,
          0.3 * scale,
          height * scale,
          0.3 * scale
        );
      }
    }

    crystalCluster(altar, -1.25, 0.8, 0.35, 6, materials.coral, 1.1);
    crystalCluster(altar, 1.25, 0.8, 0.35, 5, materials.coralBlue, 0.95);
    crystalCluster(altar, -1.3, 0.8, -0.9, 5, materials.coralDark, 0.85);
    crystalCluster(altar, 1.3, 0.8, -0.9, 4, materials.coral, 0.8);

    // -------------------------------------------------------------------------
    // Coral and sea-like foreground
    // -------------------------------------------------------------------------

    const foreground = new THREE.Group();
    sanctuary.add(foreground);

    // Main mound.
    voxelSphere(foreground, 0, 0.2, 0.2, materials.stone, 3.2);
    voxelSphere(foreground, 0, 0.7, 0.1, materials.stoneLight, 2.2);

    // Muddy foreground with glowing nodules.
    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2;
      const radius = 2.2 + (i % 4) * 0.25;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      if (Math.abs(x) < 1.8 && Math.abs(z) < 1.8) continue;

      const material = i % 3 === 0
        ? materials.coralLight
        : i % 2 === 0
          ? materials.coral
          : materials.coralDark;

      const nodule = voxelSphere(
        foreground,
        x,
        0.35 + (i % 3) * 0.08,
        z,
        material,
        0.3 + (i % 2) * 0.08
      );

      nodule.scale.y = 0.75 + (i % 3) * 0.18;
    }

    // Curved coral formations.
    function curvedCoral(parent, x, z, material, height, direction = 1) {
      const group = new THREE.Group();
      group.position.set(x, 0.35, z);
      parent.add(group);

      for (let i = 0; i < 8; i++) {
        const t = i / 7;
        const y = t * height;
        const px = direction * (0.25 + t * 0.6);
        const pz = Math.sin(t * Math.PI) * 0.3;

        addVoxel(
          group,
          px,
          y,
          pz,
          material,
          0.23,
          0.28,
          0.23
        );
      }

      addVoxel(
        group,
        direction * 0.9,
        height,
        0,
        material,
        0.3,
        0.28,
        0.3
      );
    }

    curvedCoral(foreground, -2.1, 0.4, materials.coralBlue, 1.4, -1);
    curvedCoral(foreground, 2.1, 0.5, materials.coral, 1.2, 1);
    curvedCoral(foreground, -2.2, -0.7, materials.coralDark, 1.1, -1);
    curvedCoral(foreground, 2.2, -0.6, materials.coralLight, 1.3, 1);

    // Small background sea creatures.
    function bubbleColumn(parent, x, z, count, material) {
      for (let i = 0; i < count; i++) {
        addVoxel(
          parent,
          x + Math.sin(i * 0.7) * 0.12,
          0.45 + i * 0.32,
          z,
          material,
          0.2,
          0.2,
          0.2
        );
      }
    }

    bubbleColumn(sanctuary, -3.2, 1.4, 6, materials.coralLight);
    bubbleColumn(sanctuary, 3.2, -1.5, 5, materials.coralBlue);

    // -------------------------------------------------------------------------
    // Floating light particles
    // -------------------------------------------------------------------------

    const particles = new THREE.Group();
    scene.add(particles);

    const particleMaterial = new THREE.MeshBasicMaterial({
      color: 0xffc46b,
      transparent: true,
      opacity: 0.75
    });

    for (let i = 0; i < 34; i++) {
      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.055, 6, 4),
        particleMaterial
      );

      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 5;

      particle.position.set(
        Math.cos(angle) * radius,
        0.5 + Math.random() * 5.5,
        Math.sin(angle) * radius
      );

      particle.userData.speed = 0.18 + Math.random() * 0.25;
      particle.userData.angle = angle;
      particle.userData.radius = radius;
      particles.add(particle);
    }

    // -------------------------------------------------------------------------
    // Lighting
    // -------------------------------------------------------------------------

    scene.add(new THREE.HemisphereLight(0x789bc9, 0x160b12, 1.15));

    const keyLight = new THREE.SpotLight(
      0xffd39a,
      95,
      25,
      Math.PI / 5,
      0.6,
      1.4
    );
    keyLight.position.set(4.5, 8, 4);
    keyLight.target.position.set(0, 1.5, 0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.bias = -0.0004;
    scene.add(keyLight, keyLight.target);

    const rimLight = new THREE.PointLight(0x3b8cff, 45, 18, 2);
    rimLight.position.set(-4, 3.5, 3);
    scene.add(rimLight);

    const warmLight = new THREE.PointLight(0xff6b2f, 32, 14, 2);
    warmLight.position.set(4, 1.5, -2);
    scene.add(warmLight);

    const frontFill = new THREE.PointLight(0x7da9ff, 22, 15, 2);
    frontFill.position.set(0, 3, 7);
    scene.add(frontFill);

    // -------------------------------------------------------------------------
    // Animation
    // -------------------------------------------------------------------------

    const clock = new THREE.Clock();

    function animate() {
      const elapsed = clock.getElapsedTime();

      // Gentle candle flicker.
      leftFlame.scale.y = 1.35 + Math.sin(elapsed * 8.5) * 0.12;
      rightFlame.scale.y = 1.25 + Math.sin(elapsed * 7.2 + 1.4) * 0.1;

      // Slow floating particles.
      for (const particle of particles.children) {
        const data = particle.userData;
        particle.position.y += data.speed * 0.012;
        particle.rotation.y += 0.003;

        if (particle.position.y > 6.2) {
          particle.position.y = 0.2;
        }
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    animate();

    // -------------------------------------------------------------------------
    // Resize handling
    // -------------------------------------------------------------------------

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
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
    relic: { id: "generic", name: "Hollow Knight Relic", x: -10.0, z: -12.0 },
    env:   { background: 0x050812, fogColor: 0x050812, fogDensity: 0.035 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 },
      east: { x: 12.0, z: 10.0 },
      west: { x: -12.0, z: -10.0 }
    }
  };
}

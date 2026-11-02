// @world {"id": "018", "title": "DuckTales", "sub": "Scrooge&#x27;s Money Bin", "system": "Console"}
// Converted from  into a Back Roms World Walker module.

import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js";

export function createWorld(THREE) {
  const group = new THREE.Group();

  let scene = {
    add: (...objs) => objs.forEach(o => o && group.add(o)),
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
      render: () => {}
    };
  }

  function dummyCamera() {
    return {
      position: (() => { const v = { set: () => v, copy: () => v, add: () => v, sub: () => v, addScaledVector: () => v, clone: () => v }; return v; })(),
      lookAt: () => {},
      updateProjectionMatrix: () => {}
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
  const container = dummyEl();
  const stage = dummyEl();
  const app = dummyEl();
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

    // scene redirect
    scene.background = new THREE.Color(0xb9c9d4);
    scene.fog = new THREE.Fog(0xb9c9d4, 15, 30);

    camera = dummyCamera();

    renderer = dummyRenderer();

    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    

    // -------------------------------------------------------------------------
    // Lighting
    // -------------------------------------------------------------------------

    scene.add(new THREE.HemisphereLight(0xeaf5ff, 0x67706b, 2.1));

    const keyLight = new THREE.DirectionalLight(0xfff2d6, 4.2);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.camera.left = -7;
    keyLight.shadow.camera.right = 7;
    keyLight.shadow.camera.top = 7;
    keyLight.shadow.camera.bottom = -7;
    keyLight.shadow.bias = -0.0008;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xb9d9ff, 2.4);
    rimLight.position.set(-6, 3, -7);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xffd89a, 1.8, 12);
    fillLight.position.set(1, 2, 5);
    scene.add(fillLight);

    // -------------------------------------------------------------------------
    // Materials
    // -------------------------------------------------------------------------

    const materials = {
      box: new THREE.MeshStandardMaterial({
        color: 0xf1eee6,
        roughness: 0.86,
        metalness: 0.02
      }),
      trim: new THREE.MeshStandardMaterial({
        color: 0xe5e2d8,
        roughness: 0.9
      }),
      dark: new THREE.MeshStandardMaterial({
        color: 0x343b3f,
        roughness: 0.72
      }),
      gold: new THREE.MeshStandardMaterial({
        color: 0xd7a63c,
        roughness: 0.3,
        metalness: 0.68
      }),
      goldDark: new THREE.MeshStandardMaterial({
        color: 0x9b6b1d,
        roughness: 0.42,
        metalness: 0.55
      }),
      glass: new THREE.MeshStandardMaterial({
        color: 0xc8d1d4,
        roughness: 0.2,
        metalness: 0.12,
        transparent: true,
        opacity: 0.78
      }),
      grass: new THREE.MeshStandardMaterial({
        color: 0x667b4d,
        roughness: 1
      }),
      grassLight: new THREE.MeshStandardMaterial({
        color: 0x87985e,
        roughness: 1
      }),
      grassDark: new THREE.MeshStandardMaterial({
        color: 0x455c38,
        roughness: 1
      })
    };

    // -------------------------------------------------------------------------
    // Voxel helper
    // -------------------------------------------------------------------------

    const unit = 0.22;

    function makeBox(size, material, position, castShadow = true) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        material
      );
      mesh.position.copy(position);
      mesh.castShadow = castShadow;
      mesh.receiveShadow = true;
      scene.add(mesh);
      return mesh;
    }

    function voxelColumn(x, z, y, count, material) {
      const column = new THREE.Group();

      for (let i = 0; i < count; i++) {
        const voxel = new THREE.Mesh(
          new THREE.BoxGeometry(unit, unit, unit),
          material
        );
        voxel.position.set(x, y + i * unit, z);
        voxel.castShadow = true;
        voxel.receiveShadow = true;
        column.add(voxel);
      }

      scene.add(column);
      return column;
    }

    // -------------------------------------------------------------------------
    // Main safe deposit box structure
    // -------------------------------------------------------------------------

    const bank = new THREE.Group();
    bank.rotation.y = -0.18;
    scene.add(bank);

    // Main cube shell.
    const shellSize = 3.6;
    const shell = new THREE.Mesh(
      new THREE.BoxGeometry(shellSize, shellSize, shellSize),
      materials.box
    );
    shell.position.y = 0.7;
    shell.castShadow = true;
    shell.receiveShadow = true;
    bank.add(shell);

    // Structural corner posts.
    for (const x of [-1.55, 1.55]) {
      for (const z of [-1.55, 1.55]) {
        makeBox(
          0.28,
          materials.trim,
          new THREE.Vector3(x, 0.7, z)
        );
      }
    }

    // Top cap and base.
    makeBox(
      4.1,
      materials.trim,
      new THREE.Vector3(0, 2.72, 0)
    );

    makeBox(
      4.0,
      materials.dark,
      new THREE.Vector3(0, 0.18, 0)
    );

    // Lower plinth.
    makeBox(
      3.85,
      materials.trim,
      new THREE.Vector3(0, 0.48, 0)
    );

    // Front door frame.
    makeBox(
      3.05,
      materials.trim,
      new THREE.Vector3(0, 1.1, 1.78)
    );

    // Door surround.
    makeBox(
      0.25,
      materials.dark,
      new THREE.Vector3(-1.48, 1.1, 1.83)
    );
    makeBox(
      0.25,
      materials.dark,
      new THREE.Vector3(1.48, 1.1, 1.83)
    );
    makeBox(
      3.2,
      materials.dark,
      new THREE.Vector3(0, 2.3, 1.83)
    );
    makeBox(
      3.2,
      materials.dark,
      new THREE.Vector3(0, 0.05, 1.83)
    );

    // Door panel.
    makeBox(
      2.65,
      materials.glass,
      new THREE.Vector3(0, 1.1, 1.9)
    );

    // Subtle door reflections.
    const reflectionMaterial = new THREE.MeshStandardMaterial({
      color: 0xf7fbff,
      roughness: 0.15,
      metalness: 0.25,
      transparent: true,
      opacity: 0.45
    });

    const reflectionA = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 1.7, 0.035),
      reflectionMaterial
    );
    reflectionA.position.set(-0.45, 1.1, 1.93);
    bank.add(reflectionA);

    const reflectionB = new THREE.Mesh(
      new THREE.BoxGeometry(0.035, 1.1, 0.035),
      reflectionMaterial
    );
    reflectionB.position.set(-0.3, 1.1, 1.94);
    bank.add(reflectionB);

    // Door handle.
    makeBox(
      0.11,
      materials.gold,
      new THREE.Vector3(0.9, 1.08, 2.03)
    );

    // Small lock plate.
    makeBox(
      0.36,
      materials.goldDark,
      new THREE.Vector3(-0.95, 1.1, 2.0)
    );

    // Lock indicator.
    makeBox(
      0.12,
      materials.gold,
      new THREE.Vector3(-0.76, 1.1, 2.13)
    );

    // Side panel details.
    for (const x of [-1.55, 1.55]) {
      for (const z of [-1.55, 1.55]) {
        makeBox(
          0.25,
          materials.dark,
          new THREE.Vector3(x, 1.1, z)
        );
      }
    }

    // -------------------------------------------------------------------------
    // Stylized dollar sign made from voxel blocks
    // -------------------------------------------------------------------------

    const sign = new THREE.Group();
    sign.position.set(0, 1.1, 2.02);
    sign.rotation.y = -0.08;
    bank.add(sign);

    // Outer circular ring, built as segmented blocks.
    const ringRadius = 0.83;
    const ringSegments = 24;

    for (let i = 0; i < ringSegments; i++) {
      const angle = (i / ringSegments) * Math.PI * 2;
      const x = Math.cos(angle) * ringRadius;
      const y = Math.sin(angle) * ringRadius;

      const block = new THREE.Mesh(
        new THREE.BoxGeometry(0.34, 0.34, 0.34),
        i % 2 === 0 ? materials.gold : materials.goldDark
      );
      block.position.set(x, y, 0);
      block.rotation.z = angle + Math.PI / 2;
      block.castShadow = true;
      block.receiveShadow = true;
      sign.add(block);
    }

    // Dollar symbol built from rectangular voxels.
    const signBlocks = [
      [-0.25, 0.48], [-0.08, 0.48], [0.09, 0.48],
      [-0.25, 0.26], [-0.08, 0.26], [0.09, 0.26],
      [-0.25, 0.05], [-0.08, 0.05], [0.09, 0.05],
      [-0.25, -0.16], [-0.08, -0.16], [0.09, -0.16],
      [-0.25, -0.38], [-0.08, -0.38], [0.09, -0.38],
      [-0.25, -0.60], [-0.08, -0.60], [0.09, -0.60],

      [-0.25, 0.17], [-0.25, -0.02], [-0.25, -0.21],
      [-0.25, 0.40], [-0.08, 0.17], [-0.08, -0.02],
      [-0.08, -0.21], [-0.08, 0.40], [0.09, 0.17],
      [0.09, -0.02], [0.09, -0.21], [0.09, 0.40],

      [-0.25, 0.33], [-0.08, 0.33], [0.09, 0.33],
      [-0.25, 0.11], [-0.08, 0.11], [0.09, 0.11],
      [-0.25, -0.11], [-0.08, -0.11], [0.09, -0.11]
    ];

    for (const [x, y] of signBlocks) {
      const block = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.28, 0.28),
        materials.gold
      );
      block.position.set(x, y, 0);
      block.castShadow = true;
      block.receiveShadow = true;
      sign.add(block);
    }

    // A few gold highlight blocks on the ring.
    const highlight = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.25, 0.30),
      materials.goldDark
    );
    highlight.position.set(0, 0.82, 0.17);
    sign.add(highlight);

    // -------------------------------------------------------------------------
    // Voxel shrub / grass around the base
    // -------------------------------------------------------------------------

    const shrubPositions = [
      [-2.15, 0.58, 0.2],
      [-1.9, 0.56, -0.45],
      [-2.25, 0.54, -0.7],
      [2.05, 0.58, 0.25],
      [2.25, 0.56, -0.4],
      [1.85, 0.55, -0.85],
      [-0.6, 0.55, 2.1],
      [0.7, 0.55, 2.15]
    ];

    for (const [x, y, z] of shrubPositions) {
      voxelColumn(x, z, y, 3, materials.grassDark);
      voxelColumn(x + 0.2, z - 0.1, y, 2, materials.grass);
      voxelColumn(x - 0.15, z + 0.1, y, 2, materials.grassLight);
    }

    // Small foreground blocks for depth.
    makeBox(
      0.65,
      materials.grassDark,
      new THREE.Vector3(-2.35, 0.3, 2.3)
    );
    makeBox(
      0.55,
      materials.grass,
      new THREE.Vector3(2.4, 0.28, 2.15)
    );

    // -------------------------------------------------------------------------
    // Floating dust / sparkle
    // -------------------------------------------------------------------------

    const sparkles = [];

    for (let i = 0; i < 30; i++) {
      const sparkle = new THREE.Mesh(
        new THREE.BoxGeometry(0.035, 0.035, 0.035),
        new THREE.MeshBasicMaterial({
          color: 0xfff4cf,
          transparent: true,
          opacity: 0.55
        })
      );

      const angle = Math.random() * Math.PI * 2;
      const radius = 4 + Math.random() * 4;
      sparkle.position.set(
        Math.cos(angle) * radius,
        0.5 + Math.random() * 5,
        Math.sin(angle) * radius
      );
      sparkle.userData.speed = 0.08 + Math.random() * 0.12;
      sparkle.userData.phase = Math.random() * Math.PI * 2;
      scene.add(sparkle);
      sparkles.push(sparkle);
    }

    // -------------------------------------------------------------------------
    // Direct camera controls: orbit and zoom
    // -------------------------------------------------------------------------

    const controls = {
      target: new THREE.Vector3(0, 1.1, 0),
      radius: 7.7,
      theta: 0.72,
      phi: 1.18,
      dragging: false,
      lastX: 0,
      lastY: 0
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
        0.35,
        Math.PI - 0.35
      );

      updateCamera();
    });

    function endDrag(event) {
      controls.dragging = false;
      renderer.domElement.style.cursor = "grab";

      if (event.pointerId !== undefined &&
          renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
    }

    renderer.domElement.addEventListener("pointerup", endDrag);
    renderer.domElement.addEventListener("pointercancel", endDrag);
    renderer.domElement.style.cursor = "grab";

    renderer.domElement.addEventListener("wheel", (event) => {
      event.preventDefault();
      controls.radius = THREE.MathUtils.clamp(
        controls.radius + event.deltaY * 0.006,
        4.6,
        12
      );
      updateCamera();
    }, { passive: false });

    updateCamera();

    // -------------------------------------------------------------------------
    // Resize and animation
    // -------------------------------------------------------------------------

    window.addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(innerWidth, innerHeight);
    });

    const clock = new THREE.Clock();

    function animate() {
      const elapsed = clock.getElapsedTime();

      for (const sparkle of sparkles) {
        sparkle.position.y += sparkle.userData.speed * 0.016;
        sparkle.position.x += Math.sin(elapsed * 1.5 + sparkle.userData.phase) * 0.0015;

        if (sparkle.position.y > 6) {
          sparkle.position.y = 0.2;
        }
      }

      bank.rotation.y = -0.18 + Math.sin(elapsed * 0.28) * 0.025;

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
    relic: { id: "generic", name: "DuckTales Relic", x: -10.0, z: -12.0 },
    env:   { background: 0xb9c9d4, fogColor: 0xb9c9d4, fogDensity: 0.025 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 }
    }
  };
}

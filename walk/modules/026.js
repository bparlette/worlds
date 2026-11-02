// @world {"id": "026", "title": "Castlevania: Symphony of the Night", "sub": "Dracula&#x27;s Throne Room", "system": "Console"}
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

    renderer = dummyRenderer();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    

    // scene redirect
    scene.background = new THREE.Color(0x101010);
    scene.fog = new THREE.FogExp2(0x101010, 0.025);

    camera = dummyCamera();

    // Custom orbit controls implemented directly.
    const controls = {
      target: new THREE.Vector3(0, 3.2, 0),
      theta: Math.PI * 0.22,
      phi: Math.PI * 0.48,
      radius: 18,
      dragging: false,
      lastX: 0,
      lastY: 0,
      wheelZoom: false
    };

    function updateCamera() {
      controls.phi = THREE.MathUtils.clamp(controls.phi, 0.2, Math.PI * 0.82);
      controls.radius = THREE.MathUtils.clamp(controls.radius, 8, 30);

      camera.position.set(
        controls.target.x + controls.radius * Math.sin(controls.phi) * Math.cos(controls.theta),
        controls.target.y + controls.radius * Math.cos(controls.phi),
        controls.target.z + controls.radius * Math.sin(controls.phi) * Math.sin(controls.theta)
      );

      camera.lookAt(controls.target);
    }

    updateCamera();

    window.addEventListener("pointerdown", (event) => {
      controls.dragging = true;
      controls.lastX = event.clientX;
      controls.lastY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
    });

    window.addEventListener("pointermove", (event) => {
      if (!controls.dragging) return;

      const dx = event.clientX - controls.lastX;
      const dy = event.clientY - controls.lastY;

      controls.lastX = event.clientX;
      controls.lastY = event.clientY;

      controls.theta -= dx * 0.006;
      controls.phi -= dy * 0.005;
      updateCamera();
    });

    window.addEventListener("pointerup", (event) => {
      controls.dragging = false;
      if (renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
    });

    window.addEventListener("pointercancel", () => {
      controls.dragging = false;
    });

    window.addEventListener("wheel", (event) => {
      event.preventDefault();
      controls.radius += event.deltaY * 0.01;
      updateCamera();
    }, { passive: false });

    // -------------------------------------------------------------------------
    // Materials
    // -------------------------------------------------------------------------

    const materials = {
      stone: new THREE.MeshStandardMaterial({
        color: 0x34363a,
        roughness: 0.96,
        metalness: 0.02
      }),
      darkStone: new THREE.MeshStandardMaterial({
        color: 0x202327,
        roughness: 0.98
      }),
      floor: new THREE.MeshStandardMaterial({
        color: 0x3b2418,
        roughness: 0.92
      }),
      red: new THREE.MeshStandardMaterial({
        color: 0x6e1018,
        roughness: 0.82
      }),
      redDark: new THREE.MeshStandardMaterial({
        color: 0x3c080d,
        roughness: 0.9
      }),
      gold: new THREE.MeshStandardMaterial({
        color: 0xb9872d,
        roughness: 0.42,
        metalness: 0.68
      }),
      metal: new THREE.MeshStandardMaterial({
        color: 0x4b4b47,
        roughness: 0.58,
        metalness: 0.55
      }),
      blue: new THREE.MeshStandardMaterial({
        color: 0x193f78,
        roughness: 0.66
      }),
      blueDark: new THREE.MeshStandardMaterial({
        color: 0x102b50,
        roughness: 0.72
      }),
      skin: new THREE.MeshStandardMaterial({
        color: 0x9b6845,
        roughness: 0.88
      }),
      hair: new THREE.MeshStandardMaterial({
        color: 0x241812,
        roughness: 0.96
      }),
      black: new THREE.MeshStandardMaterial({
        color: 0x090909,
        roughness: 0.95
      }),
      flame: new THREE.MeshBasicMaterial({
        color: 0xffa12c,
        toneMapped: false
      }),
      flameOrange: new THREE.MeshBasicMaterial({
        color: 0xff681f,
        toneMapped: false
      })
    };

    // -------------------------------------------------------------------------
    // Lighting
    // -------------------------------------------------------------------------

    scene.add(new THREE.HemisphereLight(0x6c7790, 0x24150e, 0.65));

    const ambient = new THREE.AmbientLight(0x88775f, 0.28);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffd7a0, 2.2);
    keyLight.position.set(7, 13, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.left = -12;
    keyLight.shadow.camera.right = 12;
    keyLight.shadow.camera.top = 12;
    keyLight.shadow.camera.bottom = -12;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 35;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x6c87ff, 1.2);
    rimLight.position.set(-8, 7, -9);
    scene.add(rimLight);

    const candleLights = [];

    function addCandleLight(position, color, intensity) {
      const light = new THREE.PointLight(color, intensity, 8, 2);
      light.position.copy(position);
      scene.add(light);
      candleLights.push(light);
    }

    // -------------------------------------------------------------------------
    // Voxel helpers
    // -------------------------------------------------------------------------

    function voxelBox(
      width,
      height,
      depth,
      material,
      x = 0,
      y = 0,
      z = 0,
      castShadow = true,
      receiveShadow = true
    ) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        material
      );

      mesh.position.set(x, y, z);
      mesh.castShadow = castShadow;
      mesh.receiveShadow = receiveShadow;
      scene.add(mesh);
      return mesh;
    }

    function voxelColumn(
      width,
      height,
      depth,
      material,
      x,
      z,
      y = 0
    ) {
      return voxelBox(width, height, depth, material, x, y, z);
    }

    function addCandle(x, z, height = 1.4) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      scene.add(group);

      voxelBox(0.18, 0.28, 0.18, materials.metal, 0, 0.14, 0, false, true);
      voxelBox(0.12, height, 0.12, materials.gold, 0, 0.18 + height / 2, 0, false, false);

      const flame = new THREE.Mesh(
        new THREE.SphereGeometry(0.095, 8, 8),
        flameMaterialFor(height)
      );

      flame.scale.y = 1.8;
      flame.position.y = height + 0.12;
      flame.castShadow = false;
      group.add(flame);

      addCandleLight(
        new THREE.Vector3(x, height + 0.35, z),
        0xff9b32,
        0.75
      );
    }

    function flameMaterialFor(height) {
      return height > 1.65 ? materials.flame : materials.flameOrange;
    }

    // -------------------------------------------------------------------------
    // Architecture
    // -------------------------------------------------------------------------

    // Foundation and front stone wall.
    voxelBox(13.5, 1.5, 3.0, materials.stone, 0, 0.75, 0.2);
    voxelBox(13.8, 0.25, 3.3, materials.darkStone, 0, 1.62, 0.2);

    // Front wall with a central opening.
    voxelBox(5.7, 5.8, 0.8, materials.stone, -4.25, 3.7, 1.45);
    voxelBox(5.7, 5.8, 0.8, materials.stone, 4.25, 3.7, 1.45);
    voxelBox(1.0, 5.8, 0.8, materials.stone, 0, 3.7, 1.45);

    // Side wall blocks.
    for (let x = -6.1; x <= 6.1; x += 0.72) {
      voxelBox(0.68, 5.8, 0.72, materials.stone, x, 3.7, 2.45);
    }

    // Ceiling beams and arch-like columns.
    for (const x of [-5.4, 5.4]) {
      voxelColumn(1.25, 7.2, 1.35, materials.darkStone, x, 0, 3.2);
      voxelBox(1.65, 0.35, 1.75, materials.stone, x, 7.25, 3.2);
    }

    // Upper ceiling.
    voxelBox(13.2, 0.65, 4.5, materials.darkStone, 0, 7.55, 0.2);

    // Ceiling ribs.
    for (let x = -5.5; x <= 5.5; x += 2.75) {
      voxelBox(0.35, 0.35, 4.7, materials.stone, x, 7.0, 0.2);
    }

    // Back wall and central doorway.
    voxelBox(13.4, 6.0, 0.8, materials.darkStone, 0, 3.0, 5.2);
    voxelBox(3.1, 6.0, 0.9, materials.stone, 0, 3.0, 5.65);

    // Doorway frame.
    voxelBox(0.55, 6.0, 1.1, materials.stone, -1.65, 3.0, 5.9);
    voxelBox(0.55, 6.0, 1.1, materials.stone, 1.65, 3.0, 5.9);
    voxelBox(3.85, 0.55, 1.1, materials.stone, 0, 6.0, 5.9);
    voxelBox(3.85, 0.45, 1.1, materials.stone, 0, 0.2, 5.9);

    // Red curtains.
    for (const side of [-1, 1]) {
      const curtain = new THREE.Group();
      curtain.position.set(side * 2.15, 0, 5.4);
      scene.add(curtain);

      for (let i = 0; i < 7; i++) {
        const fold = new THREE.Mesh(
          new THREE.BoxGeometry(0.42, 5.7, 0.28),
          i % 2 === 0 ? materials.red : materials.redDark
        );

        fold.position.set(side * (0.25 + i * 0.18), 2.85, 0);
        fold.rotation.y = side * (0.1 + i * 0.025);
        fold.castShadow = true;
        fold.receiveShadow = true;
        curtain.add(fold);
      }

      const valance = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, 0.72, 0.3),
        materials.red
      );
      valance.position.set(side * 2.15, 0.35, 0.2);
      valance.castShadow = true;
      curtain.add(valance);
    }

    // Throne platform and staircase.
    voxelBox(4.6, 0.55, 3.0, materials.gold, 0, 2.15, 4.65);
    voxelBox(3.5, 0.35, 2.4, materials.red, 0, 2.55, 4.75);

    for (let i = 0; i < 4; i++) {
      voxelBox(
        3.2 - i * 0.1,
        0.25,
        0.65,
        i % 2 === 0 ? materials.gold : materials.red,
        0,
        1.55 + i * 0.27,
        3.85 + i * 0.55
      );
    }

    // Throne.
    const throne = new THREE.Group();
    throne.position.set(0, 2.75, 4.75);
    scene.add(throne);

    voxelBox(2.4, 0.4, 1.7, materials.gold, 0, 0.2, 0);
    voxelBox(2.65, 0.25, 1.9, materials.red, 0, 0.5, 0);

    for (const side of [-1, 1]) {
      voxelBox(0.45, 2.2, 1.7, materials.red, side * 0.95, 1.2, 0);
      voxelBox(0.55, 0.35, 1.9, materials.gold, side * 0.95, 2.38, 0);
    }

    voxelBox(2.15, 1.2, 0.42, materials.red, 0, 1.75, 0.86);
    voxelBox(2.5, 0.3, 0.55, materials.gold, 0, 2.45, 0.86);

    // Throne backrest.
    voxelBox(2.2, 2.1, 0.45, materials.red, 0, 2.15, 1.05);
    voxelBox(2.45, 0.25, 0.65, materials.gold, 0, 3.25, 1.05);

    // Throne armor details.
    voxelBox(1.35, 1.25, 0.48, materials.metal, 0, 1.7, 1.32);
    voxelBox(0.65, 1.55, 0.5, materials.gold, 0, 2.05, 1.38);

    // -------------------------------------------------------------------------
    // Candelabras
    // -------------------------------------------------------------------------

    const candelabraPositions = [
      [-4.4, 0.35],
      [-2.1, 0.35],
      [2.1, 0.35],
      [4.4, 0.35]
    ];

    for (const [x, z] of candelabraPositions) {
      voxelBox(0.38, 0.22, 0.38, materials.metal, x, 0.11, z);
      voxelBox(0.18, 2.7, 0.18, materials.metal, x, 1.5, z);

      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const cx = x + Math.cos(angle) * 0.34;
        const cz = z + Math.sin(angle) * 0.34;

        voxelBox(0.12, 0.72, 0.12, materials.gold, cx, 2.05, cz);
        voxelBox(0.18, 0.1, 0.18, materials.gold, cx, 2.45, cz);
      }

      for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2;
        const cx = x + Math.cos(angle) * 0.48;
        const cz = z + Math.sin(angle) * 0.48;

        voxelBox(0.11, 1.35, 0.11, materials.gold, cx, 3.05, cz);
        voxelBox(0.16, 0.1, 0.16, materials.gold, cx, 3.78, cz);
      }

      addCandle(x, z, 2.7);
    }

    // -------------------------------------------------------------------------
    // Floor details
    // -------------------------------------------------------------------------

    // Large central carpet.
    voxelBox(3.2, 0.08, 6.2, materials.red, 0, 1.78, 1.8);

    for (let z = -1.2; z < 5.2; z += 0.42) {
      voxelBox(0.18, 0.025, 0.2, materials.gold, -1.25, 1.83, z);
      voxelBox(0.18, 0.025, 0.2, materials.gold, 1.25, 1.83, z);
    }

    // Floor tile seams.
    for (let x = -5.5; x <= 5.5; x += 1.38) {
      voxelBox(0.035, 0.025, 4.6, materials.darkStone, x, 1.76, 0.35);
    }

    for (let z = -1.8; z <= 4.8; z += 1.2) {
      voxelBox(11.5, 0.025, 0.035, materials.darkStone, 0, 1.76, z);
    }

    // Water-like dark blue floor patches.
    const waterMaterial = new THREE.MeshStandardMaterial({
      color: 0x102735,
      roughness: 0.45,
      metalness: 0.2
    });

    voxelBox(11.2, 0.08, 0.85, waterMaterial, 0, 1.75, -1.1);
    voxelBox(10.8, 0.08, 0.55, waterMaterial, 0, 1.75, 3.6);

    // -------------------------------------------------------------------------
    // Characters
    // -------------------------------------------------------------------------

    // Villain on the throne.
    const villain = new THREE.Group();
    villain.position.set(0, 2.9, 4.85);
    scene.add(villain);

    // Legs.
    voxelBox(0.34, 0.8, 0.45, materials.black, -0.25, 0.4, 0);
    voxelBox(0.34, 0.8, 0.45, materials.black, 0.25, 0.4, 0);

    // Body armor.
    voxelBox(1.05, 1.35, 0.75, materials.redDark, 0, 1.2, 0);
    voxelBox(1.2, 0.55, 0.85, materials.gold, 0, 1.65, 0);
    voxelBox(0.7, 0.8, 0.55, materials.black, 0, 1.15, 0.48);

    // Head and face.
    voxelBox(0.7, 0.72, 0.7, materials.skin, 0, 2.25, 0);
    voxelBox(0.78, 0.6, 0.76, materials.hair, 0, 2.4, 0);
    voxelBox(0.55, 0.25, 0.78, materials.skin, 0, 2.23, 0.43);

    // Horns.
    for (const side of [-1, 1]) {
      voxelBox(0.22, 0.65, 0.28, materials.gold, side * 0.38, 2.75, -0.05);
      voxelBox(0.38, 0.22, 0.38, materials.gold, side * 0.38, 3.1, -0.05);
    }

    // Arms.
    for (const side of [-1, 1]) {
      voxelBox(0.35, 1.0, 0.42, materials.redDark, side * 0.72, 1.25, 0);
      voxelBox(0.28, 0.55, 0.3, materials.skin, side * 1.0, 1.85, 0);
    }

    // Blue-clad hero standing in front.
    const hero = new THREE.Group();
    hero.position.set(1.55, 1.8, 1.85);
    scene.add(hero);

    // Legs.
    voxelBox(0.36, 0.85, 0.48, materials.blueDark, -0.25, 0.43, 0);
    voxelBox(0.36, 0.85, 0.48, materials.blueDark, 0.25, 0.43, 0);

    // Belt and torso.
    voxelBox(0.88, 0.25, 0.55, materials.gold, 0, 0.96, 0);
    voxelBox(0.92, 1.05, 0.6, materials.blue, 0, 1.55, 0);

    // Chest plate.
    voxelBox(0.58, 0.68, 0.18, materials.blueDark, 0, 1.62, 0.33);
    voxelBox(0.22, 0.32, 0.2, materials.gold, 0, 1.65, 0.45);

    // Neck and head.
    voxelBox(0.3, 0.25, 0.34, materials.skin, 0, 2.2, 0);
    voxelBox(0.72, 0.68, 0.7, materials.hair, 0, 2.55, 0);
    voxelBox(0.58, 0.22, 0.72, materials.skin, 0, 2.37, 0.37);

    // Arms.
    for (const side of [-1, 1]) {
      voxelBox(0.32, 1.05, 0.4, materials.blue, side * 0.64, 1.45, 0);
      voxelBox(0.27, 0.55, 0.3, materials.skin, side * 0.9, 2.05, 0);
    }

    // Weapon.
    voxelBox(0.12, 2.0, 0.12, materials.gold, -0.95, 1.15, 0.1);
    voxelBox(0.3, 0.25, 0.3, materials.gold, -1.05, 2.2, 0.1);

    // Hero cloak.
    const cloak = new THREE.Mesh(
      new THREE.ConeGeometry(0.82, 1.45, 5),
      materials.blue
    );
    cloak.position.set(0, 0.8, 0.9);
    cloak.rotation.y = Math.PI / 2;
    cloak.castShadow = true;
    hero.add(cloak);

    // Hero weapon glow.
    const weaponGlow = new THREE.PointLight(0x7ac7ff, 1.2, 3.5, 2);
    weaponGlow.position.set(-1.0, 1.7, 0.3);
    hero.add(weaponGlow);

    // -------------------------------------------------------------------------
    // Background details
    // -------------------------------------------------------------------------

    // Floating embers.
    const embers = [];
    const emberMaterials = [
      new THREE.MeshBasicMaterial({ color: 0xff8a32, toneMapped: false }),
      new THREE.MeshBasicMaterial({ color: 0xffc06a, toneMapped: false })
    ];

    for (let i = 0; i < 34; i++) {
      const ember = new THREE.Mesh(
        new THREE.SphereGeometry(0.035 + Math.random() * 0.055, 6, 6),
        emberMaterials[i % emberMaterials.length]
      );

      ember.position.set(
        (Math.random() - 0.5) * 12,
        2.5 + Math.random() * 6,
        (Math.random() - 0.5) * 8
      );

      ember.userData = {
        speed: 0.18 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2
      };

      scene.add(ember);
      embers.push(ember);
    }

    // -------------------------------------------------------------------------
    // Animation
    // -------------------------------------------------------------------------

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // Gentle candle flame movement.
      candleLights.forEach((light, index) => {
        light.intensity =
          0.68 + Math.sin(elapsed * 2.1 + index * 1.7) * 0.12;
      });

      // Hero subtle breathing and weapon pulse.
      hero.scale.y = 1 + Math.sin(elapsed * 1.45) * 0.012;
      weaponGlow.intensity = 1.05 + Math.sin(elapsed * 2.8) * 0.2;

      // Embers rise and drift.
      for (const ember of embers) {
        const data = ember.userData;
        ember.position.y += data.speed * 0.016;
        ember.position.x += Math.sin(elapsed * 0.65 + data.phase) * 0.0008;

        if (ember.position.y > 8.5) {
          ember.position.y = 2.2;
          ember.position.x = (Math.random() - 0.5) * 12;
          ember.position.z = (Math.random() - 0.5) * 8;
        }
      }

      renderer.render(scene, camera);
    }

    animate();

    // -------------------------------------------------------------------------
    // Keyboard controls
    // -------------------------------------------------------------------------

    const keys = new Set();
    let resetPressed = false;

    window.addEventListener("keydown", (event) => {
      keys.add(event.key.toLowerCase());

      if (event.key.toLowerCase() === "r") {
        resetPressed = true;
      }
    });

    window.addEventListener("keyup", (event) => {
      keys.delete(event.key.toLowerCase());
    });

    function resetView() {
      controls.target.set(0, 3.2, 0);
      controls.theta = Math.PI * 0.22;
      controls.phi = Math.PI * 0.48;
      controls.radius = 18;
      updateCamera();
      resetPressed = false;
    }

    window.addEventListener("keydown", (event) => {
      if (event.key.toLowerCase() === "r" && !resetPressed) {
        resetView();
      }
    });

    window.addEventListener("blur", () => {
      keys.clear();
      controls.dragging = false;
    });

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
    relic: { id: "generic", name: "Castlevania: Symphony of the Night Relic", x: -10.0, z: -12.0 },
    env:   { background: 0x101010, fogColor: 0x101010, fogDensity: 0.025 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 }
    }
  };
}

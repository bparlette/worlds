// @world {"id": "011", "title": "The Legend of Zelda: Majora&#x27;s Mask", "sub": "Clock Town (West)", "system": "Console"}
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
  // Converter repair: declared identifier(s) the scene used undeclared
  // (strict modules throw where sloppy scripts did not): clouds, px, py, pz, s
  let clouds = 0;
  let px = 0;
  let py = 0;
  let pz = 0;
  let s = 0;

    

    // -------------------------------------------------------------------------
    // Renderer and scene
    // -------------------------------------------------------------------------
    renderer = dummyRenderer();
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    

    // scene redirect
    scene.background = new THREE.Color(0xb9dce4);
    scene.fog = new THREE.Fog(0xb9dce4, 18, 42);

    camera = dummyCamera();

    // Custom orbit-style controls, implemented without addons.
    const controls = {
      target: new THREE.Vector3(0, 2.1, 0),
      yaw: -0.62,
      pitch: 0.48,
      distance: 14.5,
      dragging: false,
      lastX: 0,
      lastY: 0
    };

    function updateCamera() {
      const horizontal = Math.cos(controls.pitch) * controls.distance;
      camera.position.set(
        controls.target.x + Math.sin(controls.yaw) * horizontal,
        controls.target.y + Math.sin(controls.pitch) * controls.distance,
        controls.target.z + Math.cos(controls.yaw) * horizontal
      );
      camera.lookAt(controls.target);
    }

    updateCamera();

    renderer.domElement.addEventListener("pointerdown", event => {
      controls.dragging = true;
      controls.lastX = event.clientX;
      controls.lastY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
    });

    renderer.domElement.addEventListener("pointermove", event => {
      if (!controls.dragging) return;
      const dx = event.clientX - controls.lastX;
      const dy = event.clientY - controls.lastY;
      controls.lastX = event.clientX;
      controls.lastY = event.clientY;
      controls.yaw -= dx * 0.006;
      controls.pitch = THREE.MathUtils.clamp(
        controls.pitch + dy * 0.004,
        0.12,
        1.18
      );
      updateCamera();
    });

    function endDrag(event) {
      controls.dragging = false;
      if (event.pointerId !== undefined &&
          renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
    }

    renderer.domElement.addEventListener("pointerup", endDrag);
    renderer.domElement.addEventListener("pointercancel", endDrag);

    renderer.domElement.addEventListener("wheel", event => {
      event.preventDefault();
      controls.distance = THREE.MathUtils.clamp(
        controls.distance + event.deltaY * 0.008,
        6.5,
        24
      );
      updateCamera();
    }, { passive: false });

    addEventListener("keydown", event => {
      if (event.key.toLowerCase() === "r") {
        controls.target.set(0, 2.1, 0);
        controls.yaw = -0.62;
        controls.pitch = 0.48;
        controls.distance = 14.5;
        updateCamera();
      }
    });

    // -------------------------------------------------------------------------
    // Materials
    // -------------------------------------------------------------------------
    const materials = {
      stone: new THREE.MeshStandardMaterial({
        color: 0x9b8160, roughness: 0.94
      }),
      darkStone: new THREE.MeshStandardMaterial({
        color: 0x6e5842, roughness: 0.96
      }),
      paleStone: new THREE.MeshStandardMaterial({
        color: 0xc2aa7b, roughness: 0.9
      }),
      redWall: new THREE.MeshStandardMaterial({
        color: 0xa94635, roughness: 0.93
      }),
      roof: new THREE.MeshStandardMaterial({
        color: 0x5b3f2b, roughness: 0.95
      }),
      wood: new THREE.MeshStandardMaterial({
        color: 0x765036, roughness: 0.96
      }),
      darkWood: new THREE.MeshStandardMaterial({
        color: 0x493326, roughness: 0.98
      }),
      cream: new THREE.MeshStandardMaterial({
        color: 0xe7d7ad, roughness: 0.9
      }),
      gold: new THREE.MeshStandardMaterial({
        color: 0xd6a949, roughness: 0.72,
        metalness: 0.08
      }),
      blue: new THREE.MeshStandardMaterial({
        color: 0x317fa3, roughness: 0.85
      }),
      teal: new THREE.MeshStandardMaterial({
        color: 0x3b8f8f, roughness: 0.85
      }),
      yellow: new THREE.MeshStandardMaterial({
        color: 0xf0ad37, roughness: 0.82
      }),
      orange: new THREE.MeshStandardMaterial({
        color: 0xe97835, roughness: 0.8
      }),
      purple: new THREE.MeshStandardMaterial({
        color: 0x7852a1, roughness: 0.88
      }),
      flower: new THREE.MeshStandardMaterial({
        color: 0xe8892e, roughness: 0.85
      }),
      leaf: new THREE.MeshStandardMaterial({
        color: 0x3d6738, roughness: 0.95
      }),
      purpleFlower: new THREE.MeshStandardMaterial({
        color: 0x7657a2, roughness: 0.9
      })
    };

    // -------------------------------------------------------------------------
    // Voxel helper
    // -------------------------------------------------------------------------
    const voxel = (material, x, y, z, sx = 1, sy = 1, sz = 1) => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(sx, sy, sz),
        material
      );
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    };

    const addBox = (material, x, y, z, sx, sy, sz) => {
      const mesh = voxel(material, x, y, z, sx, sy, sz);
      scene.add(mesh);
      return mesh;
    };

    // -------------------------------------------------------------------------
    // Street and buildings
    // -------------------------------------------------------------------------

    // Ground plane built from a grid of square voxel tiles.
    const tile = 1;
    const groundMaterials = [
      materials.paleStone,
      materials.stone,
      materials.darkStone
    ];

    for (let x = -12; x <= 12; x++) {
      for (let z = -12; z <= 12; z++) {
        let y = 0;
        // The right side rises in a broad curve, creating the street slope.
        if (z > 3) {
          const rise = Math.max(0, z - 3) * 0.28;
          const edge = Math.max(0, 11 - Math.abs(x));
          y = Math.min(3.2, rise + edge * 0.12);
        }

        const material = groundMaterials[
          ((x * 3 + z * 5 + 20) % 3) % 3
        ];
        scene.add(voxel(material, x, y, z, 0.96, 0.96, 0.96));
      }
    }

    // Left building: main red wall and stone base.
    const leftBuilding = new THREE.Group();
    scene.add(leftBuilding);

    // Stone foundation.
    for (let x = -5; x <= 5; x++) {
      for (let z = -4; z <= 3; z++) {
        addBox(
          materials.darkStone,
          x, 0.25, z,
          0.96, 0.5, 0.96
        );
      }
    }

    // Main red wall, built as a grid of blocks.
    for (let x = -5; x <= 5; x++) {
      for (let z = -4; z <= 3; z++) {
        if (z === -4 && (x === -5 || x === 5)) continue;
        if (z === 3 && (x === -5 || x === 5)) continue;
        addBox(
          materials.redWall,
          x, 1.25, z,
          0.96, 1.1, 0.96
        );
      }
    }

    // Upper red wall.
    for (let x = -5; x <= 5; x++) {
      for (let z = -4; z <= 3; z++) {
        if (z === -4 && (x === -5 || x === 5)) continue;
        if (z === 3 && (x === -5 || x === 5)) continue;
        addBox(
          materials.redWall,
          x, 3.2, z,
          0.96, 1.1, 0.96
        );
      }
    }

    // Side wall.
    for (let x = -6; x <= -1; x++) {
      for (let z = -4; z <= 3; z++) {
        addBox(
          materials.redWall,
          x, 2.1, z,
          0.96, 2.1, 0.96
        );
      }
    }

    // Stone trim along the red wall.
    for (let x = -5; x <= 5; x++) {
      addBox(materials.paleStone, x, 0.55, 3.5, 0.96, 0.45, 0.4);
      addBox(materials.paleStone, x, 4.0, 3.5, 0.96, 0.35, 0.4);
    }

    // Roof overhang.
    for (let x = -6; x <= 6; x++) {
      for (let z = -5; z <= 4; z++) {
        addBox(
          materials.roof,
          x, 4.25, z,
          0.96, 0.55, 0.96
        );
      }
    }

    // Wooden beams under the roof.
    for (let x = -5; x <= 5; x++) {
      addBox(materials.wood, x, 3.85, 3.55, 0.35, 0.45, 0.45);
    }

    // Door on the red wall.
    addBox(materials.darkWood, -1.5, 1.35, 3.95, 1.35, 2.3, 0.35);
    addBox(materials.wood, -1.5, 1.35, 4.18, 1.05, 1.95, 0.18);
    addBox(materials.gold, -1.5, 1.35, 4.3, 0.14, 0.14, 0.12);

    // Side doorway.
    addBox(materials.darkWood, -5.7, 1.35, 0.4, 0.35, 2.3, 1.3);
    addBox(materials.wood, -5.93, 1.35, 0.4, 0.16, 1.95, 0.95);

    // Wall windows with dark frames and crossbars.
    function wallWindow(x, y, z, width = 1.25, height = 1.5) {
      addBox(materials.darkStone, x, y, z + 0.08, width + 0.28, height + 0.28, 0.25);
      addBox(materials.darkWood, x, y, z + 0.23, width, height, 0.12);
      addBox(materials.paleStone, x, y, z + 0.31, 0.11, height, 0.08);
      addBox(materials.paleStone, x, y, z + 0.31, width, 0.11, 0.08);
    }

    wallWindow(0.5, 2.0, 3.55, 1.25, 1.45);
    wallWindow(3.0, 2.0, 3.55, 1.25, 1.45);

    // Decorative painted symbols on the red wall.
    function paintSymbol(x, y, z, color, shape, size = 1) {
      const group = new THREE.Group();
      const paintMat = new THREE.MeshStandardMaterial({
        color, roughness: 0.9
      });

      if (shape === "s") {
        const segments = [
          [-0.35, -0.25, 0],
          [-0.15, 0.15, 0],
          [0.15, 0.1, 0],
          [0.05, -0.28, 0]
        ];
        for (const [sx, sy, sz] of segments) {
          group.add(voxel(paintMat, x + sx * size, y + sy * size, z, 0.2 * size, 0.2 * size, 0.08));
        }
      } else if (shape === "u") {
        group.add(voxel(paintMat, x, y - 0.28 * size, z, 0.58 * size, 0.58 * size, 0.08));
        group.add(voxel(paintMat, x, y + 0.28 * size, z, 0.58 * size, 0.58 * size, 0.08));
        group.add(voxel(paintMat, x, y, z, 0.58 * size, 0.58 * size, 0.08));
      } else {
        group.add(voxel(paintMat, x, y, z, 0.55 * size, 0.55 * size, 0.08));
      }
      scene.add(group);
    }

    paintSymbol(-3.4, 2.55, 3.72, 0x365b69, "s", 0.9);
    paintSymbol(-0.2, 3.0, 3.72, 0xf3d48a, "u", 0.72);
    paintSymbol(2.7, 2.85, 3.72, 0xd95b45, "s", 0.8);

    // Hanging sign.
    addBox(materials.wood, -2.25, 2.85, 3.9, 0.9, 1.55, 0.18);
    addBox(materials.gold, -2.25, 2.85, 4.03, 0.72, 1.2, 0.12);
    addBox(materials.darkWood, -2.25, 2.85, 4.12, 0.1, 0.1, 0.1);

    // -------------------------------------------------------------------------
    // Right building
    // -------------------------------------------------------------------------
    const rightBuilding = new THREE.Group();
    scene.add(rightBuilding);

    // Stone foundation and main wall.
    for (let x = -3; x <= 3; x++) {
      for (let z = -3; z <= 3; z++) {
        addBox(
          materials.darkStone,
          x, 0.25, z,
          0.96, 0.5, 0.96
        );
      }
    }

    for (let x = -3; x <= 3; x++) {
      for (let z = -3; z <= 3; z++) {
        addBox(
          materials.stone,
          x, 1.35, z,
          0.96, 1.1, 0.96
        );
      }
    }

    for (let x = -3; x <= 3; x++) {
      for (let z = -3; z <= 3; z++) {
        addBox(
          materials.stone,
          x, 2.75, z,
          0.96, 1.1, 0.96
        );
      }
    }

    // Side wall.
    for (let x = -4; x <= 2; x++) {
      for (let z = -4; z <= 3; z++) {
        addBox(
          materials.stone,
          x, 2.1, z,
          0.96, 2.1, 0.96
        );
      }
    }

    // Roof.
    for (let x = -4; x <= 4; x++) {
      for (let z = -4; z <= 4; z++) {
        addBox(
          materials.roof,
          x, 3.95, z,
          0.96, 0.55, 0.96
        );
      }
    }

    // Wooden roof beams.
    for (let x = -3; x <= 3; x++) {
      addBox(materials.wood, x, 3.55, 3.55, 0.35, 0.45, 0.45);
    }

    // Arched-ish doorway made from block steps.
    for (let i = 0; i < 4; i++) {
      addBox(
        materials.darkStone,
        2.8, 0.45 + i * 0.34, 1.0 + i * 0.22,
        1.35, 0.34, 0.22
      );
    }
    addBox(materials.darkWood, 2.8, 1.35, 1.1, 1.25, 1.8, 0.35);
    addBox(materials.wood, 2.8, 1.35, 1.3, 0.95, 1.45, 0.16);
    addBox(materials.gold, 2.8, 1.35, 1.4, 0.12, 0.12, 0.1);

    // Windows.
    wallWindow(-1.2, 1.85, 3.55, 1.2, 1.5);
    wallWindow(0.3, 1.85, 3.55, 1.2, 1.5);
    wallWindow(-1.2, 3.2, 3.55, 1.1, 1.35);
    wallWindow(0.3, 3.2, 3.55, 1.1, 1.35);

    // Side window.
    wallWindow(1.5, 1.85, 3.55, 1.2, 1.5);
    wallWindow(1.5, 3.2, 3.55, 1.1, 1.35);

    // Painted posters on the right wall.
    function poster(x, y, z, bg, fg, symbol) {
      const group = new THREE.Group();
      const bgMat = new THREE.MeshStandardMaterial({ color: bg, roughness: 0.95 });
      const fgMat = new THREE.MeshStandardMaterial({ color: fg, roughness: 0.9 });

      group.add(voxel(bgMat, x, y, z, 1.15, 1.45, 0.12));

      if (symbol === "moon") {
        group.add(voxel(fgMat, x, y, z + 0.1, 0.52, 0.52, 0.08));
        for (let i = 0; i < 4; i++) {
          const a = i * Math.PI / 2;
          group.add(voxel(
            fgMat,
            x + Math.cos(a) * 0.16,
            y + Math.sin(a) * 0.16,
            z + 0.1,
            0.07,
            0.07,
            0.08
          ));
        }
      } else {
        const cx = x - 0.25;
        const cy = y;
        group.add(voxel(fgMat, cx, cy - 0.2, z + 0.1, 0.7, 0.7, 0.08));
        group.add(voxel(fgMat, cx, cy + 0.2, z + 0.1, 0.7, 0.7, 0.08));
        group.add(voxel(fgMat, cx, cy, z + 0.1, 0.7, 0.7, 0.08));
      }

      scene.add(group);
    }

    poster(-2.2, 1.2, 3.55, 0x385c78, 0xf4d38a, "moon");
    poster(-0.8, 1.2, 3.55, 0x7146a0, 0xf0b45c, "moon");
    poster(1.1, 1.2, 3.55, 0x3b7778, 0xf2d18a, "moon");

    // -------------------------------------------------------------------------
    // Central covered walkway / market awning
    // -------------------------------------------------------------------------
    const awning = new THREE.Group();
    scene.add(awning);

    // Dark thatched/wooden roof.
    for (let x = -4; x <= 4; x++) {
      for (let z = -2; z <= 1; z++) {
        addBox(
          materials.roof,
          x, 2.15, z,
          0.96, 0.5, 0.96
        );
      }
    }

    // Supports.
    for (const x of [-3.4, 0, 3.4]) {
      addBox(materials.wood, x, 0.95, 1.05, 0.42, 1.9, 0.42);
      addBox(materials.gold, x, 1.45, 1.28, 0.5, 0.12, 0.5);
    }

    // Front valance.
    for (let x = -4; x <= 4; x++) {
      addBox(materials.wood, x, 1.75, 1.35, 0.96, 0.55, 0.35);
    }

    // Central banner.
    addBox(materials.red, 0, 2.1, 1.65, 0.9, 1.25, 0.18);
    addBox(materials.gold, 0, 2.1, 1.76, 0.72, 1.02, 0.12);
    addBox(materials.darkWood, 0, 2.1, 1.84, 0.12, 0.12, 0.1);

    // -------------------------------------------------------------------------
    // Street details
    // -------------------------------------------------------------------------

    // Steps leading to the left building.
    for (let i = 0; i < 4; i++) {
      addBox(
        materials.stone,
        -1.6, 0.22 + i * 0.22, 4.2 - i * 0.35,
        2.5, 0.22, 0.38
      );
    }

    // Flower planter.
    const planter = new THREE.Group();
    scene.add(planter);

    for (let x = -2; x <= 2; x++) {
      for (let z = -1; z <= 1; z++) {
        addBox(
          materials.stone,
          x, 0.45, z,
          0.78, 0.9, 0.78
        );
      }
    }

    // Plants.
    const plantPositions = [
      [-1.4, 0.95, 0.1],
      [-0.9, 1.0, 0.25],
      [-0.45, 0.9, -0.1],
      [0.1, 1.05, 0.05],
      [0.65, 0.95, -0.15],
      [1.2, 1.1, 0.1]
    ];

    for (const [x, y, z] of plantPositions) {
      addBox(materials.leaf, x, y, z, 0.45, 0.65, 0.45);
      addBox(materials.leaf, x + 0.1, y + 0.3, z, 0.3, 0.4, 0.3);
      addBox(materials.flower, x, y + 0.46, z, 0.22, 0.22, 0.22);
    }

    // Purple flowers in a small pot.
    addBox(materials.wood, 1.25, 0.6, 1.65, 0.75, 0.8, 0.75);
    for (let i = 0; i < 7; i++) {
      const x = 1.05 + (i % 3) * 0.2;
      const z = 1.45 + Math.floor(i / 3) * 0.2;
      addBox(materials.purpleFlower, x, 1.15, z, 0.16, 0.42, 0.16);
    }

    // Hanging lanterns.
    function lantern(x, y, z) {
      addBox(materials.gold, x, y, z, 0.22, 0.55, 0.22);
      addBox(materials.red, x, y + 0.28, z, 0.3, 0.3, 0.3);
      addBox(materials.darkWood, x, y + 0.62, z, 0.1, 0.1, 0.1);
    }

    lantern(-0.8, 2.75, 1.2);
    lantern(0.8, 2.75, 1.2);

    // String flags across the street.
    const flagColors = [
      materials.yellow,
      materials.orange,
      materials.purple,
      materials.blue,
      materials.teal,
      materials.cream
    ];

    function makeFlag(material, x, y, z, width = 0.65) {
      const group = new THREE.Group();
      group.add(voxel(material, 0, 0, 0, width, width, 0.12));
      scene.add(group);
      return group;
    }

    const flags = [];
    for (let i = 0; i < 16; i++) {
      const flag = makeFlag(
        flagColors[i % flagColors.length],
        -7 + i * 1.05,
        4.7 - i * 0.025,
        0.25
      );
      flags.push(flag);
    }

    // Slight flag wave animation.
    const originalFlags = flags.map(f => f.rotation.y);

    // Small bollards.
    function bollard(x, z) {
      addBox(materials.paleStone, x, 0.45, z, 0.45, 0.9, 0.45);
      addBox(materials.paleStone, x, 0.95, z, 0.55, 0.18, 0.55);
    }

    bollard(-3.9, 2.6);
    bollard(3.7, 2.5);
    bollard(-3.9, -1.8);

    // A few scattered stones.
    for (const [x, z] of [[-4.5, 1.5], [4.2, 0.4], [-5.2, -1.2]]) {
      addBox(materials.stone, x, 0.08, z, 0.65, 0.18, 0.45);
    }

    // -------------------------------------------------------------------------
    // Sky, sun, clouds, and distant architecture
    // -------------------------------------------------------------------------

    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(1.8, 24, 16),
      new THREE.MeshBasicMaterial({ color: 0xffe5a1 })
    );
    sun.position.set(-13, 11, -18);
    scene.add(sun);

    // Pixel-style clouds.
    const cloudMaterial = new THREE.MeshStandardMaterial({
      color: 0xf4f1df,
      roughness: 1
    });

    function cloud(x, y, z, scale) {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      group.scale.setScalar(scale);

      const pieces = [
        [-1.2, 0, 0, 1.0],
        [-0.4, 0.35, 0, 1.25],
        [0.6, 0.15, 0, 1.0],
        [1.25, -0.05, 0, 0.7],
        [0.1, -0.25, 0, 1.4]
      ];

      for (const [px, py, pz, s] of pieces) {
        group.add(voxel(cloudMaterial, px, py, pz, s, s * 0.65, s * 0.7));
      }

      scene.add(group);
      return group;
    }

    cloud(-7, 8, -12, 1.4);
    cloud(7, 10, -16, 1.7);
    cloud(13, 6, -8, 1.0);

    // Distant block buildings.
    for (let i = 0; i < 7; i++) {
      const x = -13 + i * 4.2;
      const z = -13 - i * 0.8;
      const h = 3.2 + (i % 3) * 0.7;

      addBox(
        materials.stone,
        x, h / 2, z,
        3.8, h, 3.8
      );

      addBox(
        materials.roof,
        x, h + 0.25, z,
        4.2, 0.5, 4.2
      );
    }

    // -------------------------------------------------------------------------
    // Lighting
    // -------------------------------------------------------------------------
    const hemi = new THREE.HemisphereLight(0xd8efff, 0x795536, 2.0);
    scene.add(hemi);

    const sunLight = new THREE.DirectionalLight(0xffe3a6, 3.2);
    sunLight.position.set(-8, 13, 7);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(2048, 2048);
    sunLight.shadow.camera.left = -18;
    sunLight.shadow.camera.right = 18;
    sunLight.shadow.camera.top = 18;
    sunLight.shadow.camera.bottom = -18;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 45;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);

    const warmFill = new THREE.DirectionalLight(0xffb766, 0.7);
    warmFill.position.set(8, 5, -8);
    scene.add(warmFill);

    // -------------------------------------------------------------------------
    // Animation
    // -------------------------------------------------------------------------
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Gentle flag movement.
      flags.forEach((flag, i) => {
        flag.rotation.y = originalFlags[i] + Math.sin(time * 1.1 + i * 0.7) * 0.08;
        flag.rotation.z = Math.sin(time * 1.4 + i) * 0.025;
      });

      renderer.render(scene, camera);
    }

    animate();

    addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(innerWidth, innerHeight);
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
    relic: { id: "wand", name: "Magic Wand", x: 10.0, z: -12.0 },
    env:   { background: 0xb9dce4, fogColor: 0xb9dce4, fogDensity: 0.025 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 }
    }
  };
}

// @world {"id": "097", "title": "Half-Life", "sub": "Black Mesa", "system": "Console"}
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
  // (strict modules throw where sloppy scripts did not): zoom
  let zoom = 0;

    

    // ------------------------------------------------------------
    // Renderer and scene
    // ------------------------------------------------------------
    renderer = dummyRenderer();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    

    // scene redirect
    scene.background = new THREE.Color(0x070b12);
    scene.fog = new THREE.Fog(0x070b12, 18, 38);

    camera = dummyCamera();

    // ------------------------------------------------------------
    // Custom camera controls: orbit, zoom, pan
    // ------------------------------------------------------------
    const controls = {
      target: new THREE.Vector3(0, 1.25, 0),
      radius: 18.5,
      theta: 0.72,
      phi: 1.02,
      dragging: false,
      panning: false,
      lastX: 0,
      lastY: 0
    };

    const defaultTarget = controls.target.clone();
    const defaultRadius = controls.radius;
    const defaultTheta = controls.theta;
    const defaultPhi = controls.phi;

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
      controls.panning = event.button === 2 || event.shiftKey;
      controls.lastX = event.clientX;
      controls.lastY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
      renderer.domElement.style.cursor = controls.panning ? "grabbing" : "move";
    });

    renderer.domElement.addEventListener("pointermove", (event) => {
      if (!controls.dragging) return;

      const dx = event.clientX - controls.lastX;
      const dy = event.clientY - controls.lastY;
      controls.lastX = event.clientX;
      controls.lastY = event.clientY;

      if (controls.panning) {
        const right = new THREE.Vector3();
        const up = new THREE.Vector3();
        camera.matrixWorld.extractBasis(right, up, new THREE.Vector3());

        const panScale = controls.radius * 0.0015;
        controls.target.addScaledVector(right, -dx * panScale);
        controls.target.addScaledVector(up, dy * panScale);
        controls.target.y = THREE.MathUtils.clamp(controls.target.y, 0.2, 5);
      } else {
        controls.theta -= dx * 0.006;
        controls.phi = THREE.MathUtils.clamp(
          controls.phi - dy * 0.005,
          0.28,
          Math.PI * 0.48
        );
      }

      updateCamera();
    });

    function endDrag(event) {
      controls.dragging = false;
      controls.panning = false;
      renderer.domElement.style.cursor = "grab";
      if (event && renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
    }

    renderer.domElement.addEventListener("pointerup", endDrag);
    renderer.domElement.addEventListener("pointercancel", endDrag);
    renderer.domElement.addEventListener("contextmenu", (event) => event.preventDefault());

    renderer.domElement.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        controls.radius = THREE.MathUtils.clamp(
          controls.radius * Math.exp(event.deltaY * 0.001),
          7,
          31
        );
        updateCamera();
      },
      { passive: false }
    );

    renderer.domElement.style.cursor = "grab";
    updateCamera();

    // ------------------------------------------------------------
    // Lighting
    // ------------------------------------------------------------
    scene.add(new THREE.HemisphereLight(0x9bbcff, 0x17130f, 1.55));

    const ambient = new THREE.AmbientLight(0x7183a1, 0.3);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffe6bc, 3.2);
    keyLight.position.set(7, 12, 9);
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

    const fillLight = new THREE.DirectionalLight(0x6daeff, 1.25);
    fillLight.position.set(-10, 7, -8);
    scene.add(fillLight);

    const warmLight = new THREE.PointLight(0xff9d55, 1.5, 8, 2);
    warmLight.position.set(0, 3.8, 1.5);
    scene.add(warmLight);

    // ------------------------------------------------------------
    // Materials
    // ------------------------------------------------------------
    const materials = {
      floor: new THREE.MeshStandardMaterial({
        color: 0x303a42,
        roughness: 0.92,
        metalness: 0.08
      }),
      floorAlt: new THREE.MeshStandardMaterial({
        color: 0x364149,
        roughness: 0.95
      }),
      wall: new THREE.MeshStandardMaterial({
        color: 0x485661,
        roughness: 0.83,
        metalness: 0.16
      }),
      wallDark: new THREE.MeshStandardMaterial({
        color: 0x26343d,
        roughness: 0.8
      }),
      trim: new THREE.MeshStandardMaterial({
        color: 0x101920,
        roughness: 0.55,
        metalness: 0.35
      }),
      metal: new THREE.MeshStandardMaterial({
        color: 0x9aa8b1,
        roughness: 0.35,
        metalness: 0.72
      }),
      darkMetal: new THREE.MeshStandardMaterial({
        color: 0x202a31,
        roughness: 0.4,
        metalness: 0.65
      }),
      red: new THREE.MeshStandardMaterial({
        color: 0xc94332,
        roughness: 0.58,
        metalness: 0.15
      }),
      redDark: new THREE.MeshStandardMaterial({
        color: 0x762b28,
        roughness: 0.7
      }),
      cream: new THREE.MeshStandardMaterial({
        color: 0xe8d7ae,
        roughness: 0.72
      }),
      green: new THREE.MeshStandardMaterial({
        color: 0x4e9b68,
        roughness: 0.65
      }),
      yellow: new THREE.MeshStandardMaterial({
        color: 0xe2ae38,
        roughness: 0.58
      }),
      blue: new THREE.MeshStandardMaterial({
        color: 0x337ca8,
        roughness: 0.48,
        metalness: 0.25
      }),
      black: new THREE.MeshStandardMaterial({
        color: 0x11171c,
        roughness: 0.6,
        metalness: 0.25
      }),
      skin: new THREE.MeshStandardMaterial({
        color: 0xc98760,
        roughness: 0.8
      }),
      hair: new THREE.MeshStandardMaterial({
        color: 0x5b3828,
        roughness: 0.9
      }),
      shirt: new THREE.MeshStandardMaterial({
        color: 0x334c57,
        roughness: 0.85
      }),
      pants: new THREE.MeshStandardMaterial({
        color: 0x252d33,
        roughness: 0.88
      }),
      orange: new THREE.MeshStandardMaterial({
        color: 0xe38b32,
        roughness: 0.72
      }),
      cactus: new THREE.MeshStandardMaterial({
        color: 0x3e9b61,
        roughness: 0.75
      }),
      soil: new THREE.MeshStandardMaterial({
        color: 0x30251b,
        roughness: 1
      })
    };

    // ------------------------------------------------------------
    // Voxel helpers
    // ------------------------------------------------------------
    const voxelSize = 0.22;

    function addVoxel(x, y, z, material, sx = voxelSize, sy = voxelSize, sz = voxelSize) {
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

    function addVoxelBox(x, y, z, width, height, depth, material) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        material
      );
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      return mesh;
    }

    function addLine(x1, y1, z1, x2, y2, z2, material, thickness = voxelSize) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const dz = z2 - z1;
      const length = Math.hypot(dx, dy, dz);
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(thickness, thickness, length, 6),
        material
      );
      mesh.position.set(
        (x1 + x2) / 2,
        (y1 + y2) / 2,
        (z1 + z2) / 2
      );
      mesh.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(dx, dy, dz).normalize()
      );
      mesh.castShadow = true;
      scene.add(mesh);
      return mesh;
    }

    // ------------------------------------------------------------
    // Store shell and floor
    // ------------------------------------------------------------
    const storeWidth = 10.4;
    const storeDepth = 7.2;
    const wallHeight = 5.2;

    // Floor tiles.
    for (let x = -5; x <= 5; x++) {
      for (let z = -3; z <= 3; z++) {
        const material = (x + z) % 2 === 0 ? materials.floor : materials.floorAlt;
        addVoxel(
          x * voxelSize,
          0.02,
          z * voxelSize,
          material,
          voxelSize * 0.94,
          voxelSize * 0.55,
          voxelSize * 0.94
        );
      }
    }

    // Back and left walls.
    addVoxelBox(
      0,
      wallHeight / 2,
      -storeDepth / 2,
      storeWidth,
      wallHeight,
      voxelSize * 1.05,
      materials.wall
    );

    addVoxelBox(
      -storeWidth / 2,
      wallHeight / 2,
      0,
      voxelSize * 1.05,
      wallHeight,
      storeDepth,
      materials.wall
    );

    // Lower wall panels.
    for (let x = -4; x <= 4; x++) {
      addVoxelBox(
        x * voxelSize,
        1.45,
        -storeDepth / 2 + voxelSize * 0.64,
        voxelSize * 0.9,
        0.75,
        voxelSize * 0.35,
        materials.wallDark
      );
    }

    for (let z = -2; z <= 2; z++) {
      addVoxelBox(
        -storeWidth / 2 + voxelSize * 0.64,
        1.45,
        z * voxelSize,
        voxelSize * 0.35,
        0.75,
        voxelSize * 0.9,
        materials.wallDark
      );
    }

    // Upper trim.
    addVoxelBox(
      0,
      4.55,
      -storeDepth / 2,
      storeWidth,
      0.25,
      voxelSize * 0.55,
      materials.trim
    );

    addVoxelBox(
      -storeWidth / 2,
      4.55,
      0,
      voxelSize * 0.55,
      0.25,
      storeDepth,
      materials.trim
    );

    // Structural columns.
    for (const x of [-5.1, 5.1]) {
      for (const z of [-3.45, 3.45]) {
        addVoxelBox(x, 2.55, z, 0.48, 5.1, 0.48, materials.darkMetal);
      }
    }

    // Front fascia and base.
    addVoxelBox(
      0,
      0.18,
      storeDepth / 2,
      storeWidth,
      0.36,
      0.55,
      materials.trim
    );

    // ------------------------------------------------------------
    // Ceiling hood
    // ------------------------------------------------------------
    addVoxelBox(
      0,
      5.25,
      -0.2,
      7.8,
      0.35,
      2.4,
      materials.trim
    );

    // Hood panels.
    for (let i = 0; i < 5; i++) {
      const x = -2.8 + i * 1.4;
      addVoxelBox(x, 5.48, -0.2, 1.2, 0.42, 1.9, materials.wallDark);

      for (let j = -1; j <= 1; j++) {
        addVoxelBox(
          x,
          5.72 + j * 0.12,
          -0.2 + j * 0.56,
          1.08,
          0.08,
          0.1,
          materials.metal
        );
      }
    }

    // Ceiling light fixtures.
    for (const x of [-2.1, 0, 2.1]) {
      addVoxelBox(x, 5.68, 0.6, 1.35, 0.12, 0.7, materials.cream);
      addVoxelBox(x, 5.78, 0.6, 1.1, 0.05, 0.48, materials.metal);
    }

    // ------------------------------------------------------------
    // Vending machine
    // ------------------------------------------------------------
    const machineX = -3.45;
    const machineZ = 0.25;

    addVoxelBox(
      machineX,
      2.25,
      machineZ,
      1.65,
      4.5,
      1.45,
      materials.red
    );

    // Rounded-ish top using stacked boxes.
    addVoxelBox(machineX, 4.65, machineZ, 1.85, 0.25, 1.65, materials.redDark);
    addVoxelBox(machineX, 4.82, machineZ, 1.55, 0.2, 1.35, materials.red);

    // Side panels.
    addVoxelBox(machineX - 0.84, 2.25, machineZ, 0.16, 4.35, 1.45, materials.redDark);
    addVoxelBox(machineX + 0.84, 2.25, machineZ, 0.16, 4.35, 1.45, materials.redDark);

    // Front frame.
    addVoxelBox(machineX, 2.25, machineZ + 0.75, 1.6, 4.25, 0.14, materials.darkMetal);

    // Display window.
    addVoxelBox(machineX, 2.85, machineZ + 0.84, 1.25, 1.65, 0.12, materials.black);

    // Pixel products.
    const productColors = [
      materials.cream,
      materials.yellow,
      materials.green,
      materials.blue,
      materials.red,
      materials.orange
    ];

    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 4; col++) {
        const x = machineX - 0.48 + col * 0.3;
        const y = 3.1 + row * 0.82;
        const productMaterial = productColors[(row + col) % productColors.length];

        addVoxelBox(x, y, machineZ + 0.93, 0.25, 0.45, 0.18, productMaterial);
        addVoxelBox(
          x,
          y + 0.24,
          machineZ + 1.02,
          0.16,
          0.08,
          0.05,
          materials.cream
        );
      }
    }

    // Selection buttons.
    const buttonColors = [
      materials.green,
      materials.yellow,
      materials.red,
      materials.blue,
      materials.orange,
      materials.cream
    ];

    for (let i = 0; i < 6; i++) {
      addVoxelBox(
        machineX - 0.55 + i * 0.22,
        1.25,
        machineZ + 0.87,
        0.13,
        0.4,
        0.12,
        buttonColors[i]
      );
    }

    // Price display.
    addVoxelBox(
      machineX + 0.48,
      3.75,
      machineZ + 0.87,
      0.42,
      0.55,
      0.12,
      materials.black
    );

    // Price text as tiny cream voxels.
    for (let i = 0; i < 4; i++) {
      addVoxelBox(
        machineX + 0.48,
        3.58 + i * 0.11,
        machineZ + 0.94,
        0.18,
        0.035,
        0.035,
        materials.cream
      );
    }

    // Dispenser opening.
    addVoxelBox(machineX, 0.72, machineZ + 0.88, 1.05, 0.55, 0.16, materials.black);
    addVoxelBox(machineX, 0.72, machineZ + 0.98, 0.85, 0.12, 0.1, materials.metal);

    // Top marquee.
    addVoxelBox(machineX, 4.35, machineZ + 0.87, 1.7, 0.35, 0.2, materials.cream);

    // Marquee text "SOOD POP".
    const marqueeText = ["S", "O", "O", "D", "P", "O", "P"];
    marqueeText.forEach((char, i) => {
      const pixel = 0.11;
      const charWidth = pixel * 5;
      const charHeight = pixel * 6;

      if (char === "O") {
        addVoxelBox(
          machineX - 0.55 + i * charWidth,
          4.55,
          machineZ + 0.98,
          charWidth,
          charHeight,
          pixel * 0.8,
          materials.redDark
        );
        addVoxelBox(
          machineX - 0.55 + i * charWidth,
          4.55,
          machineZ + 1.02,
          charWidth,
          pixel * 0.55,
          pixel * 0.8,
          materials.redDark
        );
      } else if (char === "D") {
        addVoxelBox(
          machineX - 0.55 + i * charWidth,
          4.65,
          machineZ + 0.98,
          charWidth,
          pixel * 0.8,
          pixel * 0.8,
          materials.redDark
        );
        addVoxelBox(
          machineX - 0.55 + i * charWidth,
          4.45,
          machineZ + 0.98,
          charWidth,
          pixel * 0.8,
          pixel * 0.8,
          materials.redDark
        );
      } else {
        addVoxelBox(
          machineX - 0.55 + i * charWidth,
          4.65,
          machineZ + 0.98,
          charWidth,
          pixel * 0.8,
          pixel * 0.8,
          materials.redDark
        );
      }
    });

    // ------------------------------------------------------------
    // Newsstand and magazines
    // ------------------------------------------------------------
    const newsX = 3.75;
    const newsZ = 0.65;

    addVoxelBox(newsX, 2.05, newsZ, 1.55, 4.1, 0.75, materials.yellow);
    addVoxelBox(newsX, 4.18, newsZ, 1.7, 0.2, 0.9, materials.yellow);

    // Stand supports.
    addVoxelBox(newsX - 0.55, 0.4, newsZ, 0.14, 0.8, 0.14, materials.darkMetal);
    addVoxelBox(newsX + 0.55, 0.4, newsZ, 0.14, 0.8, 0.14, materials.darkMetal);

    // Magazine cover art.
    for (let i = 0; i < 3; i++) {
      const x = newsX - 0.45 + i * 0.45;
      addVoxelBox(x, 3.75, newsZ + 0.43, 0.38, 0.85, 0.12, i === 1 ? materials.red : materials.blue);
      addVoxelBox(x, 3.95, newsZ + 0.51, 0.16, 0.22, 0.05, materials.cream);
      addVoxelBox(x, 3.55, newsZ + 0.51, 0.18, 0.12, 0.05, materials.cream);
    }

    // ------------------------------------------------------------
    // Phone booth
    // ------------------------------------------------------------
    const boothX = -1.55;
    const boothZ = -2.45;

    addVoxelBox(boothX, 2.35, boothZ, 1.55, 4.7, 1.35, materials.wallDark);
    addVoxelBox(boothX, 4.8, boothZ, 1.75, 0.25, 1.55, materials.trim);

    // Glass-like front panels.
    addVoxelBox(boothX, 2.5, boothZ + 0.72, 1.4, 3.6, 0.12, materials.blue);
    addVoxelBox(boothX, 2.5, boothZ + 0.82, 1.15, 3.35, 0.1, materials.metal);

    // Booth interior.
    addVoxelBox(boothX, 2.3, boothZ + 0.15, 0.95, 3.2, 0.6, materials.darkMetal);

    // Phone handset.
    addVoxelBox(boothX + 0.34, 2.65, boothZ + 0.9, 0.28, 0.15, 0.12, materials.metal);
    addVoxelBox(boothX + 0.34, 2.8, boothZ + 0.9, 0.12, 0.3, 0.12, materials.metal);
    addVoxelBox(boothX + 0.52, 2.65, boothZ + 0.9, 0.12, 0.3, 0.12, materials.metal);

    // Phone cord.
    addLine(
      boothX + 0.34,
      2.7,
      boothZ + 0.9,
      boothX + 0.52,
      3.05,
      boothZ + 0.9,
      materials.black,
      0.045
    );

    // ------------------------------------------------------------
    // Cactus
    // ------------------------------------------------------------
    const cactusX = -4.85;
    const cactusZ = -2.25;

    addVoxelBox(cactusX, 0.2, cactusZ, 0.55, 0.4, 0.55, materials.soil);
    addVoxelBox(cactusX, 0.45, cactusZ, 0.7, 0.4, 0.7, materials.cactus);

    // Cactus arms.
    addVoxelBox(cactusX - 0.2, 0.85, cactusZ, 0.28, 0.8, 0.28, materials.cactus);
    addVoxelBox(cactusX - 0.38, 1.18, cactusZ, 0.18, 0.35, 0.18, materials.cactus);
    addVoxelBox(cactusX + 0.2, 0.85, cactusZ, 0.28, 0.8, 0.28, materials.cactus);
    addVoxelBox(cactusX + 0.38, 1.18, cactusZ, 0.18, 0.35, 0.18, materials.cactus);

    // Pot rim.
    addVoxelBox(cactusX, 0.61, cactusZ, 0.76, 0.12, 0.76, materials.redDark);

    // ------------------------------------------------------------
    // Character
    // ------------------------------------------------------------
    const character = new THREE.Group();
    character.position.set(0.65, 0, 1.45);
    scene.add(character);

    // Legs.
    addVoxelBox(character.localToWorld(new THREE.Vector3(-0.16, 0.32, 0)), 0.18, 0, materials.pants, 0.32, 0.7, 0.32);
    addVoxelBox(character.localToWorld(new THREE.Vector3(0.16, 0.32, 0)), 0.18, 0, materials.pants, 0.32, 0.7, 0.32);

    // Shoes.
    addVoxelBox(character.localToWorld(new THREE.Vector3(-0.16, 0.04, 0.14)), 0.02, 0.14, materials.black, 0.34, 0.18, 0.42);
    addVoxelBox(character.localToWorld(new THREE.Vector3(0.16, 0.04, 0.14)), 0.02, 0.14, materials.black, 0.34, 0.18, 0.42);

    // Torso.
    addVoxelBox(character.localToWorld(new THREE.Vector3(0, 1.02, 0)), 0.0, 0, materials.orange, 0.78, 1.05, 0.58);
    addVoxelBox(character.localToWorld(new THREE.Vector3(0, 1.02, 0.32)), 0.0, 0.32, materials.yellow, 0.62, 0.72, 0.12);

    // Collar.
    addVoxelBox(character.localToWorld(new THREE.Vector3(0, 1.48, 0)), 0.0, 0, materials.yellow, 0.82, 0.2, 0.62);

    // Arms.
    addVoxelBox(character.localToWorld(new THREE.Vector3(-0.5, 1.02, 0)), -0.42, 0, materials.orange, 0.34, 0.95, 0.34);
    addVoxelBox(character.localToWorld(new THREE.Vector3(0.5, 1.02, 0)), 0.42, 0, materials.orange, 0.34, 0.95, 0.34);

    // Hands.
    addVoxelBox(character.localToWorld(new THREE.Vector3(-0.68, 0.69, 0)), -0.68, 0, materials.skin, 0.28, 0.3, 0.28);
    addVoxelBox(character.localToWorld(new THREE.Vector3(0.68, 0.69, 0)), 0.68, 0, materials.skin, 0.28, 0.3, 0.28);

    // Head.
    addVoxelBox(character.localToWorld(new THREE.Vector3(0, 1.92, 0)), 0.0, 0, materials.skin, 0.72, 0.72, 0.72);

    // Hair.
    addVoxelBox(character.localToWorld(new THREE.Vector3(0, 2.16, -0.04)), 0.0, -0.04, materials.hair, 0.78, 0.35, 0.78);
    addVoxelBox(character.localToWorld(new THREE.Vector3(-0.34, 2.03, 0.03)), -0.31, 0.03, materials.hair, 0.35, 0.42, 0.35);
    addVoxelBox(character.localToWorld(new THREE.Vector3(0.34, 2.03, 0.03)), 0.31, 0.03, materials.hair, 0.35, 0.42, 0.35);

    // Eyes.
    addVoxelBox(character.localToWorld(new THREE.Vector3(-0.14, 2.02, 0.39)), -0.14, 0.39, materials.black, 0.11, 0.11, 0.08);
    addVoxelBox(character.localToWorld(new THREE.Vector3(0.14, 2.02, 0.39)), 0.14, 0.39, materials.black, 0.11, 0.11, 0.08);

    // Nose.
    addVoxelBox(character.localToWorld(new THREE.Vector3(0, 1.88, 0.4)), 0.0, 0.4, materials.skin, 0.14, 0.14, 0.1);

    // Beard.
    addVoxelBox(character.localToWorld(new THREE.Vector3(0, 1.66, 0.39)), 0.0, 0.38, materials.hair, 0.62, 0.28, 0.18);

    // Arms holding a mug.
    addVoxelBox(character.localToWorld(new THREE.Vector3(0.48, 1.25, 0.36)), 0.45, 0.36, materials.metal, 0.22, 0.62, 0.22);
    addVoxelBox(character.localToWorld(new THREE.Vector3(0.48, 1.58, 0.36)), 0.45, 0.36, materials.cream, 0.24, 0.34, 0.24);
    addVoxelBox(character.localToWorld(new THREE.Vector3(0.48, 1.72, 0.36)), 0.45, 0.36, materials.red, 0.24, 0.1, 0.24);

    // Hat.
    addVoxelBox(character.localToWorld(new THREE.Vector3(0, 2.37, 0)), 0.0, 0, materials.hair, 0.85, 0.18, 0.85);
    addVoxelBox(character.localToWorld(new THREE.Vector3(0, 2.48, 0)), 0.0, 0, materials.hair, 0.62, 0.14, 0.62);

    // Character shadow.
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.4, 1.4),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.28,
        depthWrite: false
      })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(character.position.x, 0.025, character.position.z);
    scene.add(shadow);

    // ------------------------------------------------------------
    // Floor debris
    // ------------------------------------------------------------
    const debris = [
      { x: -1.25, y: 0.06, z: 0.85, rotation: 0.2, material: materials.blue },
      { x: 0.2, y: 0.06, z: 0.45, rotation: -0.5, material: materials.red },
      { x: -0.65, y: 0.06, z: -0.5, rotation: 0.8, material: materials.yellow },
      { x: 1.05, y: 0.06, z: -0.7, rotation: 0.3, material: materials.cream }
    ];

    debris.forEach((item, index) => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.38, 0.1, 0.16),
        item.material
      );
      mesh.position.set(item.x, item.y, item.z);
      mesh.rotation.y = item.rotation;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
    });

    // ------------------------------------------------------------
    // Wall signs
    // ------------------------------------------------------------
    addVoxelBox(-2.65, 3.85, -3.18, 2.15, 0.55, 0.16, materials.trim);

    // "OPEN" sign made from blocks.
    for (let i = 0; i < 5; i++) {
      addVoxelBox(
        -3.3 + i * 0.3,
        3.85,
        -3.08,
        0.16,
        0.24,
        0.08,
        materials.green
      );
    }

    addVoxelBox(3.25, 3.55, -3.18, 1.65, 0.45, 0.16, materials.trim);

    // Decorative wall lamps.
    for (const x of [-1.25, 1.25]) {
      addVoxelBox(x, 4.1, -3.0, 0.25, 0.55, 0.25, materials.darkMetal);
      addVoxelBox(x, 3.75, -2.85, 0.38, 0.18, 0.38, materials.cream);
    }

    // ------------------------------------------------------------
    // Small foreground details
    // ------------------------------------------------------------
    // A low planter or trash bin near the entrance.
    addVoxelBox(-4.95, 0.25, 3.05, 0.75, 0.5, 0.75, materials.darkMetal);
    addVoxelBox(-4.95, 0.53, 3.05, 0.86, 0.1, 0.86, materials.trim);

    // A small stack of crates.
    addVoxelBox(4.25, 0.22, 2.75, 0.75, 0.44, 0.75, materials.wood || materials.wallDark);
    addVoxelBox(4.25, 0.48, 2.75, 0.58, 0.28, 0.58, materials.wood || materials.wallDark);

    // Use a fallback wood material if missing.
    if (!materials.wood) {
      materials.wood = new THREE.MeshStandardMaterial({
        color: 0x6d4631,
        roughness: 0.9
      });
    }

    // ------------------------------------------------------------
    // Animation
    // ------------------------------------------------------------
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Subtle sign pulse.
      warmLight.intensity = 1.45 + Math.sin(elapsed * 1.7) * 0.12;

      renderer.render(scene, camera);
    }

    animate();

    // ------------------------------------------------------------
    // Resize handling
    // ------------------------------------------------------------
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
    relic: { id: "generic", name: "Half-Life Relic", x: -10.0, z: -12.0 },
    env:   { background: 0x070b12, fogColor: 0x070b12, fogDensity: 0.025 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 }
    }
  };
}

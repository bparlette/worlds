// @world {"id": "022", "title": "The Legend of Zelda: Twilight Princess", "sub": "Temple of Time", "system": "Console"}
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
    document.body.prepend(renderer.domElement);

    // scene redirect
    scene.background = new THREE.Color(0x241d18);
    scene.fog = new THREE.FogExp2(0x34291f, 0.017);

    camera = dummyCamera();

    // -------------------------------------------------------------------------
    // Materials
    // -------------------------------------------------------------------------

    const mat = {
      stone: new THREE.MeshStandardMaterial({
        color: 0xc8b99a,
        roughness: 0.88,
        metalness: 0.02
      }),
      paleStone: new THREE.MeshStandardMaterial({
        color: 0xe0d4b8,
        roughness: 0.8
      }),
      darkStone: new THREE.MeshStandardMaterial({
        color: 0x3f4540,
        roughness: 0.76,
        metalness: 0.12
      }),
      carved: new THREE.MeshStandardMaterial({
        color: 0x897f69,
        roughness: 0.95
      }),
      gold: new THREE.MeshStandardMaterial({
        color: 0xb99443,
        roughness: 0.35,
        metalness: 0.78
      }),
      brightGold: new THREE.MeshStandardMaterial({
        color: 0xe0bd65,
        roughness: 0.28,
        metalness: 0.85
      }),
      blackGold: new THREE.MeshStandardMaterial({
        color: 0x26231e,
        roughness: 0.48,
        metalness: 0.72
      }),
      marble: new THREE.MeshStandardMaterial({
        color: 0xd8cfb2,
        roughness: 0.72
      }),
      green: new THREE.MeshStandardMaterial({
        color: 0x344536,
        roughness: 0.72
      }),
      leaf: new THREE.MeshStandardMaterial({
        color: 0x66765b,
        roughness: 0.9
      }),
      glassBlue: new THREE.MeshStandardMaterial({
        color: 0x416d87,
        roughness: 0.25,
        metalness: 0.08,
        emissive: 0x0b2635,
        emissiveIntensity: 0.45
      }),
      glassViolet: new THREE.MeshStandardMaterial({
        color: 0x6c4d88,
        roughness: 0.28,
        metalness: 0.06,
        emissive: 0x21102a,
        emissiveIntensity: 0.5
      }),
      glassPink: new THREE.MeshStandardMaterial({
        color: 0xa85e68,
        roughness: 0.28,
        metalness: 0.06,
        emissive: 0x351018,
        emissiveIntensity: 0.45
      }),
      glassYellow: new THREE.MeshStandardMaterial({
        color: 0xc09a3c,
        roughness: 0.3,
        metalness: 0.08,
        emissive: 0x2a1b05,
        emissiveIntensity: 0.4
      }),
      light: new THREE.MeshStandardMaterial({
        color: 0xf0e6c9,
        emissive: 0xd8b86a,
        emissiveIntensity: 1.7,
        roughness: 0.4
      })
    };

    // -------------------------------------------------------------------------
    // Voxel helpers
    // -------------------------------------------------------------------------

    function addVoxelBlock(
      x,
      y,
      z,
      size = 1,
      material = mat.stone,
      castShadow = true,
      receiveShadow = true
    ) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        material
      );

      mesh.position.set(x, y, z);
      mesh.castShadow = castShadow;
      mesh.receiveShadow = receiveShadow;
      scene.add(mesh);
      return mesh;
    }

    function addBox(
      x,
      y,
      z,
      width,
      height,
      depth,
      material = mat.stone,
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

    function addColumn(x, z, height = 10, radius = 0.8) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);

      const base = new THREE.Mesh(
        new THREE.BoxGeometry(radius * 2.7, 0.65, radius * 2.7),
        mat.darkStone
      );
      base.position.y = 0.32;
      base.castShadow = true;
      base.receiveShadow = true;
      group.add(base);

      const plinth = new THREE.Mesh(
        new THREE.BoxGeometry(radius * 2.25, 0.45, radius * 2.25),
        mat.paleStone
      );
      plinth.position.y = 0.85;
      plinth.castShadow = true;
      plinth.receiveShadow = true;
      group.add(plinth);

      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(
          radius * 0.76,
          radius * 0.9,
          height - 2.1,
          12
        ),
        mat.stone
      );
      shaft.position.y = 1.15 + (height - 2.1) / 2;
      shaft.castShadow = true;
      shaft.receiveShadow = true;
      group.add(shaft);

      // Block-like vertical fluting.
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const inset = new THREE.Mesh(
          new THREE.BoxGeometry(0.11, height - 2.2, 0.18),
          mat.carved
        );
        inset.position.set(
          Math.cos(a) * radius * 0.84,
          1.15 + (height - 2.1) / 2,
          Math.sin(a) * radius * 0.84
        );
        inset.castShadow = true;
        group.add(inset);
      }

      const capital = new THREE.Mesh(
        new THREE.BoxGeometry(radius * 2.65, 0.65, radius * 2.65),
        mat.paleStone
      );
      capital.position.y = height - 0.8;
      capital.castShadow = true;
      capital.receiveShadow = true;
      group.add(capital);

      const top = new THREE.Mesh(
        new THREE.BoxGeometry(radius * 2.2, 0.55, radius * 2.2),
        mat.darkStone
      );
      top.position.y = height + 0.25;
      top.castShadow = true;
      top.receiveShadow = true;
      group.add(top);

      scene.add(group);
    }

    function addReliefFigure(x, y, z, scale = 1) {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      group.scale.setScalar(scale);

      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.23, 0.8, 7),
        mat.carved
      );
      body.position.y = 0.4;
      body.castShadow = true;
      group.add(body);

      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 8, 6),
        mat.carved
      );
      head.position.y = 0.95;
      head.castShadow = true;
      group.add(head);

      const armL = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.09, 0.48, 6),
        mat.carved
      );
      armL.position.set(-0.22, 0.58, 0);
      armL.rotation.z = -0.55;
      armL.castShadow = true;
      group.add(armL);

      const armR = armL.clone();
      armR.position.x = 0.22;
      armR.rotation.z = 0.55;
      group.add(armR);

      scene.add(group);
    }

    function addStainedGlassWindow(x, y, z, width = 2.2, height = 7) {
      const group = new THREE.Group();
      group.position.set(x, y, z);

      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(width + 0.25, height + 0.25, 0.35),
        mat.gold
      );
      frame.position.y = height / 2;
      frame.castShadow = true;
      group.add(frame);

      const mullions = [
        new THREE.Mesh(
          new THREE.BoxGeometry(0.12, height, 0.42),
          mat.gold
        ),
        new THREE.Mesh(
          new THREE.BoxGeometry(width, 0.12, 0.42),
          mat.gold
        )
      ];

      mullions.forEach((m) => {
        m.position.y = height / 2;
        m.castShadow = true;
        group.add(m);
      });

      const panels = [
        [mat.glassBlue, 0.28],
        [mat.glassViolet, 0.3],
        [mat.glassBlue, 0.28],
        [mat.glassPink, 0.3],
        [mat.glassViolet, 0.3],
        [mat.glassBlue, 0.28],
        [mat.glassPink, 0.3],
        [mat.glassViolet, 0.3],
        [mat.glassBlue, 0.28]
      ];

      let panelIndex = 0;

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const panel = new THREE.Mesh(
            new THREE.BoxGeometry(
              width / 3 - 0.12,
              height / 3 - 0.1,
              0.16
            ),
            panels[panelIndex++]
          );
          panel.position.set(
            (col - 1) * width / 3,
            height / 2 + (row - 1) * height / 3,
            0.24
          );
          group.add(panel);
        }
      }

      scene.add(group);
    }

    // -------------------------------------------------------------------------
    // Floor
    // -------------------------------------------------------------------------

    const floor = addBox(
      0,
      -0.18,
      0,
      24,
      0.36,
      18,
      mat.marble,
      false,
      true
    );

    // Border bands.
    addBox(0, 0.015, 7.7, 24, 0.06, 1.2, mat.darkStone, false, true);
    addBox(0, 0.015, -7.7, 24, 0.06, 1.2, mat.darkStone, false, true);
    addBox(11.7, 0.015, 0, 1.2, 0.06, 15.4, mat.darkStone, false, true);
    addBox(-11.7, 0.015, 0, 1.2, 0.06, 15.4, mat.darkStone, false, true);

    // Large central seal medallion, built from concentric voxel rings.
    const medallion = new THREE.Group();
    medallion.position.y = 0.08;
    scene.add(medallion);

    for (let ring = 0; ring < 6; ring++) {
      const inner = 2.25 - ring * 0.42;
      const outer = inner + 0.38;
      const segments = 48;

      for (let i = 0; i < segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        const x = Math.cos(a) * (inner + outer) * 0.5;
        const z = Math.sin(a) * (inner + outer) * 0.5;
        const block = addVoxelBlock(
          x,
          0.09,
          z,
          0.38,
          ring % 2 === 0 ? mat.paleStone : mat.carved
        );
        block.rotation.y = -a;
      }
    }

    const center = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.14, 1.2),
      mat.green
    );
    center.position.y = 0.18;
    center.receiveShadow = true;
    medallion.add(center);

    const trifold = new THREE.Mesh(
      new THREE.BoxGeometry(0.72, 0.2, 0.72),
      mat.gold
    );
    trifold.position.y = 0.29;
    trifold.rotation.y = Math.PI / 4;
    trifold.castShadow = true;
    medallion.add(trifold);

    // -------------------------------------------------------------------------
    // Walls and pillars
    // -------------------------------------------------------------------------

    addBox(0, 4.7, -8.6, 24, 9.4, 0.8, mat.stone);
    addBox(0, 4.7, 8.6, 24, 9.4, 0.8, mat.stone);

    // Side wall bases and upper panels.
    for (const side of [-1, 1]) {
      addBox(
        side * 10.6,
        2.3,
        0,
        0.8,
        4.6,
        17.2,
        mat.darkStone
      );

      addBox(
        side * 10.6,
        6.95,
        0,
        0.8,
        1.1,
        17.2,
        mat.paleStone
      );

      // Repeated relief panels.
      for (let z = -7.2; z <= 7.2; z += 2.4) {
        addBox(
          side * 10.6,
          4.75,
          z,
          0.25,
          2.25,
          1.55,
          mat.carved
        );

        addReliefFigure(side * 10.6, 4.75, z + 0.84, 0.65);
      }

      addColumn(-5.2, -7.2, 10.2, 0.82);
      addColumn(5.2, -7.2, 10.2, 0.82);
      addColumn(-5.2, 7.2, 10.2, 0.82);
      addColumn(5.2, 7.2, 10.2, 0.82);

      addStainedGlassWindow(-9.85, 5.7, -6.25, 2.2, 7.2);
      addStainedGlassWindow(9.85, 5.7, 6.25, 2.2, 7.2);
    }

    // Back wall architecture.
    addBox(0, 4.55, -8.95, 13.4, 9.1, 0.7, mat.stone);

    // Central pediment and arch.
    const pedimentBase = addBox(
      0,
      4.45,
      -8.45,
      7.2,
      1.15,
      1.25,
      mat.darkStone
    );

    addBox(0, 5.15, -8.45, 6.3, 0.45, 1.35, mat.paleStone);

    const arch = new THREE.Mesh(
      new THREE.ExtrudeGeometry(
        new THREE.Shape()
      ),
      mat.darkStone
    );

    // Build the arch as stacked blocks rather than relying on geometry.
    for (let row = 0; row < 5; row++) {
      const y = 6.25 + row * 0.72;
      const span = 4.2 - row * 0.18;

      for (let i = 0; i < 11; i++) {
        const x = -span / 2 + (i / 10) * span;
        const block = addVoxelBlock(
          x,
          y,
          -8.35,
          span / 11 * 0.84,
          mat.paleStone
        );
        block.rotation.z =
          row % 2 === 0
            ? Math.sin((i / 10) * Math.PI) * 0.12
            : -Math.sin((i / 10) * Math.PI) * 0.12;
      }
    }

    const upperArch = new THREE.Mesh(
      new THREE.ExtrudeGeometry(
        new THREE.Shape()
      ),
      mat.darkStone
    );

    // Build the arch as stacked blocks rather than relying on geometry.
    for (let row = 0; row < 5; row++) {
      const y = 6.25 + row * 0.72;
      const span = 4.2 - row * 0.18;

      for (let i = 0; i < 11; i++) {
        const x = -span / 2 + (i / 10) * span;
        const block = addVoxelBlock(
          x,
          y,
          -8.35,
          span / 11 * 0.84,
          mat.paleStone
        );
        block.rotation.z =
          row % 2 === 0
            ? Math.sin((i / 10) * Math.PI) * 0.12
            : -Math.sin((i / 10) * Math.PI) * 0.12;
      }
    }

    // Seal emblem in the upper arch.
    const emblem = new THREE.Group();
    emblem.position.set(0, 7.0, -8.15);

    const emblemRing = new THREE.Mesh(
      new THREE.BoxGeometry(1.55, 1.55, 0.3),
      mat.gold
    );
    emblemRing.castShadow = true;
    emblem.add(emblemRing);

    const emblemInner = new THREE.Mesh(
      new THREE.BoxGeometry(1.08, 1.08, 0.34),
      mat.green
    );
    emblemInner.castShadow = true;
    emblem.add(emblemInner);

    const emblemMark = new THREE.Mesh(
      new THREE.BoxGeometry(0.68, 0.68, 0.38),
      mat.brightGold
    );
    emblemMark.rotation.y = Math.PI / 4;
    emblemMark.castShadow = true;
    emblem.add(emblemMark);

    scene.add(emblem);

    // Inscription above the central doorway.
    const inscription = new THREE.Mesh(
      new THREE.PlaneGeometry(4.3, 0.6),
      new THREE.MeshBasicMaterial({
        color: 0xe2d1a6,
        transparent: true,
        opacity: 0.78
      })
    );
    inscription.position.set(0, 5.82, -8.15);
    scene.add(inscription);

    // Central doorway.
    addBox(0, 2.6, -8.5, 2.4, 5.2, 0.55, mat.darkStone);
    addBox(0, 5.15, -8.5, 2.8, 0.5, 0.7, mat.paleStone);

    // Dark recessed doorway.
    addBox(0, 2.5, -8.8, 1.55, 4.8, 0.25, mat.blackGold);

    // Doorway handle.
    const handle = new THREE.Mesh(
      new THREE.TorusGeometry(0.13, 0.045, 8, 18),
      mat.brightGold
    );
    handle.position.set(0, 2.55, -8.22);
    handle.rotation.y = Math.PI / 2;
    scene.add(handle);

    // -------------------------------------------------------------------------
    // Ceiling dome / rose window
    // -------------------------------------------------------------------------

    // Radial ceiling ribs.
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      const rib = addBox(
        0,
        10.25,
        0,
        0.16,
        1.1,
        17.5,
        mat.gold
      );
      rib.rotation.y = -a;
    }

    // Large central ceiling boss.
    const ceilingBoss = new THREE.Mesh(
      new THREE.SphereGeometry(1.45, 24, 16),
      mat.paleStone
    );
    ceilingBoss.scale.y = 0.48;
    ceilingBoss.position.y = 10.35;
    ceilingBoss.castShadow = true;
    scene.add(ceilingBoss);

    const ceilingRosette = new THREE.Mesh(
      new THREE.CylinderGeometry(2.2, 2.2, 0.25, 32),
      mat.gold
    );
    ceilingRosette.position.y = 10.65;
    scene.add(ceilingRosette);

    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const petal = new THREE.Mesh(
        new THREE.ConeGeometry(0.52, 1.1, 5),
        mat.paleStone
      );
      petal.position.set(
        Math.cos(a) * 2.1,
        10.95,
        Math.sin(a) * 2.1
      );
      petal.rotation.z = Math.cos(a) * 0.35;
      petal.rotation.x = Math.sin(a) * 0.35;
      scene.add(petal);
    }

    // -------------------------------------------------------------------------
    // Floating dust particles
    // -------------------------------------------------------------------------

    const dustCount = 380;
    const dustPositions = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 22;
      dustPositions[i * 3 + 1] = Math.random() * 11;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }

    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(dustPositions, 3)
    );

    const dust = new THREE.Points(
      dustGeometry,
      new THREE.PointsMaterial({
        color: 0xe9d6a5,
        size: 0.035,
        transparent: true,
        opacity: 0.38,
        depthWrite: false
      })
    );

    scene.add(dust);

    // -------------------------------------------------------------------------
    // Lighting
    // -------------------------------------------------------------------------

    scene.add(new THREE.HemisphereLight(0xd7e0d2, 0x3b281c, 1.25));

    const ambient = new THREE.AmbientLight(0xffe0aa, 0.42);
    scene.add(ambient);

    const warmFill = new THREE.PointLight(0xffbf67, 38, 24, 2);
    warmFill.position.set(0, 7.8, -4.5);
    scene.add(warmFill);

    const coolFill = new THREE.PointLight(0x7899bd, 24, 20, 2);
    coolFill.position.set(0, 8.8, 3.8);
    scene.add(coolFill);

    // -------------------------------------------------------------------------
    // Custom orbit controls, implemented without addons
    // -------------------------------------------------------------------------

    const controls = {
      target: new THREE.Vector3(0, 4.8, -1.3),
      distance: 25.5,
      theta: 0,
      phi: 1.18,
      minDistance: 12,
      maxDistance: 42,
      minPhi: 0.35,
      maxPhi: 1.48,
      dragging: false,
      panning: false,
      lastX: 0,
      lastY: 0
    };

    const initialView = {
      target: controls.target.clone(),
      distance: controls.distance,
      theta: controls.theta,
      phi: controls.phi
    };

    function updateCamera() {
      const sinPhi = Math.sin(controls.phi);
      camera.position.set(
        controls.target.x + controls.distance * sinPhi * Math.sin(controls.theta),
        controls.target.y + controls.distance * Math.cos(controls.phi),
        controls.target.z + controls.distance * sinPhi * Math.cos(controls.theta)
      );

      camera.lookAt(controls.target);
    }

    renderer.domElement.addEventListener("pointerdown", (event) => {
      controls.dragging = true;
      controls.panning = event.button === 2 || event.shiftKey;
      controls.lastX = event.clientX;
      controls.lastY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
      renderer.domElement.style.cursor = controls.panning ? "move" : "grabbing";
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

        const scale = controls.distance * 0.0015;

        controls.target.addScaledVector(right, -dx * scale);
        controls.target.addScaledVector(up, dy * scale);
        controls.target.y = THREE.MathUtils.clamp(
          controls.target.y,
          1.5,
          11
        );
      } else {
        controls.theta -= dx * 0.006;
        controls.phi = THREE.MathUtils.clamp(
          controls.phi - dy * 0.005,
          controls.minPhi,
          controls.maxPhi
        );
      }

      updateCamera();
    });

    function endPointer(event) {
      controls.dragging = false;
      controls.panning = false;
      renderer.domElement.style.cursor = "grab";

      if (event.pointerId !== undefined &&
          renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
    }

    renderer.domElement.addEventListener("pointerup", endPointer);
    renderer.domElement.addEventListener("pointercancel", endPointer);
    renderer.domElement.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });

    renderer.domElement.addEventListener("wheel", (event) => {
      event.preventDefault();

      controls.distance = THREE.MathUtils.clamp(
        controls.distance + event.deltaY * 0.018,
        controls.minDistance,
        controls.maxDistance
      );

      updateCamera();
    }, { passive: false });

    renderer.domElement.style.cursor = "grab";
    updateCamera();

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

      dust.rotation.y = elapsed * 0.015;
      dust.position.y = Math.sin(elapsed * 0.18) * 0.12;

      warmFill.intensity = 38 + Math.sin(elapsed * 0.7) * 2.5;
      coolFill.intensity = 24 + Math.cos(elapsed * 0.55) * 2;

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
    spawn: { x: 0.0, z: 12.7, yaw: 0 },
    relic: { id: "generic", name: "The Legend of Zelda: Twilight Princess Relic", x: -10.0, z: -13.3 },
    env:   { background: 0x241d18, fogColor: 0x34291f, fogDensity: 0.017 },
    doors: {
      next: { x: 12.0, z: -11.3 },
      prev: { x: -12.0, z: 8.7 }
    }
  };
}

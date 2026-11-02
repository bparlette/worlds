// @world {"id": "1087", "title": "GoldenEye 007", "sub": "Dam", "system": "3D Render"}
// Converted from 1087-goldeneye_007_dam.html into a Back Roms World Walker module.

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

    

    // Scene
    // scene redirect
    scene.background = new THREE.Color(0x9fc3d6);
    scene.fog = new THREE.Fog(0x9fc3d6, 75, 180);

    camera = dummyCamera();

    renderer = dummyRenderer();

    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    

    // Lighting
    scene.add(new THREE.HemisphereLight(0xd9efff, 0x5a5140, 2.1));

    const sun = new THREE.DirectionalLight(0xfff3d7, 3.2);
    sun.position.set(-55, 80, 35);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -90;
    sun.shadow.camera.right = 90;
    sun.shadow.camera.top = 90;
    sun.shadow.camera.bottom = -90;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 220;
    sun.shadow.bias = -0.00035;
    sun.shadow.normalBias = 0.025;
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0x91b9dc, 0.7);
    fill.position.set(50, 30, -60);
    scene.add(fill);

    // Voxel materials
    const materials = {
      concrete: new THREE.MeshStandardMaterial({
        color: 0x9a9b91,
        roughness: 0.92
      }),
      concreteLight: new THREE.MeshStandardMaterial({
        color: 0xb7b6a9,
        roughness: 0.9
      }),
      concreteDark: new THREE.MeshStandardMaterial({
        color: 0x6f736d,
        roughness: 0.95
      }),
      roof: new THREE.MeshStandardMaterial({
        color: 0x4e6657,
        roughness: 0.82
      }),
      roofEdge: new THREE.MeshStandardMaterial({
        color: 0x344d40,
        roughness: 0.85
      }),
      metal: new THREE.MeshStandardMaterial({
        color: 0x353d3d,
        roughness: 0.58,
        metalness: 0.35
      }),
      metalLight: new THREE.MeshStandardMaterial({
        color: 0x68716c,
        roughness: 0.5,
        metalness: 0.4
      }),
      paving: new THREE.MeshStandardMaterial({
        color: 0x777b73,
        roughness: 0.96
      }),
      water: new THREE.MeshStandardMaterial({
        color: 0x317b9d,
        roughness: 0.2,
        metalness: 0.18
      }),
      snow: new THREE.MeshStandardMaterial({
        color: 0xe8edf0,
        roughness: 0.95
      }),
      rock: new THREE.MeshStandardMaterial({
        color: 0x59615f,
        roughness: 1
      }),
      rockLight: new THREE.MeshStandardMaterial({
        color: 0x777e78,
        roughness: 1
      }),
      glass: new THREE.MeshStandardMaterial({
        color: 0x547b89,
        roughness: 0.22,
        metalness: 0.25
      }),
      man: new THREE.MeshStandardMaterial({
        color: 0x786b4e,
        roughness: 0.9
      }),
      manDark: new THREE.MeshStandardMaterial({
        color: 0x303434,
        roughness: 0.9
      })
    };

    function box(w, h, d, material, x, y, z, cast = true, receive = true) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        material
      );
      mesh.position.set(x, y, z);
      mesh.castShadow = cast;
      mesh.receiveShadow = receive;
      scene.add(mesh);
      return mesh;
    }

    function voxelLine(points, material, thickness = 1, cast = true) {
      for (let i = 0; i < points.length - 1; i++) {
        const a = points[i];
        const b = points[i + 1];
        const dx = b[0] - a[0];
        const dy = b[1] - a[1];
        const dz = b[2] - a[2];
        const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const mesh = new THREE.Mesh(
          new THREE.CylinderGeometry(thickness, thickness, length, 1),
          material
        );
        mesh.position.set(
          (a[0] + b[0]) / 2,
          (a[1] + b[1]) / 2,
          (a[2] + b[2]) / 2
        );
        mesh.rotation.set(
          Math.atan2(dz, dx),
          Math.atan2(-dy, Math.sqrt(dx * dx + dz * dz)),
          0
        );
        mesh.castShadow = cast;
        scene.add(mesh);
      }
    }

    // Terrain and mountain backdrop
    box(220, 18, 180, materials.rock, 0, -12, 0, false, true);
    box(245, 7, 205, materials.rockLight, 0, -1.5, 0, false, true);

    // Snow caps
    const snowCap = new THREE.Mesh(
      new THREE.CylinderGeometry(112, 135, 9, 1, 1, false),
      materials.snow
    );
    snowCap.position.set(0, 8, -3);
    snowCap.receiveShadow = true;
    scene.add(snowCap);

    // Mountain ridges on left and right
    for (let i = 0; i < 12; i++) {
      const x = -110 + i * 20;
      const height = 18 + (i % 4) * 3.5;
      const rock = new THREE.Mesh(
        new THREE.CylinderGeometry(
          12 + (i % 3) * 3,
          18 + (i % 4) * 3,
          height,
          5,
          1,
          false
        ),
        i % 2 ? materials.rock : materials.rockLight
      );
      rock.position.set(x, height / 2 - 2, -45);
      rock.rotation.z = (i % 2 ? 1 : -1) * 0.025;
      rock.receiveShadow = true;
      scene.add(rock);
    }

    // Water
    const water = new THREE.Mesh(
      new THREE.PlaneGeometry(250, 250, 1, 1),
      materials.water
    );
    water.rotation.x = -Math.PI / 2;
    water.position.set(0, 0.4, 0);
    water.receiveShadow = true;
    scene.add(water);

    // Waterline foam
    const foam = new THREE.Mesh(
      new THREE.PlaneGeometry(250, 250, 1, 1),
      new THREE.MeshBasicMaterial({
        color: 0xb9e5ee,
        transparent: true,
        opacity: 0.28,
        depthWrite: false
      })
    );
    foam.rotation.x = -Math.PI / 2;
    foam.position.set(0, 0.48, 0);
    scene.add(foam);

    // Main dam
    box(170, 10, 15, materials.concrete, 0, 1, 0);
    box(176, 1.2, 16, materials.concreteLight, 0, 6.3, 0);

    // Dam face paneling
    for (let x = -78; x <= 78; x += 12) {
      box(
        0.35,
        8.6,
        0.18,
        materials.concreteDark,
        x,
        1,
        7.56,
        false,
        true
      );
    }

    // Walkway
    box(172, 0.35, 7, materials.paving, 0, 7.05, 0);

    // Main tower
    const tower = new THREE.Group();
    tower.position.set(43, 7.15, 0);
    scene.add(tower);

    // Tower body
    box(10, 7.5, 10, materials.concrete, 0, 3.75, 0);
    box(10.8, 0.45, 10.8, materials.concreteLight, 0, 7.55, 0);

    // Open observation deck
    box(9.4, 0.35, 9.4, materials.concreteLight, 0, 8.25, 0);

    // Roof
    const roof = new THREE.Mesh(
      new THREE.CylinderGeometry(7.1, 7.1, 1.2, 8),
      materials.roof
    );
    roof.position.y = 9.2;
    roof.rotation.y = Math.PI / 8;
    roof.castShadow = true;
    roof.receiveShadow = true;
    tower.add(roof);

    // Roof rim
    const roofRim = new THREE.Mesh(
      new THREE.CylinderGeometry(6.65, 6.65, 0.22, 8),
      materials.roofEdge
    );
    roofRim.position.y = 9.85;
    roofRim.rotation.y = Math.PI / 8;
    roofRim.castShadow = true;
    tower.add(roofRim);

    // Tower windows
    box(2.4, 1.7, 0.12, materials.glass, -2.7, 3.2, 5.06);
    box(2.4, 1.7, 0.12, materials.glass, 2.7, 3.2, 5.06);
    box(0.12, 1.7, 2.4, materials.glass, -5.06, 3.2, 0);
    box(0.12, 1.7, 2.4, materials.glass, 5.06, 3.2, 0);

    // Lower tower door
    box(2.2, 3.1, 0.12, materials.metal, 0, 1.55, 5.08);

    // Exterior ladder
    const ladder = new THREE.Group();
    ladder.position.set(14.8, 1, 0);
    tower.add(ladder);

    for (let y = 0.3; y < 6.5; y += 0.65) {
      box(0.13, 0.12, 1.35, materials.metal, 0, y, 0);
    }
    box(0.11, 6.4, 0.11, materials.metal, -0.56, 3.2, 0);
    box(0.11, 6.4, 0.11, materials.metal, 0.56, 3.2, 0);

    // Upper balcony railing
    const railPoints = [
      [-10, 8.65, -5],
      [10, 8.65, -5],
      [10, 8.65, 5],
      [-10, 8.65, 5]
    ];
    voxelLine(railPoints, materials.metal, 0.1);

    for (let i = 0; i < 4; i++) {
      const point = railPoints[i];
      const next = railPoints[(i + 1) % 4];
      const midpoint = [
        (point[0] + next[0]) / 2,
        8.65,
        (point[2] + next[2]) / 2
      ];
      box(0.12, 0.9, 0.12, materials.metal, midpoint[0], 8.1, midpoint[2]);
    }

    // Balcony grating
    for (let i = 0; i < 18; i++) {
      const x = -9 + i;
      box(0.07, 0.07, 9.4, materials.metal, x, 8.46, 0);
    }

    // Observation deck railing
    const deckRail = [
      [-8, 8.0, -4],
      [8, 8.0, -4],
      [8, 8.0, 4],
      [-8, 8.0, 4]
    ];
    voxelLine(deckRail, materials.metal, 0.075);
    for (let i = 0; i < 4; i++) {
      const p = deckRail[i];
      const q = deckRail[(i + 1) % 4];
      const mid = [
        (p[0] + q[0]) / 2,
        7.65,
        (p[2] + q[2]) / 2
      ];
      box(0.07, 0.65, 0.07, materials.metal, mid[0], 7.65, mid[2]);
    }

    // Ladder to balcony
    const balconyLadder = new THREE.Group();
    balconyLadder.position.set(15.6, 7.2, 0);
    tower.add(balconyLadder);

    for (let y = 0; y < 5.1; y += 0.5) {
      box(0.1, 0.1, 1.15, materials.metal, 0, y, 0);
    }
    box(0.09, 5.1, 0.09, materials.metal, -0.5, 2.55, 0);
    box(0.09, 5.1, 0.09, materials.metal, 0.5, 2.55, 0);

    // Walkway guardrails
    const walkwayRails = [
      [
        [-82, 8.1, -3],
        [82, 8.1, -3]
      ],
      [
        [-82, 8.1, 3],
        [82, 8.1, 3]
      ],
      [
        [-82, 8.1, -5.5],
        [-82, 8.1, 5.5]
      ],
      [
        [82, 8.1, -5.5],
        [82, 8.1, 5.5]
      ]
    ];

    for (const [a, b] of walkwayRails) {
      voxelLine([a, b], materials.metal, 0.075);
      const mid = [
        (a[0] + b[0]) / 2,
        7.78,
        (a[2] + b[2]) / 2
      ];
      box(0.07, 0.55, 0.07, materials.metal, mid[0], 7.78, mid[2]);
    }

    // Stair tower
    const stairTower = new THREE.Group();
    stairTower.position.set(-43, 7.15, 0);
    scene.add(stairTower);

    box(4, 7.5, 4, materials.concrete, 0, 3.75, 0);
    box(4.6, 0.4, 4.6, materials.concreteLight, 0, 7.55, 0);

    // Stair tower windows
    box(1.2, 1.5, 0.1, materials.glass, 0, 3.2, 2.06);
    box(2.2, 0.12, 0.12, materials.metal, 0, 2.2, 2.12);
    box(0.12, 0.12, 2.2, materials.metal, 0, 2.2, 2.12);

    // Exterior stair tower ladder
    for (let y = 0.3; y < 7; y += 0.6) {
      box(0.1, 0.1, 2.1, materials.metal, 2.1, y, 0);
    }
    box(0.1, 6.6, 0.1, materials.metal, 1.65, 3.3, 0);
    box(0.1, 6.6, 0.1, materials.metal, 2.55, 3.3, 0);

    // Side walkway roof
    const sideRoof = new THREE.Group();
    sideRoof.position.set(-52, 8.2, 0);
    scene.add(sideRoof);

    box(24, 0.25, 10, materials.roof, 0, 0, 0);
    for (let x = -10; x <= 10; x += 2) {
      box(0.08, 0.08, 10, materials.roofEdge, x, 0.16, 0);
    }

    // Ventilation grilles
    for (const x of [-67, -31, 15, 67]) {
      box(4.5, 0.18, 1.2, materials.metal, x, 7.25, 6.4);
      for (let i = 0; i < 5; i++) {
        box(0.1, 0.12, 1.05, materials.metalLight,
          x - 1.6 + i * 0.85, 7.38, 6.4, false, true);
      }
    }

    // Man on balcony
    const man = new THREE.Group();
    man.position.set(6.8, 8.48, 0.6);
    tower.add(man);

    // Legs
    box(0.28, 0.85, 0.3, materials.metalDark, -0.18, 0.42, 0);
    box(0.28, 0.85, 0.3, materials.metalDark, 0.18, 0.42, 0);

    // Torso
    const torso = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.32, 0.9, 8),
      materials.man
    );
    torso.position.y = 1.25;
    torso.rotation.z = -0.12;
    torso.castShadow = true;
    man.add(torso);

    // Head
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.23, 10, 8),
      materials.manDark
    );
    head.position.y = 2.05;
    head.castShadow = true;
    man.add(head);

    // Arms
    const leftArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.13, 0.8, 7),
      materials.man
    );
    leftArm.position.set(-0.4, 1.35, 0);
    leftArm.rotation.z = -0.7;
    leftArm.rotation.x = -0.2;
    leftArm.castShadow = true;
    man.add(leftArm);

    const rightArm = leftArm.clone();
    rightArm.position.set(0.4, 1.35, 0);
    rightArm.rotation.z = 0.7;
    rightArm.rotation.x = -0.2;
    rightArm.castShadow = true;
    man.add(rightArm);

    // Small utility building
    const utility = new THREE.Group();
    utility.position.set(-62, 8.2, 0);
    scene.add(utility);

    box(12, 3.6, 7, materials.concrete, 0, 1.8, 0);
    box(12.6, 0.35, 7.6, materials.roof, 0, 3.75, 0);

    for (let x = -4.5; x <= 4.5; x += 1.5) {
      box(0.85, 1.2, 0.1, materials.glass, x, 2.2, 3.56);
    }

    // Drain / manhole
    const manhole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.65, 0.65, 0.12, 16),
      materials.metal
    );
    manhole.position.set(-3, 7.32, 0);
    manhole.receiveShadow = true;
    scene.add(manhole);

    // Small service bollards
    for (const x of [-78, -65, -52, 55, 68]) {
      const bollard = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.28, 0.8, 8),
        materials.metal
      );
      bollard.position.set(x, 8.55, 5.8);
      bollard.castShadow = true;
      scene.add(bollard);
    }

    // Cable conduits along dam
    for (const z of [-5.8, 5.8]) {
      voxelLine([
        [-80, 7.75, z],
        [80, 7.75, z]
      ], materials.metalLight, 0.055);
    }

    // Small foreground ledge
    box(55, 3.2, 12, materials.concreteDark, -15, 3.3, 12, false, true);

    // Custom orbit controls
    const orbit = {
      theta: 0.78,
      phi: 0.95,
      radius: 125,
      target: new THREE.Vector3(0, 7, 0),
      dragging: false,
      previousX: 0,
      previousY: 0,
      zoom: 0
    };

    function updateCamera() {
      orbit.phi = THREE.MathUtils.clamp(orbit.phi, 0.18, 1.42);
      orbit.radius = THREE.MathUtils.clamp(orbit.radius, 38, 220);

      const sinPhi = Math.sin(orbit.phi);
      camera.position.set(
        orbit.target.x + orbit.radius * sinPhi * Math.sin(orbit.theta),
        orbit.target.y + orbit.radius * Math.cos(orbit.phi),
        orbit.target.z + orbit.radius * sinPhi * Math.cos(orbit.theta)
      );
      camera.lookAt(orbit.target);
    }

    renderer.domElement.addEventListener("pointerdown", (event) => {
      orbit.dragging = true;
      orbit.previousX = event.clientX;
      orbit.previousY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
      renderer.domElement.style.cursor = "grabbing";
    });

    renderer.domElement.addEventListener("pointermove", (event) => {
      if (!orbit.dragging) return;

      const dx = event.clientX - orbit.previousX;
      const dy = event.clientY - orbit.previousY;

      orbit.previousX = event.clientX;
      orbit.previousY = event.clientY;

      orbit.theta -= dx * 0.006;
      orbit.phi -= dy * 0.005;
      updateCamera();
    });

    function endDrag(event) {
      orbit.dragging = false;
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
      orbit.radius *= Math.exp(event.deltaY * 0.001);
      updateCamera();
    }, { passive: false });

    // Touch pinch support
    const activePointers = new Map();
    let pinchDistance = 0;

    renderer.domElement.addEventListener("pointerdown", (event) => {
      activePointers.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY
      });

      if (activePointers.size === 2) {
        const points = [...activePointers.values()];
        pinchDistance = Math.hypot(
          points[0].x - points[1].x,
          points[0].y - points[1].y
        );
      }
    });

    renderer.domElement.addEventListener("pointermove", (event) => {
      if (!activePointers.has(event.pointerId)) return;

      const previous = activePointers.get(event.pointerId);
      activePointers.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY
      });

      if (activePointers.size === 2) {
        const points = [...activePointers.values()];
        const distance = Math.hypot(
          points[0].x - points[1].x,
          points[0].y - points[1].y
        );

        if (pinchDistance > 0) {
          orbit.radius *= pinchDistance / Math.max(distance, 1);
          updateCamera();
        }
        pinchDistance = distance;
      }
    });

    function removePointer(event) {
      activePointers.delete(event.pointerId);
      if (activePointers.size < 2) pinchDistance = 0;
    }

    renderer.domElement.addEventListener("pointerup", removePointer);
    renderer.domElement.addEventListener("pointercancel", removePointer);

    // Resize
    addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(innerWidth, innerHeight);
    });

    // Animation
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      const time = elapsed * 0.001;

      // Gentle water shimmer
      foam.material.opacity = 0.23 + Math.sin(time * 0.8) * 0.045;

      // Very subtle moving water highlights
      for (let i = 0; i < 24; i++) {
        const highlight = new THREE.Mesh(
          new THREE.PlaneGeometry(
            1.5 + Math.sin(i * 1.7) * 0.4,
            0.08
          ),
          new THREE.MeshBasicMaterial({
            color: 0xc8f2f7,
            transparent: true,
            opacity: 0.25,
            depthWrite: false
          })
        );
        highlight.rotation.x = -Math.PI / 2;
        highlight.position.set(
          -100 + i * 10,
          0.58,
          Math.sin(i * 2.3) * 8
        );
        scene.add(highlight);
      }

      renderer.render(scene, camera);
    }

    updateCamera();
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
    relic: { id: "generic", name: "GoldenEye 007 Relic", x: -10.0, z: -12.0 },
    env:   { background: 0x9fc3d6, fogColor: 0x9fc3d6, fogDensity: 0.025 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 },
      east: { x: 12.0, z: 10.0 },
      west: { x: -12.0, z: -10.0 }
    }
  };
}

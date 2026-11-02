// @world {"id": "1064", "title": "Sonic Adventure 2", "sub": "City Escape", "system": "3D Render"}
// Converted from 1064-sonic_adventure_2_city_escape.html into a Back Roms World Walker module.

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

    // scene redirect
    scene.background = new THREE.Color(0xb9e5ef);
    scene.fog = new THREE.Fog(0xb9e5ef, 38, 95);

    camera = dummyCamera();

    renderer = dummyRenderer();

    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    

    const hemi = new THREE.HemisphereLight(0xdaf5ff, 0x71806b, 2.2);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xfff3d1, 3.4);
    sun.position.set(-22, 34, 18);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -35;
    sun.shadow.camera.right = 35;
    sun.shadow.camera.top = 35;
    sun.shadow.camera.bottom = -35;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 90;
    sun.shadow.bias = -0.00035;
    scene.add(sun);

    // -------------------------------------------------------------------------
    // Materials
    // -------------------------------------------------------------------------

    const material = (color, roughness = 0.85, extra = {}) =>
      new THREE.MeshStandardMaterial({
        color,
        roughness,
        ...extra
      });

    const mats = {
      road: material(0x7c8587, 0.98),
      roadDark: material(0x697578, 0.98),
      sidewalk: material(0xd9d4c4, 0.92),
      curb: material(0xe5dfd1, 0.9),
      grass: material(0x86a65a, 0.95),
      grassDark: material(0x65874d, 0.95),
      trunk: material(0x76533b, 0.95),
      leafA: material(0x397b45, 0.94),
      leafB: material(0x55a64f, 0.94),
      leafC: material(0x78b95e, 0.94),
      brick: material(0xa94f37, 0.9),
      brickLight: material(0xc16a4b, 0.9),
      brickDark: material(0x79392c, 0.9),
      white: material(0xe7e4d8, 0.86),
      yellow: material(0xe8b54d, 0.8),
      orange: material(0xd97836, 0.8),
      teal: material(0x387d83, 0.8),
      blue: material(0x4f789a, 0.8),
      red: material(0xc84537, 0.8),
      glass: material(0x7097a9, 0.28, {
        metalness: 0.15,
        roughness: 0.25
      }),
      roof: material(0x9b4838, 0.9),
      roofDark: material(0x684038, 0.9),
      stone: material(0xb9aa91, 0.95),
      dark: material(0x28363c, 0.85)
    };

    // -------------------------------------------------------------------------
    // Voxel helpers
    // -------------------------------------------------------------------------

    const world = new THREE.Group();
    scene.add(world);

    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

    function box(
      parent,
      x,
      y,
      z,
      sx,
      sy,
      sz,
      mat,
      castShadow = true,
      receiveShadow = true
    ) {
      const mesh = new THREE.Mesh(boxGeometry, mat);
      mesh.position.set(x, y, z);
      mesh.scale.set(sx, sy, sz);
      mesh.castShadow = castShadow;
      mesh.receiveShadow = receiveShadow;
      parent.add(mesh);
      return mesh;
    }

    function addLine(parent, points, mat, thickness = 0.09) {
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(
          points.map((p) => new THREE.Vector3(...p))
        ),
        mat
      );
      parent.add(line);
      return line;
    }

    // -------------------------------------------------------------------------
    // Road and sidewalks
    // -------------------------------------------------------------------------

    const road = box(
      world,
      0,
      0.02,
      0,
      9.2,
      0.16,
      125,
      mats.road,
      false,
      true
    );

    // Road center line.
    box(world, 0, 0.12, 0, 0.11, 0.025, 120, mats.yellow, false, true);
    box(world, 0, 0.12, 0, 0.11, 0.025, 120, mats.yellow, false, true);

    // Dashed lane markers.
    for (let z = -58; z < 58; z += 7) {
      box(world, -3.25, 0.13, z, 0.09, 0.025, 3.1, mats.white, false, true);
      box(world, 3.25, 0.13, z, 0.09, 0.025, 3.1, mats.white, false, true);
    }

    // Sidewalks and curbs.
    box(world, -4.4, 0.14, 0, 0.7, 0.28, 125, mats.sidewalk, false, true);
    box(world, 4.4, 0.14, 0, 0.7, 0.28, 125, mats.sidewalk, false, true);

    box(world, -4.68, 0.2, 0, 0.18, 0.35, 125, mats.curb, false, true);
    box(world, 4.68, 0.2, 0, 0.18, 0.35, 125, mats.curb, false, true);

    // Road edge strips.
    for (const side of [-1, 1]) {
      box(
        world,
        side * 4.28,
        0.13,
        0,
        0.13,
        0.03,
        120,
        mats.grassDark,
        false,
        true
      );
    }

    // -------------------------------------------------------------------------
    // Buildings
    // -------------------------------------------------------------------------

    const buildingMaterials = [
      mats.white,
      mats.teal,
      mats.blue,
      mats.orange,
      mats.stone,
      mats.red
    ];

    function createBuilding({
      x,
      z,
      width,
      depth,
      floors,
      wallMat,
      roofMat = mats.roof,
      accentMat = mats.white,
      rotation = 0
    }) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      group.rotation.y = rotation;
      world.add(group);

      const wall = box(
        group,
        0,
        3.2,
        0,
        width,
        floors * 2.35,
        depth,
        wallMat
      );
      wall.receiveShadow = true;

      // Decorative horizontal band between floors.
      for (let floor = 1; floor < floors; floor++) {
        box(
          group,
          0,
          floor * 2.35,
          0,
          width + 0.12,
          0.16,
          depth + 0.12,
          accentMat
        );
      }

      // Roof slab.
      box(
        group,
        0,
        floors * 2.35 + 0.08,
        0,
        width + 0.45,
        0.22,
        depth + 0.45,
        roofMat
      );

      // Gabled roof made from stacked blocks.
      const roofRise = 1.15;
      const roofSteps = 3;
      for (let i = 0; i < roofSteps; i++) {
        const stepWidth = (width + 0.45) / 2;
        const stepDepth = (depth + 0.45) / 2;
        const y = floors * 2.35 + 0.2 + i * 0.34;
        box(
          group,
          0,
          y,
          0,
          stepWidth * 2,
          0.28,
          stepDepth * 2,
          roofMat
        );
      }

      // Windows on both visible street-facing sides.
      const windowWidth = 0.72;
      const windowHeight = 1.1;
      const windowFrame = 0.08;

      for (let floor = 0; floor < floors; floor++) {
        const wy = 1.25 + floor * 2.35;

        for (let ix = 0; ix < 3; ix++) {
          const wx = -width * 0.32 + ix * width * 0.215;

          box(
            group,
            wx,
            wy,
            depth * 0.5 + 0.035,
            windowWidth,
            windowHeight,
            windowFrame,
            mats.white
          );

          box(
            group,
            wx,
            wy,
            depth * 0.5 + 0.09,
            windowWidth - 0.18,
            windowHeight - 0.18,
            0.035,
            mats.glass
          );

          box(
            group,
            wx,
            wy,
            depth * 0.5 + 0.12,
            0.045,
            windowHeight - 0.2,
            0.035,
            mats.white
          );
        }

        // Side windows.
        for (let iz = 0; iz < 2; iz++) {
          const wz = -depth * 0.29 + iz * depth * 0.18;
          box(
            group,
            width * 0.5 + 0.035,
            wy,
            wz,
            windowFrame,
            windowHeight,
            windowWidth,
            mats.white
          );
          box(
            group,
            width * 0.5 + 0.09,
            wy,
            wz,
            0.035,
            windowHeight - 0.18,
            windowWidth - 0.18,
            mats.glass
          );
        }
      }

      // Ground-floor shopfront.
      const shopY = 1.25;
      const shopZ = depth * 0.5 + 0.08;

      box(
        group,
        0,
        shopY,
        shopZ,
        width * 0.72,
        1.15,
        0.08,
        accentMat
      );

      box(
        group,
        0,
        shopY,
        shopZ + 0.04,
        width * 0.58,
        0.8,
        0.05,
        mats.glass
      );

      // Awning.
      const awning = box(
        group,
        0,
        2.05,
        shopZ + 0.18,
        width * 0.76,
        0.12,
        0.85,
        mats.yellow
      );
      awning.rotation.x = -0.12;

      // Chimney.
      box(
        group,
        width * 0.25,
        floors * 2.35 + 1.1,
        -depth * 0.12,
        0.48,
        1.5,
        0.48,
        roofMat
      );

      return group;
    }

    // Left side buildings, set into a stepped hillside.
    const leftBuildings = [
      {
        x: -11.2,
        z: 7,
        width: 7.2,
        depth: 9.5,
        floors: 4,
        wallMat: mats.brick,
        roofMat: mats.roofDark,
        accentMat: mats.white
      },
      {
        x: -12.3,
        z: 20,
        width: 6.4,
        depth: 8.5,
        floors: 4,
        wallMat: mats.stone,
        roofMat: mats.roof,
        accentMat: mats.teal
      },
      {
        x: -13.5,
        z: 36,
        width: 5.8,
        depth: 8.0,
        floors: 3,
        wallMat: mats.blue,
        roofMat: mats.roof,
        accentMat: mats.white
      },
      {
        x: -14.6,
        z: 52,
        width: 5.2,
        depth: 7.5,
        floors: 4,
        wallMat: mats.orange,
        roofMat: mats.roof,
        accentMat: mats.white
      }
    ];

    for (const b of leftBuildings) {
      createBuilding(b);
    }

    // Right side buildings.
    const rightBuildings = [
      {
        x: 11.5,
        z: -7,
        width: 6.8,
        depth: 9.0,
        floors: 4,
        wallMat: mats.white,
        roofMat: mats.roof,
        accentMat: mats.white
      },
      {
        x: 12.7,
        z: 7,
        width: 6.0,
        depth: 8.0,
        floors: 5,
        wallMat: mats.teal,
        roofMat: mats.roofDark,
        accentMat: mats.white
      },
      {
        x: 13.8,
        z: 24,
        width: 5.5,
        depth: 7.5,
        floors: 4,
        wallMat: mats.blue,
        roofMat: mats.roof,
        accentMat: mats.orange
      },
      {
        x: 14.8,
        z: 42,
        width: 5.0,
        depth: 7.0,
        floors: 5,
        wallMat: mats.stone,
        roofMat: mats.roof,
        accentMat: mats.white
      }
    ];

    for (const b of rightBuildings) {
      createBuilding(b);
    }

    // Distant end buildings.
    createBuilding({
      x: -10.5,
      z: 74,
      width: 8.5,
      depth: 8,
      floors: 4,
      wallMat: mats.white,
      roofMat: mats.roof,
      accentMat: mats.teal
    });

    createBuilding({
      x: 10.5,
      z: 74,
      width: 8.5,
      depth: 8,
      floors: 4,
      wallMat: mats.orange,
      roofMat: mats.roof,
      accentMat: mats.white
    });

    // -------------------------------------------------------------------------
    // Instanced voxel trees
    // -------------------------------------------------------------------------

    const treePositions = [
      [-4.0, 2.2, 3.2],
      [-4.0, 2.2, 15.0],
      [-4.0, 2.2, 28.0],
      [-4.0, 2.2, 42.0],
      [4.0, 2.2, -12.0],
      [4.0, 2.2, 0.5],
      [4.0, 2.2, 14.0],
      [4.0, 2.2, 29.0],
      [4.0, 2.2, 45.0]
    ];

    const treeTrunks = new THREE.InstancedMesh(
      boxGeometry,
      mats.trunk,
      treePositions.length
    );
    const treeCrowns = new THREE.InstancedMesh(
      boxGeometry,
      mats.leafA,
      treePositions.length * 5
    );

    treeTrunks.castShadow = true;
    treeTrunks.receiveShadow = true;
    treeCrowns.castShadow = true;
    treeCrowns.receiveShadow = true;

    const dummy = new THREE.Object3D();
    let crownIndex = 0;

    treePositions.forEach((position, index) => {
      dummy.position.set(position[0], position[1] * 0.5, position[2]);
      dummy.scale.set(0.22, position[1] * 0.48, 0.22);
      dummy.updateMatrix();
      treeTrunks.setMatrixAt(index, dummy.matrix);

      for (let layer = 0; layer < 5; layer++) {
        const size = 1.45 - layer * 0.16;
        dummy.position.set(
          (Math.random() - 0.5) * 0.35,
          position[1] * (0.58 + layer * 0.12),
          (Math.random() - 0.5) * 0.35
        );
        dummy.scale.set(size, size, size);
        dummy.rotation.set(
          (Math.random() - 0.5) * 0.18,
          Math.random() * Math.PI,
          (Math.random() - 0.5) * 0.18
        );
        dummy.updateMatrix();
        treeCrowns.setMatrixAt(crownIndex++, dummy.matrix);
      }
    });

    treeTrunks.instanceMatrix.needsUpdate = true;
    treeCrowns.instanceMatrix.needsUpdate = true;
    world.add(treeTrunks, treeCrowns);

    // -------------------------------------------------------------------------
    // Street details
    // -------------------------------------------------------------------------

    // Street lamps.
    const lampMaterial = material(0x304650, 0.6);
    const lampGlow = material(0xffe5a3, 0.45);

    function createLamp(x, z, facing = 0) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      group.rotation.y = facing;
      world.add(group);

      box(group, 0, 0.45, 0, 0.16, 0.9, 0.16, lampMaterial);
      box(group, 0, 1.0, 0, 0.38, 0.16, 0.38, lampMaterial);
      box(group, 0, 1.1, 0, 0.25, 0.18, 0.25, lampGlow);

      const pole = box(
        group,
        0,
        0.5,
        0,
        0.14,
        1,
        0.14,
        lampMaterial
      );
      pole.castShadow = true;
    }

    createLamp(-4.1, 1.5, Math.PI);
    createLamp(4.1, -1.5, -Math.PI);
    createLamp(-4.1, 22, Math.PI);
    createLamp(4.1, 29, -Math.PI);

    // Small voxel pedestrians.
    const people = [
      [-2.8, 2.4, 8, 0.18, 0.28, 0.08, 0.1, 0.1, 0.1],
      [2.6, 2.4, -6, -0.2, 0.3, 0.08, -0.1, 0.12, 0.08],
      [-3.0, 2.4, 32, 0.22, 0.32, 0.09, 0.12, 0.1, 0.1]
    ];

    people.forEach((person, index) => {
      const group = new THREE.Group();
      group.position.set(person[0], person[1], person[2]);
      group.rotation.y = person[3];
      world.add(group);

      const shirt = material(person[4], 0.9);
      const pants = material(person[5], 0.9);
      const skin = material(person[6], 0.85);

      box(group, 0, 0.28, 0, 0.17, 0.42, 0.18, pants);
      box(group, 0, 0.67, 0, 0.24, 0.3, 0.2, shirt);
      box(group, 0, 0.88, 0, 0.15, 0.15, 0.15, skin);

      for (const side of [-1, 1]) {
        box(
          group,
          side * 0.12,
          0.12,
          0,
          0.09,
          0.22,
          0.09,
          pants
        );
      }
    });

    // -------------------------------------------------------------------------
    // Background details and distant sea
    // -------------------------------------------------------------------------

    // Low sea beyond the end of the street.
    box(world, 0, -0.15, 86, 70, 0.3, 18, mats.roadDark, false, true);

    // Distant block buildings.
    for (let i = 0; i < 18; i++) {
      const width = 3 + (i % 3) * 0.8;
      const depth = 4 + (i % 2) * 1.2;
      const floors = 3 + (i % 4);
      const wall = buildingMaterials[i % buildingMaterials.length];

      box(
        world,
        -27 + i * 3.5,
        floors * 2.1,
        89,
        width,
        floors * 2.1,
        depth,
        wall
      );

      box(
        world,
        -27 + i * 3.5,
        floors * 2.1 + 0.15,
        89,
        width + 0.3,
        0.3,
        depth + 0.3,
        mats.roof
      );
    }

    // A few distant trees.
    for (let i = 0; i < 18; i++) {
      const x = -27 + i * 3.5;
      const z = 84 + (i % 2) * 3;
      box(world, x, 1.2, z, 0.22, 2.4, 0.22, mats.trunk);
      box(world, x, 2.6, z, 1.4, 1.4, 1.4, mats.leafB);
    }

    // -------------------------------------------------------------------------
    // Custom camera controls
    // -------------------------------------------------------------------------

    const cameraState = {
      yaw: 0,
      pitch: 0,
      x: 0,
      y: 1.72,
      z: 0,
      moving: false,
      speed: 0
    };

    const initialView = {
      yaw: 0,
      pitch: 0,
      x: 0,
      y: 1.72,
      z: 0
    };

    function updateCamera() {
      const horizontal = Math.cos(cameraState.pitch) * Math.cos(cameraState.yaw);
      const vertical = Math.sin(cameraState.pitch);

      camera.position.set(
        cameraState.x + Math.sin(cameraState.yaw) * horizontal,
        cameraState.y + vertical,
        cameraState.z + Math.cos(cameraState.yaw) * horizontal
      );

      camera.lookAt(
        cameraState.x,
        cameraState.y - 0.03,
        cameraState.z
      );
    }

    updateCamera();

    const pointer = new THREE.Vector2();
    let dragging = false;
    let previousPointer = new THREE.Vector2();
    let previousTime = performance.now();

    renderer.domElement.addEventListener("pointerdown", (event) => {
      dragging = true;
      previousPointer.set(event.clientX, event.clientY);
      renderer.domElement.setPointerCapture(event.pointerId);
    });

    renderer.domElement.addEventListener("pointermove", (event) => {
      if (!dragging) return;

      const dx = event.clientX - previousPointer.x;
      const dy = event.clientY - previousPointer.y;
      previousPointer.set(event.clientX, event.clientY);

      cameraState.yaw -= dx * 0.003;
      cameraState.pitch = THREE.MathUtils.clamp(
        cameraState.pitch + dy * 0.0025,
        -0.65,
        1.15
      );
    });

    function endDrag(event) {
      dragging = false;
      if (event.pointerId !== undefined && renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
    }

    renderer.domElement.addEventListener("pointerup", endDrag);
    renderer.domElement.addEventListener("pointercancel", endDrag);

    renderer.domElement.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        cameraState.moving = true;
        cameraState.speed = THREE.MathUtils.clamp(
          cameraState.speed + event.deltaY * 0.012,
          0,
          2.6
        );
      },
      { passive: false }
    );

    window.addEventListener("keydown", (event) => {
      if (event.key.toLowerCase() === "r") {
        cameraState.yaw = initialView.yaw;
        cameraState.pitch = initialView.pitch;
        cameraState.x = initialView.x;
        cameraState.y = initialView.y;
        cameraState.z = initialView.z;
        cameraState.moving = false;
        cameraState.speed = 0;
      }

      if (event.key === "w" || event.key === "ArrowUp") {
        cameraState.moving = true;
        cameraState.speed = Math.min(2.6, cameraState.speed + 0.55);
      }

      if (event.key === "s" || event.key === "ArrowDown") {
        cameraState.moving = false;
        cameraState.speed = Math.max(0, cameraState.speed - 0.55);
      }
    });

    window.addEventListener("keyup", (event) => {
      if (event.key === "w" || event.key === "ArrowUp") {
        cameraState.moving = false;
      }

      if (event.key === "s" || event.key === "ArrowDown") {
        cameraState.speed = 0;
      }
    });

    window.addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(innerWidth, innerHeight);
    });

    // -------------------------------------------------------------------------
    // Animation
    // -------------------------------------------------------------------------

    function animate(now) {
      requestAnimationFrame(animate);

      const dt = Math.min((now - previousTime) / 1000, 0.05);
      previousTime = now;

      if (cameraState.moving) {
        cameraState.speed = Math.max(
          0,
          cameraState.speed - dt * 0.75
        );

        const direction = cameraState.speed > 0.015 ? 1 : -1;
        cameraState.z += direction * cameraState.speed * dt;

        if (cameraState.z > 64) cameraState.z = 64;
        if (cameraState.z < -62) cameraState.z = -62;
      }

      updateCamera();
      renderer.render(scene, camera);
    }

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
    relic: { id: "generic", name: "Sonic Adventure 2 Relic", x: -10.0, z: -12.0 },
    env:   { background: 0xb9e5ef, fogColor: 0xb9e5ef, fogDensity: 0.025 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 },
      east: { x: 12.0, z: 10.0 },
      west: { x: -12.0, z: -10.0 }
    }
  };
}

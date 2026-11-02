// @world {"id": "1067", "title": "Mega Man 2", "sub": "Wily Castle", "system": "3D Render"}
// Converted from 1067-mega_man_2_wily_castle.html into a Back Roms World Walker module.

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
    scene.background = new THREE.Color(0xb9d4e4);
    scene.fog = new THREE.Fog(0xb9d4e4, 24, 48);

    camera = dummyCamera();

    renderer = dummyRenderer();

    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    document.body.prepend(renderer.domElement);

    // -------------------------------------------------------------------------
    // Lighting
    // -------------------------------------------------------------------------

    scene.add(new THREE.HemisphereLight(0xeaf8ff, 0x64706e, 2.15));

    const sun = new THREE.DirectionalLight(0xfff4dc, 3.2);
    sun.position.set(8, 13, 7);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -12;
    sun.shadow.camera.right = 12;
    sun.shadow.camera.top = 12;
    sun.shadow.camera.bottom = -12;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 35;
    sun.shadow.bias = -0.0008;
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0x9bcaff, 1.15);
    fill.position.set(-7, 5, -8);
    scene.add(fill);

    // -------------------------------------------------------------------------
    // Materials
    // -------------------------------------------------------------------------

    const materials = {
      blue: new THREE.MeshStandardMaterial({
        color: 0x1978d1,
        roughness: 0.62,
        metalness: 0.12
      }),
      blueDark: new THREE.MeshStandardMaterial({
        color: 0x104c83,
        roughness: 0.66,
        metalness: 0.18
      }),
      silver: new THREE.MeshStandardMaterial({
        color: 0xb8c5cb,
        roughness: 0.48,
        metalness: 0.48
      }),
      pale: new THREE.MeshStandardMaterial({
        color: 0xf2f0e8,
        roughness: 0.72,
        metalness: 0.04
      }),
      red: new THREE.MeshStandardMaterial({
        color: 0xe34a36,
        roughness: 0.52,
        metalness: 0.12
      }),
      black: new THREE.MeshStandardMaterial({
        color: 0x17232c,
        roughness: 0.7,
        metalness: 0.18
      }),
      orange: new THREE.MeshStandardMaterial({
        color: 0xf39a32,
        roughness: 0.58,
        metalness: 0.12
      }),
      antenna: new THREE.MeshStandardMaterial({
        color: 0x2b6e96,
        roughness: 0.55,
        metalness: 0.3
      })
    };

    // -------------------------------------------------------------------------
    // Voxel helpers
    // -------------------------------------------------------------------------

    const tower = new THREE.Group();
    scene.add(tower);

    const voxel = (
      x,
      y,
      z,
      sx = 0.5,
      sy = 0.5,
      sz = 0.5,
      material = materials.blue,
      parent = tower
    ) => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(sx, sy, sz),
        material
      );
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    };

    function voxelColumn(
      x,
      z,
      yStart,
      count,
      material = materials.blue,
      parent = tower,
      sx = 0.5,
      sy = 0.5,
      sz = 0.5
    ) {
      for (let i = 0; i < count; i++) {
        voxel(
          x,
          yStart + i * 0.5,
          z,
          sx,
          0.5,
          sz,
          material,
          parent
        );
      }
      return voxelColumn;
    }

    function voxelLine(points, material = materials.silver, parent = tower) {
      for (let i = 0; i < points.length - 1; i++) {
        const a = points[i];
        const b = points[i + 1];
        const dx = b[0] - a[0];
        const dy = b[1] - a[1];
        const dz = b[2] - a[2];
        const length = Math.hypot(dx, dy, dz);
        const mesh = new THREE.Mesh(
          new THREE.CylinderGeometry(0.09, 0.09, length, 6),
          material
        );
        mesh.position.set(
          (a[0] + b[0]) / 2,
          (a[1] + b[1]) / 2,
          (a[2] + b[2]) / 2
        );
        mesh.rotation.set(
          Math.atan2(dz, dy),
          Math.atan2(dx, dz),
          0
        );
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        parent.add(mesh);
      }
    }

    // -------------------------------------------------------------------------
    // Base / plinth
    // -------------------------------------------------------------------------

    const base = new THREE.Group();
    scene.add(base);

    // Main rectangular foundation, built from a grid of stone voxels.
    for (let x = -7; x <= 7; x++) {
      for (let z = -6; z <= 6; z++) {
        const edge = Math.max(Math.abs(x), Math.abs(z));
        const material =
          edge >= 5 ? materials.silver : materials.pale;

        voxel(
          x * 0.82,
          0.12,
          z * 0.82,
          0.78,
          0.24,
          0.78,
          material,
          base
        );
      }
    }

    // Darker front foundation trim.
    for (let x = -6; x <= 6; x++) {
      voxel(
        x * 0.82,
        0.31,
        3.1,
        0.78,
        0.18,
        0.52,
        materials.black,
        base
      );
    }

    // -------------------------------------------------------------------------
    // Main tower body
    // -------------------------------------------------------------------------

    // Broad lower body.
    for (let x = -3; x <= 3; x++) {
      for (let z = -3; z <= 3; z++) {
        const corner =
          Math.abs(x) === 3 && Math.abs(z) === 3;
        const material = corner
          ? materials.blueDark
          : materials.blue;

        voxel(
          x * 0.72,
          0.86,
          z * 0.72,
          0.69,
          0.66,
          0.69,
          material,
          tower
        );
      }
    }

    // Upper body.
    for (let x = -3; x <= 3; x++) {
      for (let z = -3; z <= 3; z++) {
        const corner =
          Math.abs(x) === 3 && Math.abs(z) === 3;
        voxel(
          x * 0.72,
          1.65,
          z * 0.72,
          0.69,
          0.66,
          0.69,
          corner ? materials.blueDark : materials.blue,
          tower
        );
      }
    }

    // Vertical panel details on the front.
    for (let i = 0; i < 5; i++) {
      voxel(
        0,
        1.04 + i * 0.22,
        3.25,
        0.22,
        0.12,
        0.12,
        materials.black,
        tower
      );
    }

    for (let i = 0; i < 3; i++) {
      voxel(
        0,
        2.28 + i * 0.17,
        3.25,
        0.2,
        0.1,
        0.1,
        materials.black,
        tower
      );
    }

    // Side vents.
    for (let i = 0; i < 4; i++) {
      voxel(
        3.55,
        1.25 + i * 0.2,
        -1.2,
        0.12,
        0.16,
        0.34,
        materials.black,
        tower
      );
    }

    // -------------------------------------------------------------------------
    // Chimney / mast on the left
    // -------------------------------------------------------------------------

    const chimney = new THREE.Group();
    tower.add(chimney);

    for (let y = 0; y < 5; y++) {
      voxel(
        -2.75,
        1.8 + y * 0.5,
        -1.25,
        0.9,
        0.48,
        0.9,
        y === 4 ? materials.silver : materials.blue,
        chimney
      );
    }

    // Segmented chimney cap.
    voxel(-2.75, 4.35, -1.25, 1.05, 0.35, 1.05, materials.silver, chimney);
    voxel(-2.75, 4.63, -1.25, 0.82, 0.28, 0.82, materials.blueDark, chimney);

    // Steep voxel spire.
    const spireLevels = [
      { y: 4.92, half: 0.72 },
      { y: 5.38, half: 0.48 },
      { y: 5.84, half: 0.24 }
    ];

    for (const level of spireLevels) {
      for (let x = -level.half; x <= level.half; x++) {
        for (let z = -level.half; z <= level.half; z++) {
          if (Math.abs(x) + Math.abs(z) <= level.half * 1.65) {
            voxel(
              -2.75 + x * 0.46,
              level.y,
              -1.25 + z * 0.46,
              0.44,
              0.42,
              0.44,
              materials.antenna,
              chimney
            );
          }
        }
      }
    }

    // Curved exhaust pipe.
    voxelLine([
      [-3.25, 2.2, -1.25],
      [-3.45, 2.7, -1.25],
      [-3.45, 3.25, -1.25]
    ], materials.silver, chimney);

    // -------------------------------------------------------------------------
    // Skull centerpiece
    // -------------------------------------------------------------------------

    const skull = new THREE.Group();
    skull.position.set(0.65, 1.62, 0.15);
    tower.add(skull);

    // Skull cranium: a cross of pale blocks, leaving dark eye sockets.
    for (let x = -1; x <= 1; x++) {
      for (let z = -1; z <= 1; z++) {
        const corners =
          Math.abs(x) === 1 && Math.abs(z) === 1;
        voxel(
          x * 0.5,
          0.38,
          z * 0.5,
          0.49,
          0.62,
          0.49,
          materials.pale,
          skull
        );
      }
    }

    // Forehead bridge.
    voxel(0, 0.72, 0, 0.72, 0.28, 0.72, materials.pale, skull);

    // Dark eye sockets.
    voxel(-0.34, 0.39, 0.19, 0.36, 0.34, 0.18, materials.black, skull);
    voxel(0.34, 0.39, 0.19, 0.36, 0.34, 0.18, materials.black, skull);

    // Nose.
    voxel(0, 0.19, 0.43, 0.28, 0.28, 0.18, materials.pale, skull);

    // Jaw / lower face.
    for (let x = -1; x <= 1; x++) {
      voxel(
        x * 0.48,
        -0.12,
        0.08,
        0.45,
        0.26,
        0.48,
        materials.pale,
        skull
      );
    }

    // Jaw front teeth.
    for (let i = 0; i < 3; i++) {
      voxel(
        -0.16 + i * 0.16,
        -0.3,
        0.36,
        0.13,
        0.18,
        0.12,
        materials.pale,
        skull
      );
    }

    // Side cheek blocks.
    voxel(-0.85, 0.1, 0.2, 0.28, 0.42, 0.34, materials.pale, skull);
    voxel(0.85, 0.1, 0.2, 0.28, 0.42, 0.34, materials.pale, skull);

    // Skull emblem.
    const emblem = new THREE.Group();
    emblem.position.set(0.65, 2.18, 0.15);
    tower.add(emblem);

    const emblemRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.28, 0.055, 8, 24),
      materials.red
    );
    emblemRing.rotation.x = Math.PI / 2;
    emblemRing.castShadow = true;
    emblem.add(emblemRing);

    const emblemLeaf = new THREE.Mesh(
      new THREE.ConeGeometry(0.19, 0.38, 5),
      materials.orange
    );
    emblemLeaf.rotation.z = Math.PI / 2;
    emblemLeaf.position.set(0, 0.02, 0);
    emblemLeaf.castShadow = true;
    emblem.add(emblemLeaf);

    // -------------------------------------------------------------------------
    // Roof and warning beacon
    // -------------------------------------------------------------------------

    const roof = new THREE.Group();
    roof.position.set(0.55, 2.55, -0.1);
    tower.add(roof);

    // Low pyramidal voxel roof.
    for (let x = -1; x <= 1; x++) {
      for (let z = -1; z <= 1; z++) {
        const corner = Math.abs(x) === 1 && Math.abs(z) === 1;
        voxel(
          x * 0.5,
          0.18,
          z * 0.5,
          0.49,
          0.36,
          0.49,
          corner ? materials.red : materials.blueDark,
          roof
        );
      }
    }

    // Beacon base.
    voxel(0.55, 3.15, -0.1, 0.5, 0.25, 0.5, materials.black, tower);
    voxel(0.55, 3.35, -0.1, 0.4, 0.2, 0.4, materials.orange, tower);

    // -------------------------------------------------------------------------
    // Satellite dish, assembled from a voxel bowl
    // -------------------------------------------------------------------------

    const dish = new THREE.Group();
    dish.position.set(-0.35, 2.72, 0.45);
    dish.rotation.set(-0.45, 0.35, 0.15);
    tower.add(dish);

    // Dish support.
    voxelLine([
      [0, 0, 0],
      [0, 0.75, 0]
    ], materials.silver, dish);

    voxelLine([
      [0, 0.75, 0],
      [-0.35, 1.1, 0.25]
    ], materials.silver, dish);

    // Voxel parabolic-ish bowl.
    for (let ring = 0; ring < 4; ring++) {
      const radius = 0.25 + ring * 0.18;
      const y = 0.05 + ring * 0.13;

      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        voxel(
          x,
          y,
          z,
          0.22,
          0.12,
          0.22,
          materials.silver,
          dish
        );
      }
    }

    // Dish rim and feed.
    voxel(0, 0.56, 0, 0.42, 0.12, 0.42, materials.orange, dish);
    voxelLine([
      [0, 0.55, 0],
      [0, 0.95, 0]
    ], materials.orange, dish);
    voxel(0, 1.0, 0, 0.16, 0.22, 0.16, materials.black, dish);

    // -------------------------------------------------------------------------
    // Side service blocks and antenna
    // -------------------------------------------------------------------------

    const sideService = new THREE.Group();
    tower.add(sideService);

    // Left service tower.
    for (let y = 0; y < 3; y++) {
      voxel(
        -4.25,
        0.75 + y * 0.55,
        -1.65,
        0.8,
        0.5,
        0.8,
        y === 2 ? materials.blueDark : materials.blue,
        sideService
      );
    }

    // Antenna mast.
    voxelLine([
      [-4.25, 1.2, -1.65],
      [-4.25, 3.1, -1.65]
    ], materials.antenna, sideService);

    // Crossbars.
    voxelLine([
      [-4.25, 2.25, -1.65],
      [-5.15, 2.25, -1.65]
    ], materials.antenna, sideService);

    voxelLine([
      [-4.25, 2.25, -1.65],
      [-3.35, 2.25, -1.65]
    ], materials.antenna, sideService);

    // Right service block.
    for (let x = 0; x < 3; x++) {
      voxel(
        3.9 + x * 0.48,
        0.75,
        1.45,
        0.46,
        0.6,
        0.55,
        x === 2 ? materials.blueDark : materials.blue,
        sideService
      );
    }

    // Small front windows.
    voxel(3.9, 1.05, 1.75, 0.3, 0.2, 0.08, materials.black, sideService);
    voxel(4.35, 1.05, 1.75, 0.3, 0.2, 0.08, materials.black, sideService);

    // Side antenna.
    voxelLine([
      [4.75, 1.1, 1.45],
      [4.75, 2.25, 1.45]
    ], materials.antenna, sideService);

    // -------------------------------------------------------------------------
    // Small foreground details
    // -------------------------------------------------------------------------

    const details = new THREE.Group();
    tower.add(details);

    // Two small foreground pylons.
    for (const x of [-3.9, 3.9]) {
      voxel(x, 0.63, 2.65, 0.5, 0.6, 0.5, materials.blue, details);
      voxel(x, 1.05, 2.65, 0.32, 0.3, 0.32, materials.blueDark, details);
    }

    // Small red beacon on the right.
    voxel(3.9, 1.45, 2.65, 0.25, 0.18, 0.25, materials.orange, details);

    // -------------------------------------------------------------------------
    // Ground plane
    // -------------------------------------------------------------------------

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 80),
      new THREE.MeshStandardMaterial({
        color: 0xaacbd4,
        roughness: 0.95,
        metalness: 0
      })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.08;
    ground.receiveShadow = true;
    scene.add(ground);

    // A few low voxel shrubs for scale.
    const shrubMaterial = new THREE.MeshStandardMaterial({
      color: 0x668a68,
      roughness: 1
    });

    function shrub(x, z, size) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      scene.add(group);

      for (let i = 0; i < 5; i++) {
        voxel(
          (Math.random() - 0.5) * size,
          size * (0.25 + Math.random() * 0.45),
          (Math.random() - 0.5) * size,
          size * 0.7,
          size * 0.55,
          size * 0.7,
          shrubMaterial,
          group
        );
      }
    }

    shrub(-7.5, 4.2, 0.8);
    shrub(7.2, 4.8, 0.75);
    shrub(-8, -4.5, 0.65);

    // -------------------------------------------------------------------------
    // Custom orbit controls
    // -------------------------------------------------------------------------

    const controls = {
      target: new THREE.Vector3(0, 1.8, 0),
      radius: 13.8,
      theta: 0.72,
      phi: 1.16,
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
        Math.PI * 0.48
      );

      updateCamera();
    });

    function endDrag(event) {
      controls.dragging = false;
      renderer.domElement.style.cursor = "grab";

      if (event.pointerId !== undefined) {
        try {
          renderer.domElement.releasePointerCapture(event.pointerId);
        } catch (_) {
          // Pointer capture may already have been released.
        }
      }
    }

    renderer.domElement.addEventListener("pointerup", endDrag);
    renderer.domElement.addEventListener("pointercancel", endDrag);
    renderer.domElement.style.cursor = "grab";

    renderer.domElement.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        controls.radius = THREE.MathUtils.clamp(
          controls.radius + event.deltaY * 0.008,
          7.5,
          23
        );
        updateCamera();
      },
      { passive: false }
    );

    window.addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    });

    // -------------------------------------------------------------------------
    // Animation
    // -------------------------------------------------------------------------

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // Gentle beacon pulse.
      materials.orange.emissive = new THREE.Color(0x4a1200);
      materials.orange.emissiveIntensity =
        0.35 + Math.sin(elapsed * 2.8) * 0.2;

      // Very subtle rotating satellite feed.
      dish.rotation.y = 0.35 + Math.sin(elapsed * 0.65) * 0.12;

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
    relic: { id: "generic", name: "Mega Man 2 Relic", x: -10.0, z: -12.0 },
    env:   { background: 0xb9d4e4, fogColor: 0xb9d4e4, fogDensity: 0.025 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 },
      east: { x: 12.0, z: 10.0 },
      west: { x: -12.0, z: -10.0 }
    }
  };
}

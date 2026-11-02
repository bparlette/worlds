// @world {"id": "1005", "title": "Pac-Man", "sub": "The Maze", "system": "3D Render"}
// Converted from 1005-pac_man_the_maze.html into a Back Roms World Walker module.

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

    

    // ------------------------------------------------------------
    // Renderer and scene
    // ------------------------------------------------------------

    renderer = dummyRenderer();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.prepend(renderer.domElement);

    // scene redirect
    scene.background = new THREE.Color(0x080b12);
    scene.fog = new THREE.FogExp2(0x080b12, 0.027);

    camera = dummyCamera();

    // ------------------------------------------------------------
    // Camera controls implemented directly
    // ------------------------------------------------------------

    const controls = {
      theta: -0.55,
      phi: 1.18,
      radius: 13.5,
      target: new THREE.Vector3(0, 1.3, 0),
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
        0.42,
        Math.PI - 0.42
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

    renderer.domElement.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        controls.radius = THREE.MathUtils.clamp(
          controls.radius + event.deltaY * 0.012,
          8.2,
          21
        );
        updateCamera();
      },
      { passive: false }
    );

    updateCamera();

    // ------------------------------------------------------------
    // Lighting
    // ------------------------------------------------------------

    scene.add(new THREE.HemisphereLight(0x91baff, 0x11131c, 1.65));

    const keyLight = new THREE.DirectionalLight(0xd9f2ff, 3.2);
    keyLight.position.set(-4, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.left = -8;
    keyLight.shadow.camera.right = 8;
    keyLight.shadow.camera.top = 8;
    keyLight.shadow.camera.bottom = -8;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 30;
    keyLight.shadow.bias = -0.0004;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x358dff, 2.1);
    rimLight.position.set(6, 3, -7);
    scene.add(rimLight);

    const warmLight = new THREE.PointLight(0xff8b52, 24, 12, 2);
    warmLight.position.set(-4, 2.5, 3);
    scene.add(warmLight);

    // ------------------------------------------------------------
    // Voxel materials
    // ------------------------------------------------------------

    const darkVoxelMaterial = new THREE.MeshStandardMaterial({
      color: 0x101827,
      roughness: 0.62,
      metalness: 0.18
    });

    const darkEdgeMaterial = new THREE.MeshStandardMaterial({
      color: 0x18263a,
      roughness: 0.5,
      metalness: 0.25
    });

    const cyanMaterial = new THREE.MeshStandardMaterial({
      color: 0x35d7ff,
      emissive: 0x087ca5,
      emissiveIntensity: 1.3,
      roughness: 0.35,
      metalness: 0.25
    });

    const blueMaterial = new THREE.MeshStandardMaterial({
      color: 0x247dff,
      emissive: 0x06378c,
      emissiveIntensity: 0.9,
      roughness: 0.45,
      metalness: 0.2
    });

    const redMaterial = new THREE.MeshStandardMaterial({
      color: 0xff355f,
      emissive: 0x8d0828,
      emissiveIntensity: 1.15,
      roughness: 0.38,
      metalness: 0.1
    });

    const yellowMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd34b,
      emissive: 0x7b4b00,
      emissiveIntensity: 0.9,
      roughness: 0.4,
      metalness: 0.15
    });

    const pinkMaterial = new THREE.MeshStandardMaterial({
      color: 0xff63d8,
      emissive: 0x8c126e,
      emissiveIntensity: 1.1,
      roughness: 0.35,
      metalness: 0.12
    });

    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a0f18,
      roughness: 0.88,
      metalness: 0.05
    });

    // ------------------------------------------------------------
    // Maze generation
    //
    // The maze is generated as a 3D grid of cubes.
    // A randomized depth-first path leaves corridors through the maze.
    // ------------------------------------------------------------

    const GRID = 13;
    const CELL = 0.72;
    const maze = new Map();
    const start = new THREE.Vector3();
    const goal = new THREE.Vector3();

    function hash(x, z) {
      const n = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
      return n - Math.floor(n);
    }

    function carveMaze() {
      const cells = [];

      for (let x = 0; x < GRID; x++) {
        for (let z = 0; z < GRID; z++) {
          cells.push({ x, z, y: 0 });
        }
      }

      // Begin at a known location.
      let current = cells[0];
      maze.set(`${current.x},${current.z}`, {
        x: current.x,
        z: current.z,
        y: 0,
        open: true
      });

      const path = [current];

      while (path.length < 58) {
        const candidates = [];

        for (const neighbor of [
          { dx: 0, dz: -1 },
          { dx: 0, dz: 1 },
          { dx: -1, dz: 0 },
          { dx: 1, dz: 0 }
        ]) {
          const nx = current.x + neighbor.dx;
          const nz = current.z + neighbor.dz;

          if (nx >= 0 && nx < GRID && nz >= 0 && nz < GRID) {
            if (!maze.has(`${nx},${nz}`)) {
              candidates.push({
                cell: { x: nx, z: nz },
                distance: hash(nx, nz)
              });
            }
          }
        }

        if (candidates.length === 0) {
          const last = path[path.length - 1];
          goal.set(last.x, 0, last.z);
          break;
        }

        const next = candidates[
          candidates.reduce(
            (sum, candidate) =>
              candidate.distance - sum < 0 ? candidate : sum,
            0
          )
        ];

        current = next.cell;
        maze.set(`${current.x},${current.z}`, {
          x: current.x,
          z: current.z,
          y: 0,
          open: true
        });

        path.push(current);
      }

      // Build the voxel structure from the maze path.
      for (let y = 0; y < 5; y++) {
        for (let x = 0; x < GRID; x++) {
          for (let z = 0; z < GRID; z++) {
            const key = `${x},${z}`;
            const record = maze.get(key);

            if (!record) continue;

            const insidePath = path.some(
              (point) => point.x === x && point.z === z
            );

            const isWall = y > 0 && !insidePath;
            const isOuterWall =
              x === 0 || x === GRID - 1 || z === 0 || z === GRID - 1;

            let material;

            if (y === 0 && insidePath) {
              material = darkEdgeMaterial;
            } else if (isOuterWall || isWall) {
              material = darkVoxelMaterial;
            } else {
              material = darkEdgeMaterial;
            }

            const voxel = new THREE.Mesh(
              new THREE.BoxGeometry(CELL, CELL, CELL),
              material
            );

            voxel.position.set(
              x * CELL - (GRID - 1) * CELL * 0.5,
              y * CELL,
              z * CELL - (GRID - 1) * CELL * 0.5
            );

            voxel.castShadow = true;
            voxel.receiveShadow = true;
            scene.add(voxel);

            // Bright cyan edge on the top of every voxel.
            const edge = new THREE.Mesh(
              new THREE.BoxGeometry(CELL * 0.93, 0.025, CELL * 0.93),
              cyanMaterial
            );

            edge.position.copy(voxel.position);
            edge.position.y += CELL * 0.49;
            edge.castShadow = false;
            scene.add(edge);
          }
        }
      }

      start.set(0, 0, 0);
    }

    carveMaze();

      // ------------------------------------------------------------
      // Decorative particles
      // ------------------------------------------------------------

      const particles = [];
      const particleGeometry = new THREE.SphereGeometry(0.055, 10, 8);

      for (let i = 0; i < 120; i++) {
        const material =
          i % 3 === 0
            ? cyanMaterial
            : i % 3 === 1
              ? blueMaterial
              : darkEdgeMaterial;

        const particle = new THREE.Mesh(
          particleGeometry,
          material
        );

        const x = (hash(i, 1) - 0.5) * 11.5;
        const z = (hash(i, 2) - 0.5) * 11.5;
        const y = 0.4 + hash(i, 3) * 5.2;

        particle.position.set(x, y, z);
        particle.userData = {
          baseY: y,
          phase: hash(i, 4) * Math.PI * 2,
          speed: 0.45 + hash(i, 5) * 0.55
        };

        scene.add(particle);
        particles.push(particle);
      }

      // ------------------------------------------------------------
      // Animated glowing marker
      // ------------------------------------------------------------

      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 20, 16),
        yellowMaterial
      );

      marker.position.set(
        start.x * CELL - (GRID - 1) * CELL * 0.5,
        0.42,
        start.z * CELL - (GRID - 1) * CELL * 0.5
      );

      marker.castShadow = true;
      scene.add(marker);

      const goalMarker = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 18, 14),
        pinkMaterial
      );

      goalMarker.position.set(
        goal.x * CELL - (GRID - 1) * CELL * 0.5,
        0.42,
        goal.z * CELL - (GRID - 1) * CELL * 0.5
      );

      goalMarker.castShadow = true;
      scene.add(goalMarker);

      // ------------------------------------------------------------
    // Animation
    // ------------------------------------------------------------

    const clock = new THREE.Clock();

    function animate() {
      const elapsed = clock.getElapsedTime();

      for (const particle of particles) {
        const data = particle.userData;
        particle.position.y =
          data.baseY + Math.sin(elapsed * data.speed + data.phase) * 0.16;
        particle.position.x +=
          Math.sin(elapsed * 0.35 + data.phase) * 0.00055;
        particle.position.z +=
          Math.cos(elapsed * 0.3 + data.phase) * 0.00045;
      }

      marker.position.y = 0.42 + Math.sin(elapsed * 2.2) * 0.08;
      goalMarker.position.y = 0.42 + Math.sin(elapsed * 1.7 + 1.2) * 0.08;

      const pulse = 0.5 + 0.5 * Math.sin(elapsed * 2.5);
      marker.scale.setScalar(0.85 + pulse * 0.35);
      goalMarker.scale.setScalar(0.85 + (1 - pulse) * 0.35);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
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
    relic: { id: "generic", name: "Pac-Man Relic", x: -10.0, z: -12.0 },
    env:   { background: 0x080b12, fogColor: 0x080b12, fogDensity: 0.027 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 },
      east: { x: 12.0, z: 10.0 },
      west: { x: -12.0, z: -10.0 }
    }
  };
}

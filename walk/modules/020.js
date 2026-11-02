// @world {"id": "020", "title": "Kirby&#x27;s Dream Land", "sub": "Dream Land \u2014 Star Door Hill", "system": "Console"}
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
  // (strict modules throw where sloppy scripts did not): px, py, pz
  let px = 0;
  let py = 0;
  let pz = 0;

    

    // ---------------------------------------------------------------------
    // Renderer, scene, and camera
    // ---------------------------------------------------------------------
    renderer = dummyRenderer();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    

    // scene redirect
    scene.background = new THREE.Color(0xb9d8df);
    scene.fog = new THREE.Fog(0xb9d8df, 18, 38);

    camera = dummyCamera();

    camera.position.set(8.5, 5.2, 11.5);

    // ---------------------------------------------------------------------
    // Direct camera controls: orbit + zoom
    // ---------------------------------------------------------------------
    const controls = {
      target: new THREE.Vector3(0, 2.2, 0),
      theta: 0.55,
      phi: 1.25,
      radius: 14,
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
    });

    renderer.domElement.addEventListener("pointermove", (event) => {
      if (!controls.dragging) return;

      const dx = event.clientX - controls.lastX;
      const dy = event.clientY - controls.lastY;

      controls.lastX = event.clientX;
      controls.lastY = event.clientY;

      controls.theta -= dx * 0.006;
      controls.phi = THREE.MathUtils.clamp(controls.phi - dy * 0.005, 0.65, 1.85);
      updateCamera();
    });

    renderer.domElement.addEventListener("pointerup", (event) => {
      controls.dragging = false;
      if (renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
    });

    renderer.domElement.addEventListener("pointercancel", () => {
      controls.dragging = false;
    });

    renderer.domElement.addEventListener("wheel", (event) => {
      event.preventDefault();
      controls.radius = THREE.MathUtils.clamp(
        controls.radius + event.deltaY * 0.008,
        8,
        24
      );
      updateCamera();
    }, { passive: false });

    updateCamera();

    // ---------------------------------------------------------------------
    // Lighting
    // ---------------------------------------------------------------------
    scene.add(new THREE.HemisphereLight(0xe9fbff, 0x6b8b4b, 2.25));

    const sun = new THREE.DirectionalLight(0xfff5d3, 3.4);
    sun.position.set(-7, 11, 6);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -12;
    sun.shadow.camera.right = 12;
    sun.shadow.camera.top = 12;
    sun.shadow.camera.bottom = -12;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 35;
    sun.shadow.normalBias = 0.025;
    scene.add(sun);

    const rimLight = new THREE.DirectionalLight(0x9edfff, 1.7);
    rimLight.position.set(8, 6, -9);
    scene.add(rimLight);

    // ---------------------------------------------------------------------
    // Materials
    // ---------------------------------------------------------------------
    const materials = {
      grass: new THREE.MeshStandardMaterial({
        color: 0x78d65b,
        roughness: 0.88,
        metalness: 0
      }),
      grassDark: new THREE.MeshStandardMaterial({
        color: 0x4f9d3f,
        roughness: 1
      }),
      grassLight: new THREE.MeshStandardMaterial({
        color: 0x9bd76a,
        roughness: 0.95
      }),
      pink: new THREE.MeshStandardMaterial({
        color: 0xf16f9d,
        roughness: 0.72
      }),
      pinkLight: new THREE.MeshStandardMaterial({
        color: 0xff9bb5,
        roughness: 0.7
      }),
      pinkDark: new THREE.MeshStandardMaterial({
        color: 0xc9436f,
        roughness: 0.8
      }),
      skin: new THREE.MeshStandardMaterial({
        color: 0xffc3d4,
        roughness: 0.72
      }),
      eye: new THREE.MeshStandardMaterial({
        color: 0x183640,
        roughness: 0.35
      }),
      gold: new THREE.MeshStandardMaterial({
        color: 0xffc84b,
        roughness: 0.38,
        metalness: 0.65
      }),
      goldLight: new THREE.MeshStandardMaterial({
        color: 0xffed9a,
        roughness: 0.3,
        metalness: 0.58
      }),
      goldDark: new THREE.MeshStandardMaterial({
        color: 0xd99726,
        roughness: 0.48,
        metalness: 0.62
      }),
      red: new THREE.MeshStandardMaterial({
        color: 0xe6365f,
        roughness: 0.42,
        metalness: 0.12
      }),
      gem: new THREE.MeshStandardMaterial({
        color: 0xff366f,
        emissive: 0x7a1038,
        emissiveIntensity: 0.75,
        roughness: 0.22,
        metalness: 0.18
      }),
      star: new THREE.MeshStandardMaterial({
        color: 0xffd24d,
        emissive: 0x8a4e00,
        emissiveIntensity: 0.25,
        roughness: 0.45,
        metalness: 0.2
      })
    };

    // ---------------------------------------------------------------------
    // Voxel helpers
    // ---------------------------------------------------------------------
    const voxelGeometry = new THREE.BoxGeometry(1, 1, 1);
    const world = new THREE.Group();
    scene.add(world);

    function addVoxel(parent, x, y, z, sx, sy, sz, material, castShadow = true) {
      const mesh = new THREE.Mesh(voxelGeometry, material);
      mesh.position.set(x, y, z);
      mesh.scale.set(sx, sy, sz);
      mesh.castShadow = castShadow;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    }

    function addStar(parent, x, y, z, scale = 1, flat = false) {
      const star = new THREE.Group();
      star.position.set(x, y, z);
      star.scale.setScalar(scale);

      const shape = new THREE.Shape();
      for (let i = 0; i < 10; i++) {
        const radius = i % 2 === 0 ? 0.52 : 0.27;
        const angle = (i / 10) * Math.PI * 2;
        const cx = Math.cos(angle) * radius;
        const cy = Math.sin(angle) * radius;
        if (i === 0) shape.moveTo(cx, cy);
        else shape.lineTo(cx, cy);
      }
      shape.closePath();

      const face = new THREE.Mesh(
        new THREE.ShapeGeometry(shape),
        materials.star
      );
      face.material.side = THREE.DoubleSide;
      face.castShadow = true;
      face.receiveShadow = true;
      star.add(face);

      if (flat) {
        face.rotation.x = Math.PI / 2;
      }

      parent.add(star);
      return star;
    }

    // ---------------------------------------------------------------------
    // Floating island
    // ---------------------------------------------------------------------
    const island = new THREE.Group();
    world.add(island);

    // Main grassy top, built as a low-poly voxel slab.
    addVoxel(island, 0, 0.15, 0, 10.4, 0.7, 8.4, materials.grass);

    // Layered soil and lower island silhouette.
    addVoxel(island, 0, -0.35, 0, 9.5, 0.55, 7.6, materials.grassDark);
    addVoxel(island, 0, -0.95, 0, 8.7, 0.45, 6.8, materials.goldDark);
    addVoxel(island, 0, -1.45, 0, 7.8, 0.3, 5.9, materials.gold);

    // Blocky front lip.
    for (let x = -4.5; x <= 4.5; x += 0.75) {
      addVoxel(
        island,
        x,
        0.38,
        4.15,
        0.68,
        0.65,
        0.45,
        materials.grassLight
      );
    }

    // Small grass tufts made from stacked cubes.
    const tuftPositions = [
      [-3.8, 0.55, 2.6],
      [-2.8, 0.55, 3.25],
      [3.7, 0.55, 2.9],
      [4.2, 0.55, 1.8],
      [-4.1, 0.55, -1.8],
      [4.3, 0.55, -2.1]
    ];

    for (const [x, y, z] of tuftPositions) {
      addVoxel(island, x, y + 0.15, z, 0.18, 0.3, 0.18, materials.grassLight);
      addVoxel(island, x + 0.13, y + 0.36, z, 0.12, 0.22, 0.12, materials.grass);
    }

    // ---------------------------------------------------------------------
    // Kirby
    // ---------------------------------------------------------------------
    const kirby = new THREE.Group();
    kirby.position.set(-2.25, 0.2, 0.15);
    world.add(kirby);

    // Torso
    addVoxel(kirby, 0, 1.05, 0, 1.45, 1.15, 1.25, materials.pink);

    // Head
    addVoxel(kirby, 0, 1.85, -0.02, 1.15, 1.05, 1.05, materials.pink);

    // Cheek cubes
    addVoxel(kirby, -0.38, 1.78, 0.51, 0.22, 0.18, 0.08, materials.pinkLight);
    addVoxel(kirby, 0.38, 1.78, 0.51, 0.22, 0.18, 0.08, materials.pinkLight);

    // Eyes
    addVoxel(kirby, -0.24, 2.02, 0.56, 0.19, 0.25, 0.16, materials.eye);
    addVoxel(kirby, 0.24, 2.02, 0.56, 0.19, 0.25, 0.16, materials.eye);

    // Small highlights
    addVoxel(kirby, -0.29, 2.08, 0.64, 0.055, 0.075, 0.04, materials.goldLight);
    addVoxel(kirby, 0.29, 2.08, 0.64, 0.055, 0.075, 0.04, materials.goldLight);

    // Nose
    addVoxel(kirby, 0, 1.68, 0.64, 0.16, 0.12, 0.12, materials.goldDark);

    // Mouth
    addVoxel(kirby, 0, 1.58, 0.66, 0.31, 0.07, 0.08, materials.goldDark);

    // Arms
    addVoxel(kirby, -0.95, 1.15, 0, 0.48, 0.72, 0.58, materials.pink);
    addVoxel(kirby, 0.95, 1.15, 0, 0.48, 0.72, 0.58, materials.pink);

    // Hands
    addVoxel(kirby, -1.19, 0.95, 0.1, 0.34, 0.38, 0.42, materials.pinkLight);
    addVoxel(kirby, 1.19, 0.95, 0.1, 0.34, 0.38, 0.42, materials.pinkLight);

    // Boots
    addVoxel(kirby, -0.55, 0.43, 0.35, 0.7, 0.38, 0.62, materials.pinkDark);
    addVoxel(kirby, 0.55, 0.43, 0.35, 0.7, 0.38, 0.62, materials.pinkDark);

    // Hair tuft
    addVoxel(kirby, 0, 2.55, -0.12, 0.55, 0.38, 0.42, materials.pinkDark);
    addVoxel(kirby, -0.27, 2.48, -0.08, 0.28, 0.27, 0.28, materials.pinkDark);
    addVoxel(kirby, 0.27, 2.48, -0.08, 0.28, 0.27, 0.28, materials.pinkDark);

    // ---------------------------------------------------------------------
    // Mirror portal
    // ---------------------------------------------------------------------
    const portal = new THREE.Group();
    portal.position.set(2.25, 0.15, 0.1);
    world.add(portal);

    // Two vertical pillars
    addVoxel(portal, -0.82, 2.15, 0, 0.48, 4.2, 0.72, materials.gold);
    addVoxel(portal, 0.82, 2.15, 0, 0.48, 4.2, 0.72, materials.gold);

    // Top arch, assembled from stepped blocks
    for (let i = 0; i < 7; i++) {
      const y = 4.25 + i * 0.43;
      const halfWidth = 0.75 - i * 0.055;
      addVoxel(
        portal,
        0,
        y,
        0,
        halfWidth * 2,
        0.4,
        0.72,
        i % 2 === 0 ? materials.gold : materials.goldLight
      );
    }

    // Inner glowing arch
    for (let i = 0; i < 7; i++) {
      const y = 4.25 + i * 0.43;
      const halfWidth = 0.63 - i * 0.045;
      addVoxel(
        portal,
        0,
        y,
        0.02,
        halfWidth * 2,
        0.34,
        0.18,
        materials.goldLight
      );
    }

    // Mirror backing
    const mirror = new THREE.Mesh(
      new THREE.PlaneGeometry(1.25, 3.65),
      new THREE.MeshStandardMaterial({
        color: 0x8bd9e8,
        emissive: 0x173e4d,
        emissiveIntensity: 0.55,
        roughness: 0.2,
        metalness: 0.72,
        side: THREE.DoubleSide
      })
    );
    mirror.position.set(0, 2.05, 0.03);
    portal.add(mirror);

    // Mirror glow core
    const mirrorCore = new THREE.Mesh(
      new THREE.CircleGeometry(0.48, 48),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    );
    mirrorCore.position.set(0, 2.15, 0.055);
    portal.add(mirrorCore);

    // Crown atop the mirror
    addVoxel(portal, 0, 4.83, 0, 1.15, 0.28, 0.72, materials.gold);
    addVoxel(portal, -0.35, 5.23, 0, 0.34, 0.42, 0.38, materials.goldLight);
    addVoxel(portal, 0.35, 5.23, 0, 0.34, 0.42, 0.38, materials.goldLight);
    addVoxel(portal, 0, 5.55, 0, 0.45, 0.18, 0.38, materials.goldLight);

    // ---------------------------------------------------------------------
    // Star Sword
    // ---------------------------------------------------------------------
    const sword = new THREE.Group();
    sword.position.set(0.25, 0.25, 0.2);
    world.add(sword);

    // Pedestal
    addVoxel(sword, 0, 0.18, 0, 1.25, 0.36, 1.05, materials.goldDark);
    addVoxel(sword, 0, 0.43, 0, 0.92, 0.2, 0.72, materials.gold);

    // Hilt
    addVoxel(sword, 0, 0.85, 0, 0.72, 0.28, 0.4, materials.gold);
    addVoxel(sword, 0, 1.02, 0, 0.48, 0.18, 0.3, materials.goldLight);
    addVoxel(sword, 0, 1.15, 0, 0.62, 0.18, 0.38, materials.gold);

    // Gem
    addVoxel(sword, 0, 1.35, 0, 0.3, 0.3, 0.3, materials.gem);

    // Handle
    addVoxel(sword, 0, 1.55, 0, 0.32, 0.75, 0.32, materials.goldDark);
    addVoxel(sword, 0, 1.88, 0, 0.55, 0.2, 0.52, materials.gold);

    // Handle grips
    addVoxel(sword, 0, 1.72, 0, 0.12, 0.45, 0.1, materials.pinkDark);
    addVoxel(sword, 0, 1.98, 0, 0.12, 0.2, 0.1, materials.pinkDark);

    // Sword blade
    const blade = addVoxel(
      sword,
      0,
      2.35,
      0,
      0.18,
      1.65,
      0.18,
      materials.goldLight
    );
    blade.rotation.z = -0.08;

    // Blade edge
    addVoxel(
      sword,
      0.105,
      2.35,
      0,
      0.055,
      1.5,
      0.1,
      materials.gold
    );

    // ---------------------------------------------------------------------
    // Decorative stars
    // ---------------------------------------------------------------------
    addStar(world, -4.7, 2.1, 1.8, 0.85, true);
    addStar(world, 5.2, 2.7, 1.2, 0.9, true);
    addStar(world, 4.3, 1.5, -2.4, 0.65, true);
    addStar(world, -4.9, 1.2, -2.2, 0.6, true);

    // Foreground star
    const foregroundStar = addStar(world, 4.8, 0.15, 3.5, 1.35, true);
    foregroundStar.rotation.y = 0.35;
    foregroundStar.rotation.z = -0.12;

    // Small floating sparkles around Kirby
    const sparkles = [];
    for (let i = 0; i < 5; i++) {
      const sparkle = addStar(
        world,
        -2.25 + (Math.random() - 0.5) * 3.2,
        0.5 + Math.random() * 3.2,
        -1.8 + Math.random() * 3.2,
        0.18 + Math.random() * 0.18,
        true
      );
      sparkles.push({
        mesh: sparkle,
        speed: 0.25 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2
      });
    }

    // ---------------------------------------------------------------------
    // Background clouds made from white voxel cubes
    // ---------------------------------------------------------------------
    const cloudMaterial = new THREE.MeshStandardMaterial({
      color: 0xf3fbf7,
      roughness: 1
    });

    function addCloud(x, y, z, scale) {
      const cloud = new THREE.Group();
      cloud.position.set(x, y, z);
      cloud.scale.setScalar(scale);

      const pieces = [
        [-1.2, 0, 0, 0.9, 0.55, 0.8],
        [-0.35, 0.2, 0, 1.2, 0.85, 0.9],
        [0.75, 0.05, 0, 1.0, 0.65, 0.85],
        [1.5, -0.05, 0, 0.65, 0.45, 0.65],
        [0.05, -0.2, 0.1, 1.4, 0.45, 0.75]
      ];

      for (const [px, py, pz, sx, sy, sz] of pieces) {
        addVoxel(cloud, px, py, pz, sx, sy, sz, cloudMaterial);
      }

      world.add(cloud);
    }

    addCloud(-7, 6.2, -8, 1.35);
    addCloud(7.5, 7.1, -10, 1.6);
    addCloud(0.5, 8.8, -13, 1.9);

    // ---------------------------------------------------------------------
    // Ground glow / magical particles
    // ---------------------------------------------------------------------
    const particleMaterial = new THREE.MeshBasicMaterial({
      color: 0xffe28a,
      transparent: true,
      opacity: 0.65,
      depthWrite: false
    });

    const particles = [];
    for (let i = 0; i < 20; i++) {
      const particle = new THREE.Mesh(
        new THREE.BoxGeometry(0.08 + Math.random() * 0.12, 0.08 + Math.random() * 0.12, 0.08 + Math.random() * 0.12),
        particleMaterial
      );
      const side = Math.random() > 0.5 ? 1 : -1;
      particle.position.set(
        -4.5 + Math.random() * 9,
        0.35 + Math.random() * 1.4,
        side * (2.7 + Math.random() * 3.5)
      );
      world.add(particle);
      particles.push({
        mesh: particle,
        speed: 0.18 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2
      });
    }

    // ---------------------------------------------------------------------
    // Animation
    // ---------------------------------------------------------------------
    const clock = new THREE.Clock();

    function animate() {
      const elapsed = clock.getElapsedTime();

      // Gentle sword glow pulse.
      mirrorCore.scale.setScalar(1 + Math.sin(elapsed * 2.1) * 0.08);

      // Sparkles drift and twinkle.
      for (const sparkle of sparkles) {
        sparkle.mesh.position.x += Math.sin(elapsed * sparkle.speed + sparkle.phase) * 0.0007;
        sparkle.mesh.position.y += Math.cos(elapsed * sparkle.speed * 0.8 + sparkle.phase) * 0.0006;
        sparkle.mesh.rotation.y += 0.012;
      }

      // Floating particles.
      for (const particle of particles) {
        particle.mesh.position.y += Math.sin(elapsed * particle.speed + particle.phase) * 0.0008;
        particle.mesh.rotation.y += 0.008;
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    animate();

    // ---------------------------------------------------------------------
    // Resize
    // ---------------------------------------------------------------------
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
    relic: { id: "grapple-arm", name: "The Bionic Arm", x: -10.0, z: -12.0 },
    env:   { background: 0xb9d8df, fogColor: 0xb9d8df, fogDensity: 0.025 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 }
    }
  };
}

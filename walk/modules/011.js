// @world {"id": "011", "title": "Super Mario Bros. 3", "sub": "Dark Land Airships", "system": "NES"}
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
      position: { set: () => {}, copy: () => {} },
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

    

    const canvas = document.querySelector("#scene");
    const loading = document.querySelector("#loading");

    renderer = dummyRenderer();
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if (renderer.domElement && renderer.domElement.nodeType === 1) document.body.appendChild(renderer.domElement); // Back Roms fix: dummy renderer has no real canvas to attach

    // scene redirect
    scene.background = new THREE.Color(0x081121);
    scene.fog = new THREE.FogExp2(0x173145, 0.018);

    camera = dummyCamera();
    const target = new THREE.Vector3(0, 3, 0);
    camera.position.set(15, 11, 18);

    const orbit = {
      theta: 0.72,
      phi: 1.18,
      radius: 24,
      dragging: false,
      lastX: 0,
      lastY: 0
    };
    function updateCamera() {
      orbit.phi = THREE.MathUtils.clamp(orbit.phi, 0.35, 1.48);
      const sinPhi = Math.sin(orbit.phi);
      camera.position.set(
        target.x + orbit.radius * sinPhi * Math.sin(orbit.theta),
        target.y + orbit.radius * Math.cos(orbit.phi),
        target.z + orbit.radius * sinPhi * Math.cos(orbit.theta)
      );
      camera.lookAt(target);
    }
    updateCamera();

    const hemi = new THREE.HemisphereLight(0x83b8ff, 0x1b2616, 2.0);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xfff3cf, 3.2);
    sun.position.set(-12, 22, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -24;
    sun.shadow.camera.right = 24;
    sun.shadow.camera.top = 24;
    sun.shadow.camera.bottom = -24;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 65;
    sun.shadow.bias = -0.0003;
    scene.add(sun);

    const rim = new THREE.DirectionalLight(0x4ea8ff, 1.15);
    rim.position.set(15, 8, -18);
    scene.add(rim);

    const materials = {
      grass: new THREE.MeshStandardMaterial({
        color: 0x3e782e,
        roughness: 0.95,
        metalness: 0
      }),
      grassDark: new THREE.MeshStandardMaterial({
        color: 0x24471e,
        roughness: 1
      }),
      grassLight: new THREE.MeshStandardMaterial({
        color: 0x62963a,
        roughness: 1
      }),
      path: new THREE.MeshStandardMaterial({
        color: 0x8b7250,
        roughness: 1
      }),
      stone: new THREE.MeshStandardMaterial({
        color: 0x59636a,
        roughness: 0.95
      }),
      stoneLight: new THREE.MeshStandardMaterial({
        color: 0x7c8588,
        roughness: 0.9
      }),
      goomba: new THREE.MeshStandardMaterial({
        color: 0x8a3e24,
        roughness: 0.76,
        metalness: 0.02
      }),
      goombaDark: new THREE.MeshStandardMaterial({
        color: 0x6f2d1c,
        roughness: 0.8
      }),
      mushroom: new THREE.MeshStandardMaterial({
        color: 0xd94b3f,
        roughness: 0.55
      }),
      mushroomCap: new THREE.MeshStandardMaterial({
        color: 0xf2b34d,
        roughness: 0.55
      }),
      eye: new THREE.MeshBasicMaterial({ color: 0xffe3a0 }),
      pipe: new THREE.MeshStandardMaterial({
        color: 0x657b70,
        roughness: 0.65,
        metalness: 0.15
      }),
      pipeDark: new THREE.MeshStandardMaterial({
        color: 0x354d45,
        roughness: 0.7,
        metalness: 0.2
      })
    };

    const world = new THREE.Group();
    scene.add(world);

    const hillGeometry = new THREE.SphereGeometry(1, 48, 24);
    function makeHill(x, z, radius, height, material, phase = 0) {
      const mesh = new THREE.Mesh(hillGeometry, material);
      mesh.position.set(x, height * 0.48, z);
      mesh.scale.set(radius, height, radius * 1.25);
      mesh.rotation.y = phase;
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      world.add(mesh);
      return mesh;
    }

    makeHill(-11, -3, 12, 5.2, materials.grassDark, 0.3);
    makeHill(9, -5, 14, 6.4, materials.grass, 1.1);
    makeHill(-15, 10, 16, 4.5, materials.grassDark, 0.7);
    makeHill(16, 12, 17, 5.5, materials.grass, 2.3);
    makeHill(0, 22, 20, 3.8, materials.grassDark, 0.4);

    const path = new THREE.Mesh(
      new THREE.CylinderGeometry(3.2, 3.6, 1.2, 48),
      materials.path
    );
    path.rotation.x = -Math.PI / 2;
    path.position.set(0, 0.18, 2);
    path.receiveShadow = true;
    world.add(path);

    for (let i = 0; i < 28; i++) {
      const angle = i * 0.73;
      const radius = 4.3 + (i % 4) * 0.55;
      const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.45 + (i % 3) * 0.12, 0),
        i % 2 ? materials.stone : materials.stoneLight
      );
      rock.position.set(
        Math.cos(angle) * radius,
        0.25 + (i % 2) * 0.1,
        Math.sin(angle) * radius
      );
      rock.scale.y = 0.65 + (i % 3) * 0.15;
      rock.rotation.set(i * 0.4, i * 0.7, i * 0.2);
      rock.castShadow = true;
      rock.receiveShadow = true;
      world.add(rock);
    }

    const trees = [];
    function makeTree(x, z, scale = 1) {
      const group = new THREE.Group();
      group.position.set(x, 0.55 * scale, z);
      group.scale.setScalar(scale);

      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.13, 0.2, 1.1, 8),
        materials.goombaDark
      );
      trunk.position.y = 0.55;
      trunk.castShadow = true;
      group.add(trunk);

      const leafMat = new THREE.MeshStandardMaterial({
        color: 0x245b2c,
        roughness: 1
      });
      for (let i = 0; i < 3; i++) {
        const leaf = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.9 - i * 0.12, 1),
          leafMat
        );
        leaf.position.set(
          (i - 1) * 0.34,
          1.15 + i * 0.3,
          (i % 2) * 0.15
        );
        leaf.scale.y = 1.15;
        leaf.castShadow = true;
        leaf.receiveShadow = true;
        group.add(leaf);
      }
      world.add(group);
      trees.push(group);
    }

    [
      [-8, -12, 1.15],
      [-13, 2, 0.9],
      [-6, 14, 1.05],
      [7, 15, 1.1],
      [13, 1, 0.95],
      [8, -14, 1.0],
      [-16, -1, 0.85],
      [17, -7, 0.9]
    ].forEach(args => makeTree(...args));

    const clouds = [];
    const cloudMaterial = new THREE.MeshBasicMaterial({
      color: 0x8bbcff,
      transparent: true,
      opacity: 0.35,
      depthWrite: false
    });
    function makeCloud(x, y, z, scale) {
      const group = new THREE.Group();
      for (let i = 0; i < 5; i++) {
        const puff = new THREE.Mesh(
          new THREE.SphereGeometry(1, 12, 8),
          cloudMaterial
        );
        puff.position.set(i * 1.1, Math.sin(i * 1.7) * 0.35, 0);
        puff.scale.set(1.5 + (i % 2), 0.75, 0.9);
        group.add(puff);
      }
      group.position.set(x, y, z);
      group.scale.setScalar(scale);
      scene.add(group);
      clouds.push(group);
    }
    makeCloud(-12, 11, -18, 1.4);
    makeCloud(14, 13, -22, 1.7);
    makeCloud(4, 9, 20, 1.1);

    const pipe = new THREE.Group();
    pipe.position.set(3.4, 1.1, 2.3);
    pipe.rotation.y = -0.25;

    const pipeBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.65, 0.65, 1.6, 24),
      materials.pipe
    );
    pipeBody.position.y = 0.75;
    pipeBody.castShadow = true;
    pipe.add(pipeBody);

    const pipeTop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.72, 0.72, 0.28, 24),
      materials.pipeDark
    );
    pipeTop.position.y = 1.65;
    pipeTop.castShadow = true;
    pipe.add(pipeTop);

    const pipeRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.72, 0.09, 8, 28),
      materials.pipeDark
    );
    pipeRim.rotation.x = Math.PI / 2;
    pipeRim.position.y = 1.82;
    pipe.add(pipeRim);

    const pipeSpout = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.25, 1.2, 12),
      materials.pipeDark
    );
    pipeSpout.position.set(0, -1.2, 0);
    pipeSpout.rotation.z = Math.PI / 2;
    pipe.add(pipeSpout);

    world.add(pipe);

    const goombas = [];
    const goombaGeometry = new THREE.Group();
    function makeGoomba(x, y, z, scale = 1, dark = false) {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      group.scale.setScalar(scale);

      const body = new THREE.Mesh(
        new THREE.SphereGeometry(0.58, 14, 10),
        dark ? materials.goombaDark : materials.goomba
      );
      body.position.y = 0.18;
      body.scale.set(1, 0.65, 0.9);
      body.castShadow = true;
      body.receiveShadow = true;
      group.add(body);

      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.43, 14, 10),
        dark ? materials.goombaDark : materials.goomba
      );
      head.position.set(0, 0.62, 0.22);
      head.scale.set(1, 0.9, 0.8);
      head.castShadow = true;
      group.add(head);

      const eyeGeo = new THREE.SphereGeometry(0.075, 8, 6);
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffdf88 });
      for (const side of [-1, 1]) {
        const eye = new THREE.Mesh(eyeGeo, eyeMat);
        eye.position.set(side * 0.18, 0.78, 0.52);
        eye.scale.set(0.7, 1.5, 0.4);
        group.add(eye);
      }

      const mouth = new THREE.Mesh(
        new THREE.TorusGeometry(0.095, 0.025, 6, 12, Math.PI),
        new THREE.MeshBasicMaterial({ color: 0x3a1b12 })
      );
      mouth.position.set(0, 0.56, 0.77);
      mouth.rotation.z = Math.PI;
      group.add(mouth);

      group.userData = {
        phase: Math.random() * Math.PI * 2,
        speed: 0.35 + Math.random() * 0.35,
        wobble: 0.08 + Math.random() * 0.12,
        goomba: true
      };
      world.add(group);
      goombas.push(group);
      return group;
    }

    for (let i = 0; i < 10; i++) {
      const x = -3 + i * 1.45;
      const z = 2.2 + (i % 2) * 0.8;
      makeGoomba(x, 1.8, z, 0.92, i % 3 === 0);
    }

    const fireflies = [];
    const fireflyMaterial = new THREE.MeshBasicMaterial({
      color: 0xffe49a
    });
    for (let i = 0; i < 38; i++) {
      const firefly = new THREE.Mesh(
        new THREE.SphereGeometry(0.055 + Math.random() * 0.035, 6, 4),
        fireflyMaterial
      );
      const x = (Math.random() - 0.5) * 28;
      const z = (Math.random() - 0.5) * 28;
      firefly.position.set(x, 1.5 + Math.random() * 5, z);
      firefly.userData = {
        baseX: x,
        baseY: firefly.position.y,
        baseZ: z,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.6
      };
      world.add(firefly);
      fireflies.push(firefly);
    }

    const particles = [];
    const particleMaterial = new THREE.MeshBasicMaterial({
      color: 0xffd98a,
      transparent: true,
      opacity: 0.85
    });
    for (let i = 0; i < 16; i++) {
      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.04 + Math.random() * 0.04, 5, 4),
        particleMaterial
      );
      particle.position.set(
        (Math.random() - 0.5) * 2,
        1.9 + Math.random() * 0.4,
        (Math.random() - 0.5) * 1.4
      );
      particle.userData = {
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 0.6
      };
      world.add(particle);
      particles.push(particle);
    }

    const score = {
      jumpCount: 0,
      points: 0,
      combo: 0,
      maxCombo: 0
    };

    let jumpState = null;
    let demoTimer = 0;
    let demoActive = false;

    const resetButton = document.querySelector("#reset");
    const jumpButton = document.querySelector("#jump");

    resetButton?.addEventListener("click", () => {
      orbit.theta = 0.72;
      orbit.phi = 1.18;
      orbit.radius = 24;
      target.set(0, 3, 0);
      updateCamera();
    });

    jumpButton?.addEventListener("click", () => {
      demoActive = true;
      demoTimer = 0;
      jumpButton.textContent = "Demo Active";
    });

    function jumpGoomba(goomba, hold = false) {
      if (!goomba.userData.goomba) return;
      score.jumpCount++;
      score.points += score.jumpCount > 8 ? 100 : 25 * score.jumpCount;
      score.combo++;
      score.maxCombo = Math.max(score.maxCombo, score.combo);
      goomba.scale.multiplyScalar(0.94);
      goomba.position.y = 0;

      const position = goomba.position.clone();
      const direction = new THREE.Vector3(
        Math.cos((goomba.position.x + Math.sin(position.z)) * 0.7) * 1.2,
        0,
        Math.sin((goomba.position.x + Math.sin(position.z)) * 0.7) * 1.2
      );
      const start = performance.now();
      const duration = hold ? 2.2 : 1.15;

      jumpState = {
        start,
        duration,
        position,
        direction,
        hold,
        goomba,
        phase: 0
      };
    }

    function animateJump(now) {
      const jump = jumpState;
      const elapsed = (now - jump.start) / 1000;
      const t = elapsed / jump.duration;

      if (t >= 1) {
        jump.goomba = null;
        jumpState = null;
        demoActive = false;
        jumpButton.textContent = "Jump Demo";
        return;
      }

      const eased = t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

      jump.goomba.position.copy(jump.position).addScaledVector(jump.direction, eased * 1.6);
      jump.goomba.position.y += Math.sin(eased * Math.PI) * 2.15;
      jump.goomba.rotation.y += 0.08;
      jump.goomba.scale.setScalar(1 - t * 0.08);

      if (jump.hold) {
        const bounce = Math.sin(eased * Math.PI);
        jump.goomba.position.y += Math.sin(bounce * Math.PI * 2) * 0.08;
      }

      jump.phase += 0.08;
      goomba.userData.phase = jump.phase;
    }

    const clock = new THREE.Clock();
    let elapsed = 0;

    function animate() {
    /* [SHIELD] */
    requestAnimationFrame(animate);
    try {

      requestAnimationFrame(animate);
      const now = performance.now();
      elapsed += (now - clock.getDelta().time * 1000) / 1000;

      animateJump(now);

      if (demoActive) {
        demoTimer += 1;
        const targetX = Math.sin(demoTimer * 0.7) * 0.8;
        const targetZ = 2.2 + Math.cos(demoTimer * 0.55) * 0.5;
        const goomba = makeGoomba(targetX, 1.8, targetZ, 0.9, demoTimer % 3 === 0);
        goomba.userData.phase = elapsed * 0.8;
        goomba.position.x += (targetX - goomba.position.x) * 0.08;
        goomba.position.z += (targetZ - goomba.position.z) * 0.08;
        if (demoTimer % 2.1 < 0.05) jumpGoomba(goomba, false);
      }

      for (const goomba of goombas) {
        if (!goomba.userData.goomba) continue;
        const data = goomba.userData;
        data.phase += 0.015;
        goomba.rotation.y = data.phase;
        goomba.rotation.z = Math.sin(data.phase * 1.4) * 0.035;
        goomba.position.x += Math.sin(elapsed * data.speed + data.phase) * 0.0008;
      }

      for (const cloud of clouds) {
        cloud.position.x += 0.0025;
        if (cloud.position.x > 24) cloud.position.x = -24;
      }

      for (const firefly of fireflies) {
        const data = firefly.userData;
        firefly.position.x = data.baseX + Math.sin(elapsed * data.speed + data.phase) * 0.35;
        firefly.position.y = data.baseY + Math.sin(elapsed * data.speed * 1.7 + data.phase) * 0.25;
        firefly.position.z = data.baseZ + Math.cos(elapsed * data.speed * 0.8 + data.phase) * 0.25;
        firefly.scale.setScalar(0.8 + Math.sin(elapsed * 2 + data.phase) * 0.2);
      }

      for (const particle of particles) {
        const data = particle.userData;
        particle.position.y -= 0.006;
        particle.position.x += Math.sin(elapsed * data.speed + data.phase) * 0.003;
        if (particle.position.y < 1.45) {
          particle.position.y = 1.85;
          particle.position.x = (Math.random() - 0.5) * 2;
          particle.position.z = (Math.random() - 0.5) * 1.4;
        }
      }

      if (jumpState) {
        const jump = jumpState;
        const elapsed2 = (now - jump.start) / 1000;
        const t = elapsed2 / jump.duration;
        const eased = t < 0.5
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2;

        jump.goomba.position.copy(jump.position).addScaledVector(jump.direction, eased * 1.6);
        jump.goomba.position.y += Math.sin(eased * Math.PI) * 2.15;
        jump.goomba.rotation.y += 0.08;
        jump.goomba.scale.setScalar(1 - t * 0.08);

        if (jump.hold) {
          const bounce = Math.sin(eased * Math.PI);
          jump.goomba.position.y += Math.sin(bounce * Math.PI * 2) * 0.08;
        }

        jump.phase += 0.08;
        goomba.userData.phase = jump.phase;
      }

      
    } catch (e) {
      console.warn('Animation tick suppressed:', e.message);
    }
    renderer.render(scene, camera);
    }

    addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(innerWidth, innerHeight);
    });

    addEventListener("pointerdown", event => {
      orbit.dragging = true;
      orbit.lastX = event.clientX;
      orbit.lastY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = "grabbing";
    });

    addEventListener("pointermove", event => {
      if (!orbit.dragging) return;
      const dx = event.clientX - orbit.lastX;
      const dy = event.clientY - orbit.lastY;
      orbit.lastX = event.clientX;
      orbit.lastY = event.clientY;
      orbit.theta -= dx * 0.006;
      orbit.phi -= dy * 0.005;
      updateCamera();
    });

    function endPointer(event) {
      orbit.dragging = false;
      canvas.style.cursor = "grab";
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
    }
    addEventListener("pointerup", endPointer);
    addEventListener("pointercancel", endPointer);

    addEventListener("wheel", event => {
      event.preventDefault();
      orbit.radius = THREE.MathUtils.clamp(
        orbit.radius + event.deltaY * 0.012,
        10,
        42
      );
      updateCamera();
    }, { passive: false });

    const touchPoints = new Map();
    let pinchDistance = 0;
    addEventListener("touchstart", event => {
      touchPoints.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY
      });
      if (touchPoints.size === 2) {
        const points = [...touchPoints.values()];
        pinchDistance = Math.hypot(
          points[0].x - points[1].x,
          points[0].y - points[1].y
        );
      }
    }, { passive: true });

    addEventListener("touchmove", event => {
      if (!touchPoints.has(event.pointerId)) return;
      const point = touchPoints.get(event.pointerId);
      const dx = event.clientX - point.x;
      const dy = event.clientY - point.y;
      point.x = event.clientX;
      point.y = event.clientY;

      if (touchPoints.size === 1) {
        orbit.theta -= dx * 0.006;
        orbit.phi -= dy * 0.005;
        updateCamera();
      } else if (touchPoints.size === 2) {
        const points = [...touchPoints.values()];
        const distance = Math.hypot(
          points[0].x - points[1].x,
          points[0].y - points[1].y
        );
        if (pinchDistance > 0) {
          orbit.radius = THREE.MathUtils.clamp(
            orbit.radius + (pinchDistance - distance) * 0.018,
            10,
            42
          );
          updateCamera();
        }
        pinchDistance = distance;
      }
    }, { passive: true });

    addEventListener("touchend", event => {
      touchPoints.delete(event.pointerId);
      if (touchPoints.size < 2) pinchDistance = 0;
    }, { passive: true });

    animate();
    requestAnimationFrame(() => {
      loading?.classList.add("hidden");
      setTimeout(() => loading?.remove(), 600);
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
    relic: { name: "Super Mario Bros. 3 Relic", x: -10.0, z: -12.0 },
    env:   { background: 0x081121, fogColor: 0x173145, fogDensity: 0.018 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 }
    }
  };
}

import * as THREE from "/libs/three.module.js";

let camera, scene, renderer;
let matParticleSystem, geoParticleSystem, particleSystem;
let sprite;
let matFog, geoFog, fog, uniforms;
let mixer;
let clock;

// Radius of container
let RADIUS = 3000;

// Attributes
const positions_fog = [];
const sizes_fog = [];

const positions_particles = [];
const NUMBER = 8000;

init();
update();

function init() {
  /*-----CAMERA-----*/
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  camera.position.z = 500;

  /*-----SCENE-----*/
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0);

  /*-----CLOCK-----*/
  clock = new THREE.Clock();

  /////////////////////////////
  /*-----PARTICLE SYSTEM-----*/
  /////////////////////////////
  geoParticleSystem = new THREE.BufferGeometry();

  sprite = new THREE.TextureLoader().load("assets/spark1.png");

  for (let i = 0; i < NUMBER; i++) {
    const x = Math.random() * 2000 - 1000;
    const y = Math.random() * 2000 - 1000;
    const z = Math.random() * 2000 - 1000;

    positions_particles.push(x, y, z);
  }

  geoParticleSystem.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions_particles, 3)
  );

  matParticleSystem = new THREE.PointsMaterial({
    color: 0x002300,
    size: 80,
    map: sprite,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true
  });
  matParticleSystem.color.setHSL(0.98, 0.9, 0.5);

  particleSystem = new THREE.Points(geoParticleSystem, matParticleSystem);

  scene.add(particleSystem);

  /////////////////////////////
  /*--------FOG SYSTEM-------*/
  /////////////////////////////
  uniforms = {
    pointTexture: {
      value: new THREE.TextureLoader().load("assets/spark1.png")
    }
  };
  matFog = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: document.getElementById("vertex").textContent,
    fragmentShader: document.getElementById("fragment").textContent,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
    vertexColors: true
  });

  geoFog = new THREE.BufferGeometry();

  for (let i = 0; i < NUMBER; i++) {
    positions_fog.push((Math.random() * 2 - 1) * RADIUS);
    positions_fog.push((Math.random() * 2 - 1) * RADIUS);
    positions_fog.push((Math.random() * 2 - 1) * RADIUS);

    sizes_fog.push(80);
  }

  geoFog.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions_fog, 3)
  );
  geoFog.setAttribute(
    "size",
    new THREE.Float32BufferAttribute(sizes_fog, 1).setUsage(
      THREE.DynamicDrawUsage
    )
  );

  fog = new THREE.Points(geoFog, matFog);

  scene.add(fog);

  /////////////////////////////
  /*---------ANIMATION--------*/
  /////////////////////////////

  // OPACITY
  const opacityKF = new THREE.NumberKeyframeTrack(
    ".material.opacity",
    [0, 15, 30],
    [1, 0, 1]
  );
  const clip = new THREE.AnimationClip("Action", 30, [opacityKF]);
  mixer = new THREE.AnimationMixer(particleSystem);
  const clipAction = mixer.clipAction(clip);
  clipAction.play();

  /*-----RENDERER-----*/
  //renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  //renderer.autoClearColor = false;
  document.body.appendChild(renderer.domElement);

  /*-----TOUCH SCREEN-----*/
  document.body.style.touchAction = "none";

  /*-----WINDOW RESIZE-----*/
  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function update() {
  requestAnimationFrame(update);

  const time = Date.now() * 0.0001;
  const delta = clock.getDelta();
  const getElapse = clock.getElapsedTime();

  /*-----ANIMATION----*/
  if (mixer) {
    mixer.update(delta);
  }

  if (getElapse < 10) {

    particleSystem.scale.x -= 0.00009;
    particleSystem.rotation.y += Math.PI / 128;

  } else if (getElapse < 20) {

    fog.scale.x -= 0.0013;
    fog.scale.y -= 0.0013;
    fog.scale.z -= 0.0013;
    particleSystem.scale.x += 0.0005;
    particleSystem.scale.y += 0.0005;
    particleSystem.scale.z += 0.0005;
    particleSystem.rotation.y += Math.PI / 128;

  } else if (getElapse < 30) {

    fog.scale.x += 0.0007;
    fog.scale.y += 0.0007;
    fog.scale.z += 0.0007;
    particleSystem.scale.x -= 0.0095;
    particleSystem.scale.y -= 0.0005;
    particleSystem.scale.z -= 0.0005;
    particleSystem.rotation.x += Math.PI / 64;
    //particleSystem.rotation.z -= (9 * Math.PI) / 5;

  } else if (getElapse < 55) {

    fog.scale.y += 0.009;

  } else if (getElapse < 70) {

    particleSystem.rotation.z += Math.PI / 128;

  } else if (getElapse < 100) {

    particleSystem.scale.x -= 0.000009;
    particleSystem.rotation.y += Math.PI / 128;

  } else if (getElapse < 200) {

    fog.scale.x -= 0.000014;
    fog.scale.y -= 0.000014;
    fog.scale.z -= 0.000014;
    particleSystem.scale.x += 0.00005;
    particleSystem.scale.y += 0.00005;
    particleSystem.scale.z += 0.00005;
    particleSystem.rotation.y += Math.PI / 128;

  } else if (getElapse < 400) {

    fog.scale.x += 0.000005;
    fog.scale.y += 0.000005;
    fog.scale.z += 0.000005;
    particleSystem.scale.x -= 0.00005;
    particleSystem.scale.y -= 0.00005;
    particleSystem.scale.z -= 0.00005;
    particleSystem.rotation.y += Math.PI / 64;
    particleSystem.rotation.z -= (9 * Math.PI) / 5;

  } else if (getElapse < 700) {

    fog.scale.y += 0.0000009;

  } else if (getElapse < 850) {

    particleSystem.rotation.z += Math.PI / 128;

  } else if (getElapse < 1000) {

    particleSystem.scale.x -= 0.000009;
    particleSystem.rotation.y += Math.PI / 128;

  } else if (getElapse < 1500) {

    fog.scale.x -= 0.00014;
    fog.scale.y -= 0.00014;
    fog.scale.z -= 0.00014;
    particleSystem.scale.x += 0.00005;
    particleSystem.scale.y += 0.00005;
    particleSystem.scale.z += 0.00005;
    particleSystem.rotation.y += Math.PI / 128;

  } else if (getElapse < 1800) {

    fog.scale.z += 0.0000009;
    
  }

  /*----COLOUR CHANGE----*/
  const color = [0.98, 1.0, 0.5];
  const h = ((360 * (color[0] + time)) % 360) / 360;
  matParticleSystem.color.setHSL(h, color[1], color[2]);

  /*----FOG SIZES----*/
  const sizes_fog = geoFog.attributes.size.array;
  for (let i = 0; i < NUMBER; i++) {
    sizes_fog[i] = 150 * (1 + Math.sin(0.1 * i + time / 5));
  }

  /*-----UPDATE-----*/
  camera.lookAt(scene.position);
  geoFog.attributes.size.needsUpdate = true;
  renderer.render(scene, camera);
}

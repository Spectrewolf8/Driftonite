console.log("main.js loaded successfully!");
import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import Stats from "three/addons/libs/stats.module.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

console.log("Imports successful!");

const intersectedObjects = [];
let concerned_element;

function init() {
  //setting up scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#1f1f1f");

  //setting up renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //setting up stats monitor
  const stats = new Stats();
  document.body.appendChild(stats.dom);

  //setting up camera and camera's orbital controls
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.set(-2.75, 5, 50);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0.5, 0);
  controls.enableDamping = true;
  controls.enableZoom = true;
  controls.enablePan = true;
  //   controls.enableRotate = false;

  controls.minDistance = 2.5;
  controls.maxDistance = 6;
  controls.update();

  //   setting gridhelper
  const size = 100;
  const divisions = 50;
  const gridHelper = new THREE.GridHelper(size, divisions);
  gridHelper.position.y = -1;
  scene.add(gridHelper);

  //setting lights
  const light0 = new THREE.PointLight("#ffffff", 600, 100);
  light0.position.set(-10, +10, +20);
  light0.lookAt(0, 0, 0);
  light0.rotateX = 45;
  light0.rotateY = -15;
  scene.add(light0);

  const light1 = new THREE.PointLight("#ffffff", 300, 100);
  light1.position.set(+30, -10, +20);
  light1.lookAt(0, 0, 0);
  light1.rotateX = -45;
  light1.rotateY = 10;
  scene.add(light1);

  const light2 = new THREE.PointLight("#ffffff", 300, 100);
  light2.position.set(-30, -10, -20);
  light2.lookAt(0, 0, 0);
  light2.rotateX = 180;
  light2.rotateY = 10;
  scene.add(light2);

  const light3 = new THREE.PointLight("#ffffff", 300, 100);
  light3.position.set(+30, -10, -20);
  light3.lookAt(0, 0, 0);
  light3.rotateX = 180;
  light3.rotateY = 10;
  scene.add(light3);

  //loading 3D model
  const loader = new GLTFLoader();
  loader.load(
    "../models/car_lowpoly_mod_1.glb",
    function (gltf) {
      const car = gltf.scene;
      concerned_element = car;
      car.scale.set(5, 5, 5);
      car.position.y = 0;
      car.position.x = 0;
      scene.add(car);
      console.log(car);
      //   car.getObjectByName("Circle_2").material.color.set("Magenta");
      car.getObjectByName("Circle_2").material.metalness = 0.8;
      car.getObjectByName("Circle_2").material.roughness = 0.3;
      console.log(concerned_element);
    },
    undefined,
    function (error) {
      console.error(error);
    },
  );

  // Define the start and end colors for the gradient
  let hue = 0;
  const maxHue = 360; // Maximum hue value
  const hueStep = 0.3; // Step size for changing hue

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    stats.update();
    renderer.render(scene, camera);

    if (concerned_element) {
      // Calculate the current color based on a smooth transition
      const hueNormalized = hue / maxHue;
      const color = new THREE.Color().setHSL(hueNormalized, 1, 0.5);

      concerned_element.getObjectByName("Circle_2").material.color.set(color);

      hue = (hue + hueStep) % maxHue;
    }
  }

  if (WebGL.isWebGLAvailable()) {
    requestAnimationFrame(animate);
    animate();
    console.log("WebGL support detected");
  } else {
    const warning = WebGL.getWebGLErrorMessage();
    document.getElementById("container").appendChild(warning);
  }
}

init();

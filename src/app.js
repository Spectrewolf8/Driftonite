console.log("main.js loaded successfully!");
import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import Stats from "three/addons/libs/stats.module.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as CANNON from "cannon-es";

console.log("Imports successful!");

//main variables
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
const stats = new Stats();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const controls = new OrbitControls(camera, renderer.domElement);
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.81, 0),
});
const timeStep = 1 / 60;

//other variables
let carObject, carPhysicsBody;

function init() {
  //setting up scene
  scene.background = new THREE.Color("#1f1f1f");
  scene.add(new THREE.AxesHelper(100));

  //setting up renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //setting up stats monitor
  document.body.appendChild(stats.dom);

  //setting up camera and camera's orbital controls

  camera.position.set(-2.75, 5, 10);

  controls.target.set(0, 0.5, 0);
  controls.enableDamping = true;
  controls.enableZoom = true;
  controls.enablePan = true;
  //   controls.enableRotate = false;

  controls.minDistance = 2.5;
  controls.maxDistance = 100;
  controls.update();

  // //   setting gridhelper
  // const size = 100;
  // const divisions = 50;
  // const gridHelper = new THREE.GridHelper(size, divisions);
  // gridHelper.position.y = 0;
  // scene.add(gridHelper);

  //setting lights
  const light0 = new THREE.AmbientLight("#ffffff", 0.3);
  light0.position.set(-10, +10, +20);
  light0.lookAt(0, 0, 0);
  light0.rotateX = 45;
  light0.rotateY = -15;
  scene.add(light0);

  const light1 = new THREE.DirectionalLight("#ffffff", 1);
  light1.position.set(+30, +30, -70);
  light1.lookAt(0, 0, 0);
  light1.rotateX = -20;
  light1.rotateY = -30;
  light1.castShadow = true;
  // scene.add(new THREE.PointLightHelper(light1,,"" ));
  scene.add(light1);

  //loading 3D model
  const loader = new GLTFLoader();
  loader.load(
    "../models/car_lowpoly_mod_2.glb",
    function (gltf) {
      const car = gltf.scene;
      car.scale.set(5, 5, 5);
      car.position.y = 0;
      car.position.x = 0;
      // car.add(camera);
      scene.add(car);
      console.log(car);
      //   car.getObjectByName("Circle_2").material.color.set("Magenta");
      car.getObjectByName("Circle_2").material.metalness = 0.8;
      car.getObjectByName("Circle_2").material.roughness = 0.3;
      car.add(new THREE.AxesHelper(5));

      carObject = car;
      console.log(carObject);
    },
    undefined,
    function (error) {
      console.error(error);
    },
  );
}

//setting worlds, Objects and physics
//ground plane body and mesh
const planeGeometry = new THREE.PlaneGeometry(25, 25);
const planeMesh = new THREE.Mesh(
  planeGeometry,
  new THREE.MeshPhongMaterial({ side: THREE.DoubleSide }),
);
planeMesh.rotateX(-Math.PI / 2);
planeMesh.position.set(0, 0, 0);
planeMesh.receiveShadow = true;
scene.add(planeMesh);

const planeBody = new CANNON.Body({ mass: 0, shape: new CANNON.Plane() });
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(planeBody);
planeMesh.position.copy(planeBody.position);
planeMesh.quaternion.copy(planeBody.quaternion);

//car body, mesh is the model
// const cubeGemotery = new THREE.BoxGeometry(3, 2, 1);
// const cubeMesh = new THREE.Mesh(
//   cubeGemotery,
//   new THREE.MeshBasicMaterial({
//     side: THREE.DoubleSide,
//     wireframe: true,
//   }),
// );
// cubeMesh.add(new THREE.AxesHelper(5));
// // scene.add(cubeMesh);
// // carObject = cubeMesh;
const cubeBody = new CANNON.Body({
  mass: 1,
  shape: new CANNON.Box(new CANNON.Vec3(1.5, 1, 0.5)),
  type: CANNON.Body.DYNAMIC,
  position: new CANNON.Vec3(0, 20, 0),
});
cubeBody.position.y = 0;
cubeBody.angularFactor = new CANNON.Vec3(0, 1, 0);
world.addBody(cubeBody);
carPhysicsBody = cubeBody;

//event handling
// Toggle pause/play state on "p" key press
let isPaused = false;
document.addEventListener("keydown", (event) => {
  if (event.key === "p") {
    isPaused = !isPaused;
    if (!isPaused) {
      animate(); // Resume animation
    }
  }
});

//car controls
const keyState = {};

document.addEventListener("keydown", (event) => {
  keyState[event.key] = true;
});

document.addEventListener("keyup", (event) => {
  keyState[event.key] = false;
});

//Varibles handling rotations
// Define a variable to keep track of the current rotation angle
let lateralRotation = 0;

// Define the maximum rotation angle
const maxLateralRotation = Math.PI / 4; // 30 degrees in radians

// Define the rotation speed
const rotationSpeed = 0.15;

// Define the start and end colors for the gradient
let hue = 0;
const maxHue = 360;
const hueStep = 0.3;

function animate() {
  if (!isPaused) {
    requestAnimationFrame(animate);
    controls.update();
    stats.update();
    renderer.render(scene, camera);
    world.step(timeStep);
    //handling default positions

    // //handling key events and physics
    // if (keyState["w"]) {
    //   carPhysicsBody.velocity.z += 0.5;
    // }
    // if (keyState["a"]) {
    //   carPhysicsBody.velocity.x += 0.5;
    //   carPhysicsBody.quaternion.setFromEuler(0, -Math.PI / 2, 0);
    // }
    // if (keyState["s"]) {
    //   carPhysicsBody.velocity.z -= 0.5;
    // }
    // if (keyState["d"]) {
    //   carPhysicsBody.velocity.x -= 0.5;
    //   carPhysicsBody.quaternion.setFromEuler(0, Math.PI / 2, 0);
    // }

    //handling key events and physics
    if (keyState["w"]) {
      // carPhysicsBody.velocity.z += 0.5;
      carPhysicsBody.applyLocalForce(
        new CANNON.Vec3(0, 0, 10),
        new CANNON.Vec3(0, 0, 0),
      );
      console.log("Velocity: " + carPhysicsBody.velocity);

      console.log(
        carPhysicsBody.force.x,
        carPhysicsBody.force.y,
        carPhysicsBody.force.z,
      );
    }
    if (keyState["s"]) {
      carPhysicsBody.applyLocalForce(
        new CANNON.Vec3(0, 0, -10),
        new CANNON.Vec3(0, 0, 0),
      );
      console.log(
        carPhysicsBody.force.x,
        carPhysicsBody.force.y,
        carPhysicsBody.force.z,
      );
    }
    if (keyState["a"]) {
      if (lateralRotation < maxLateralRotation) {
        lateralRotation += rotationSpeed;
      }
      carPhysicsBody.applyLocalForce(
        new CANNON.Vec3(0, 0, 7),
        new CANNON.Vec3(0, 0, 0),
      );
      console.log(
        carPhysicsBody.force.x,
        carPhysicsBody.force.y,
        carPhysicsBody.force.z,
      );
    } else if (keyState["d"]) {
      if (lateralRotation > -maxLateralRotation) {
        lateralRotation -= rotationSpeed;
      }
      carPhysicsBody.applyLocalForce(
        new CANNON.Vec3(0, 0, 7),
        new CANNON.Vec3(0, 0, 0),
      );
      console.log(
        carPhysicsBody.force.x,
        carPhysicsBody.force.y,
        carPhysicsBody.force.z,
      );
    } else {
      // If neither A nor D is pressed, gradually return to normal rotation
      if (lateralRotation > 0) {
        lateralRotation -= rotationSpeed;
      } else if (lateralRotation < 0) {
        lateralRotation += rotationSpeed;
      }
    }

    // carPhysicsBody.quaternion.setFromEuler(0, Math.PI + lateralRotation, 0);

    carPhysicsBody.quaternion.setFromEuler(0, lateralRotation, 0);

    //actions to do when models loads
    if (carObject) {
      // Calculate and set the current color based on a smooth transition
      const hueNormalized = hue / maxHue;
      const color = new THREE.Color().setHSL(hueNormalized, 1, 0.5);
      carObject.getObjectByName("Circle_2").material.color.set(color);
      hue = (hue + hueStep) % maxHue;

      //calculate positions
      carObject.position.copy(carPhysicsBody.position);
      carObject.quaternion.copy(carPhysicsBody.quaternion);
      if (camera) {
        // // //camera movements
        // camera.position.x = carObject.position.x + 2;
        // camera.position.y = carObject.position.y + 2;
        // camera.position.z = carObject.position.z + 2;
        // // controls.target.set(carObject);
        // const newObjectPosition = new Vector3();
        // object.getWorldPosition(newObjectPosition);
        // const delta = newObjectPosition.clone().sub(carObject.position);
        // camera.position.add(delta);
      }

      // console.log(carObject.position);
    }
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

init();

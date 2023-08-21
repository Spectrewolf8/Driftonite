console.log("main.js loaded successfully!");
import WebGL from "three/addons/capabilities/WebGL.js";
import CannonDebugger from "cannon-es-debugger";
import { CarVisualWorld } from "./CarVisual";
import { CarPhysicsWorld } from "./CarPhysics";
import * as CANNON from "cannon-es";

console.log("Imports successful!");
let carVisualWorld = new CarVisualWorld();
let carPhysicsWorld = new CarPhysicsWorld();

const cannonDebugger = new CannonDebugger(carVisualWorld.scene, carPhysicsWorld.world);

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

//physics constaints
const timeStep = 1 / 60;
//contact materia
const rotationSpeed = 0.02;
//define lateral rotation
let lateralRotation = 0;

// Define the maximum rotation angle
const maxLateralRotation = 2 * Math.PI; // 30 degrees in radians

carVisualWorld.visualWorldObjects.planeMesh.position.copy(
  carPhysicsWorld.physicsWorldObjects.planeBody.position,
);
carVisualWorld.visualWorldObjects.planeMesh.quaternion.copy(
  carPhysicsWorld.physicsWorldObjects.planeBody.quaternion,
);
function animate() {
  if (!isPaused) {
    requestAnimationFrame(animate);
    carVisualWorld.controls.update();
    carVisualWorld.stats.update();
    carVisualWorld.renderer.render(carVisualWorld.scene, carVisualWorld.camera);
    carPhysicsWorld.world.step(timeStep);
    cannonDebugger.update();

    carPhysicsWorld.physicsWorldObjects.carPhysicsBody.quaternion.setFromEuler(
      0,
      Math.PI + lateralRotation,
      0,
    );

    carPhysicsWorld.physicsWorldObjects.carPhysicsBody.quaternion.setFromEuler(
      0,
      lateralRotation,
      0,
    );

    //actions to do when models loads
    if (carVisualWorld.visual3DObjects.car3DObject) {
      //handling key events and physics
      if (keyState["w"]) {
        // carPhysicsBody.velocity.z += 0.5;
        carPhysicsWorld.physicsWorldObjects.carPhysicsBody.applyLocalForce(
          new CANNON.Vec3(0, 0, 30),
          new CANNON.Vec3(0, 0, 0),
        );

        console.log(
          carPhysicsWorld.physicsWorldObjects.carPhysicsBody.force.x,
          carPhysicsWorld.physicsWorldObjects.carPhysicsBody.force.y,
          carPhysicsWorld.physicsWorldObjects.carPhysicsBody.force.z,
        );
      }
      if (keyState["s"]) {
        carPhysicsWorld.physicsWorldObjects.carPhysicsBody.applyLocalForce(
          new CANNON.Vec3(0, 0, -10),
          new CANNON.Vec3(0, 0, 0),
        );
        console.log(
          carPhysicsWorld.physicsWorldObjects.carPhysicsBody.force.x,
          carPhysicsWorld.physicsWorldObjects.carPhysicsBody.force.y,
          carPhysicsWorld.physicsWorldObjects.carPhysicsBody.force.z,
        );
      }
      if (keyState["a"]) {
        // if (lateralRotation < maxLateralRotation) {

        // }
        lateralRotation += rotationSpeed;
        // carPhysicsBody.applyLocalForce(
        //   new CANNON.Vec3(0, 0, 7),
        //   new CANNON.Vec3(0, 0, 0),
        // );
        // console.log(carPhysicsBody.force.x, carPhysicsBody.force.y, carPhysicsBody.force.z);
      } else if (keyState["d"]) {
        // if (lateralRotation > -maxLateralRotation) {

        // }
        lateralRotation -= rotationSpeed;
        // carPhysicsBody.applyLocalForce(
        //   new CANNON.Vec3(0, 0, 7),
        //   new CANNON.Vec3(0, 0, 0),
        // );
        // console.log(carPhysicsBody.force.x, carPhysicsBody.force.y, carPhysicsBody.force.z);
      }
      // else {
      //   // If neither A nor D is pressed, gradually return to normal rotation
      //   if (lateralRotation > 0) {
      //     lateralRotation -= rotationSpeed;
      //   } else if (lateralRotation < 0) {
      //     lateralRotation += rotationSpeed;
      //   }
      // }

      // Calculate and set the current color based on a smooth transition
      // const hueNormalized = hue / maxHue;
      // const color = new THREE.Color().setHSL(hueNormalized, 1, 0.5);
      // carObject.getObjectByName("Circle_2").material.color.set(color);
      // hue = (hue + hueStep) % maxHue;

      // carPhysicsBody.applyLocalForce(
      //   new CANNON.Vec3(0, 0, 10),
      //   new CANNON.Vec3(0, 0, 0),
      // );
      //calculate positions
      carVisualWorld.visual3DObjects.car3DObject.position.copy(
        carPhysicsWorld.physicsWorldObjects.carPhysicsBody.position,
      );
      carVisualWorld.visual3DObjects.car3DObject.quaternion.copy(
        carPhysicsWorld.physicsWorldObjects.carPhysicsBody.quaternion,
      );
      // carObject.scale.copy(carPhysicsBody.scale);
      if (carVisualWorld.camera) {
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

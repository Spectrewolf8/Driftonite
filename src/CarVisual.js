import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

class CarVisualWorld {
  constructor() {
    this.scene = new THREE.Scene(); //main scene
    this.renderer = new THREE.WebGLRenderer({ antialias: true }); //renderer
    this.stats = new Stats(); //stats monitor
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    ); //main camera
    this.controls = new OrbitControls(this.camera, this.renderer.domElement); //camera controls

    //Declaring 3D models buffer
    this.visual3DObjects = {};

    //Declaring Interactive mesh buffers
    this.visualWorldObjects = {};

    //calling initializations methods
    this.initializeVisualWorld(); //initialize objects
    this.load3DModels(); //load 3D models
    this.generateInteractiveEnvironment(); //generate environment
  }

  initializeVisualWorld = function () {
    //adding axes helper
    this.scene.background = new THREE.Color("#1f1f1f");
    this.scene.add(new THREE.AxesHelper(100));

    //setting up renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    //setting up stats monitor
    document.body.appendChild(this.stats.dom);

    //setting up camera and camera's orbital controls
    this.camera.position.set(-2.75, 5, 10);

    this.controls.target.set(0, 0.5, 0);
    this.controls.enableDamping = true;
    this.controls.enableZoom = true;
    this.controls.enablePan = true;
    //   controls.enableRotate = false;
    this.controls.minDistance = 2.5;
    this.controls.maxDistance = 150;
    this.controls.update();

    //setting lights
    const light0 = new THREE.AmbientLight("#ffffff", 0.3);
    light0.position.set(-10, +10, +20);
    light0.lookAt(0, 0, 0);
    light0.rotateX = 45;
    light0.rotateY = -15;
    this.scene.add(light0);

    const light1 = new THREE.DirectionalLight("#ffffff", 1);
    light1.position.set(+30, +30, -70);
    light1.lookAt(0, 0, 0);
    light1.rotateX = -20;
    light1.rotateY = -30;
    light1.castShadow = true;
    // scene.add(new THREE.PointLightHelper(light1,,"" ));
    this.scene.add(light1);
  };

  load3DModels = function () {
    //loading car 3D model
    const loader = new GLTFLoader();
    loader.load(
      "../models/car_lowpoly_mod_2.glb",
      (gltf) => {
        const car = gltf.scene;
        car.scale.set(5, 5, 5);
        car.position.y = 0;
        car.position.x = 0;
        // car.add(camera);
        // console.log(car);
        this.scene.add(car);
        //   car.getObjectByName("Circle_2").material.color.set("Magenta");
        car.getObjectByName("Circle_2").material.metalness = 0.8;
        car.getObjectByName("Circle_2").material.roughness = 0.3;
        car.add(new THREE.AxesHelper(5));

        this.visual3DObjects.car3DObject = car;
        console.log(this.visual3DObjects.car3DObject);
      },
      undefined,
      function (error) {
        console.error(error);
      },
    );
  };
  generateInteractiveEnvironment = function () {
    const planeGeometry = new THREE.BoxGeometry(200, 200, 0.02);
    const planeMesh = new THREE.Mesh(
      planeGeometry,
      new THREE.MeshPhongMaterial({ side: THREE.DoubleSide }),
    );
    planeMesh.rotateX(-Math.PI / 2);
    planeMesh.position.set(0, 0, 0);
    planeMesh.receiveShadow = true;
    this.visualWorldObjects.planeMesh = planeMesh;
    this.scene.add(planeMesh);

    // car body, mesh is the model
    const cubeGemotery = new THREE.BoxGeometry(3, 2, 2);
    const cubeMesh = new THREE.Mesh(
      cubeGemotery,
      new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        wireframe: true,
      }),
    );
    cubeMesh.add(new THREE.AxesHelper(5));
    this.visualWorldObjects.cubeMesh = cubeMesh;
    this.scene.add(cubeMesh);
  };
}

// //   setting gridhelper
// const size = 100;
// const divisions = 50;
// const gridHelper = new THREE.GridHelper(size, divisions);
// gridHelper.position.y = 0;
// scene.add(gridHelper);

// loading 3D model

// Define the start and end colors for the gradient
// let hue = 0;
// const maxHue = 360;
// const hueStep = 0.3;
export { CarVisualWorld };

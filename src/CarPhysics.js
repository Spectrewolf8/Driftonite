import * as CANNON from "cannon-es";
class CarPhysicsWorld {
  constructor() {
    this.world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.81, 0),
    });

    //declaring physics bodies buffer
    this.physicsWorldObjects = {};

    //declaring material buffer
    this.physicsWorldMaterials = {};

    //initilizing objects
    this.initializePhysicsWorld();
    this.initializeMaterials(); //initializing contacts and physics materials
    this.initializePhysicsBodies(); //initializing physics bodies
  }
  initializePhysicsWorld = function () {
    this.world.defaultContactMaterial.friction = 0.001;
  };

  initializeMaterials = function () {
    const planePhysicsMaterial = new CANNON.Material();
    const carPhysicsMaterial = new CANNON.Material();
    const CarToGroundContactMaterial = new CANNON.ContactMaterial(
      planePhysicsMaterial,
      carPhysicsMaterial,
      {
        friction: 0.3,
      },
    );
    this.world.addContactMaterial(CarToGroundContactMaterial);
    this.physicsWorldMaterials.planePhysicsMaterial = planePhysicsMaterial;
    this.physicsWorldMaterials.carPhysicsMaterial = carPhysicsMaterial;
    this.physicsWorldMaterials.CarToGroundContactMaterial = CarToGroundContactMaterial;
  };

  initializePhysicsBodies = function () {
    const planeBody = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Box(new CANNON.Vec3(100, 100, 0.01)),
      material: this.physicsWorldMaterials.planePhysicsMaterial,
    });
    planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    this.world.addBody(planeBody);
    this.physicsWorldObjects.planeBody = planeBody;

    const carPhysicsBody = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Box(new CANNON.Vec3(1.5, 1, 1)),
      material: this.physicsWorldMaterials.carPhysicsMaterial,
      type: CANNON.Body.DYNAMIC,
      position: new CANNON.Vec3(0, 10, 0),
      restitution: 0,
    });
    // cubeBody.position.y = 0;
    carPhysicsBody.angularFactor = new CANNON.Vec3(0, 1, 0);
    carPhysicsBody.linearDamping = 0.15;
    this.world.addBody(carPhysicsBody);
    this.physicsWorldObjects.carPhysicsBody = carPhysicsBody;
  };
  
}

export { CarPhysicsWorld };

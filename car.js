var Gun = {
  PISTOL: {
    energy: 10,
    shootDelay: 500,
    bulletSize: 20,
    shootAngleVelocity: Math.PI * 5,
  },
  MACHINE_GUN: {
    energy: 4,
    shootDelay: 50,
    bulletSize: 10,
    shootAngleVelocity: Math.PI * 0.8,
  },
  BAZOOKA: {
    energy: 50,
    shootDelay: 1000,
    bulletSize: 80,
    shootAngleVelocity: Math.PI * 8,
  },
};

var Thruster = {
  NORMAL: {
    energy: 50,
    thrustAngleAcceleration: Math.PI * 8,
    thrustAngleFriction: 0.85,
    thrustAcceleration: 1000,
  },
  FAST: {
    energy: 100,
    thrustAngleAcceleration: Math.PI * 12,
    thrustAngleFriction: 0.99,
    thrustAcceleration: 3000,
  },
  JUMP: {
    energy: 20,
    thrustAngleAcceleration: Math.PI * 1,
    thrustAngleFriction: 0.5,
    thrustAcceleration: 8000,
  },
};

function Car(world) {
  this.world = world;
  this.world.add(this);

  this.energy = Car.DEFAULT_ENERGY;

  this.gun = Gun.MACHINE_GUN;
  this.thruster = Thruster.NORMAL;

  this.shooting = false;
  this.lastShootTime = 0;
  this.thrusting = false;

  this.body = new RectangleBody(100, 60);
  this.world.addBody(this.body);
}

Car.DEFAULT_ENERGY = 3000;

Car.ANGLE_SCALE = 1.5;

Car.prototype.update = function(dt) {
  var time = Date.now();

  var maxVelocity = 200;
  if (this.thruster === Thruster.FAST) {
    maxVelocity = 250;
  }
  if (this.thruster === Thruster.JUMP) {
    maxVelocity = 300;
  }
  var velocity = magnitude(this.body.velocity);
  if (velocity > maxVelocity) {
    this.body.velocity = scale(normalize(this.body.velocity), maxVelocity);
  }
  var friction = 0.9;

  var gravity = 400;
  car.body.acceleration = [0, gravity];

  var maxAngleVelocity = 0.5 * Math.PI;
  if (Math.abs(this.body.angleVelocity) > maxAngleVelocity) {
    // this.body.angleVelocity =
    //     Math.sign(this.body.angleVelocity) * maxAngleVelocity;
  } 
  if (this.thrusting &&
      this.thruster != Thruster.JUMP) {
    var angle = this.body.angle - Math.PI / 2;
    var acceleration = [Math.cos(angle), Math.sin(angle)];
    this.useEnergy(this.thruster.energy * dt);
    acceleration = scale(acceleration, this.thruster.thrustAcceleration);

    this.body.acceleration = add(this.body.acceleration, acceleration);
    this.body.angleAcceleration = this.thruster.thrustAngleAcceleration * Car.ANGLE_SCALE;
  }

  var thrustAngleFriction = 0.85;
  this.body.angleVelocity *= thrustAngleFriction;
  // console.log(this.body.angleVelocity);

  if (this.shooting &&
      time - this.lastShootTime >= this.gun.shootDelay) {
    this.useEnergy(this.gun.energy);
    this.lastShootTime = time;
    this.shoot();
  }
};

Car.prototype.useEnergy = function(energy) {
  this.energy -= energy;
  if (this.energy < 0) {
    this.energy = 0;
  }
};

Car.prototype.shoot = function() {
  var angle = this.body.angle;
  var direction = [Math.cos(angle), Math.sin(angle)];
  var bullet = new Bullet(this.world, this.gun.bulletSize, this.gun.bulletSize);
  bullet.body.position =
      add(this.body.position,
          scale(direction, this.body.width / 2 + bullet.body.width / 2));
  var angleUp = angle - Math.PI / 2;
  var directionUp = [Math.cos(angleUp), Math.sin(angleUp)];
  bullet.body.position =
      add(bullet.body.position,
          scale(directionUp, this.body.height / 2));
  var bulletSpeed = 800;
  bullet.body.velocity = scale(direction, bulletSpeed);
  this.body.angleVelocity = -this.gun.shootAngleVelocity * Car.ANGLE_SCALE;
};

Car.prototype.render = function(ctx) {
  ctx.save();

  ctx.translate(this.body.position[0], this.body.position[1]);
  ctx.rotate(this.body.angle);
  ctx.fillStyle = '#ff0';
  ctx.fillRect(-this.body.width / 2,
               0,
               this.body.width,
               this.body.height / 2);
  // ctx.fillStyle = '#48f';
  ctx.fillRect(-this.body.width / 4,
               -this.body.height / 2,
               this.body.width / 2,
               this.body.height / 2 + 5);
  switch (this.gun) {
    case Gun.PISTOL:
      break;
    case Gun.MACHINE_GUN:
      break;
    case Gun.BAZOOKA:
      break;
  }
  switch (this.thruster) {
    case Thruster.NORMAL:
      break;
    case Thruster.FAST:
      break;
    case Thruster.JUMP:
      break;
  }

  ctx.restore();
};

Car.prototype.startShooting = function() {
  this.shooting = true;
};

Car.prototype.stopShooting = function() {
  this.shooting = false;
};

Car.prototype.startThruster = function() {
  this.thrusting = true;
  switch (this.thruster) {
    case Thruster.JUMP:
      var angle = this.body.angle - Math.PI / 2;
      var direction = [Math.cos(angle), Math.sin(angle)];
      this.useEnergy(this.thruster.energy);
      var velocity = scale(direction, this.thruster.thrustAcceleration);

      this.body.velocity = add(this.body.velocity, velocity);
      this.body.angleVelocity = this.thruster.thrustAngleAcceleration * Car.ANGLE_SCALE;
      break;
  }
};

Car.prototype.stopThruster = function() {
  this.thrusting = false;
};

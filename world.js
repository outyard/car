function World() {
  this.objects = [];
  this.bodies = [];
}

World.prototype.update = function(dt) {
  for (var i = 0; i < this.bodies.length; ++i) {
    this.bodies[i].update(dt);
  }
  this.handleCollisions();
  for (var i = 0; i < this.objects.length; ++i) {
    this.objects[i].update(dt);
  }
};

World.prototype.render = function(ctx) {
  for (var i = 0; i < this.objects.length; ++i) {
    this.objects[i].render(ctx);
  }
};

World.prototype.add = function(object) {
  this.objects.push(object);
};

World.prototype.remove = function(object) {
  var index = this.objects.indexOf(object);
  this.objects.splice(index, 1);
};

World.prototype.addBody = function(body) {
  this.bodies.push(body);
};

World.prototype.removeBody = function(body) {
  var index = this.bodies.indexOf(body);
  this.bodies.splice(index, 1);
};

World.prototype.handleCollisions = function() {
  for (let i = 0; i < this.bodies.length; ++i) {
    let body1 = this.bodies[i];
    for (let j = i + 1; j < this.bodies.length; ++j) {
      let body2 = this.bodies[j];
      if (body1.collidesWith(body2)) {
        // send events for collision handlers in e.g. car and bullet classes
        body1.onCollided(body2);
        body2.onCollided(body1);
        resolveCollision(body1, body2);
      }
    }
  }
}


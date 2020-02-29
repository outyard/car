function Balloon(world, size, color) {
  this.world = world;
  this.world.add(this);

  this.color = color;

  this.body = new RectangleBody(size, size);
  this.body.shouldCollide = false;
  this.world.addBody(this.body);

  this.body.onCollided = (body) => {
    this.pop();
  };
}

Balloon.prototype.update = function(dt) {
};

Balloon.prototype.onPop = function() {
};

Balloon.prototype.pop = function() {
  this.world.remove(this);
  this.world.removeBody(this.body);
  this.onPop();
};

Balloon.prototype.render = function(ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(this.body.position[0], this.body.position[1],
          this.body.width / 2, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
};

function Bullet(world, width, height) {
  this.world = world;
  this.world.add(this);

  this.spawnTime = Date.now();

  this.body = new RectangleBody(width, height);
  this.world.addBody(this.body);

  this.body.onCollided = (body) => {
    this.world.remove(this);
    this.world.removeBody(this.body);
  };
}

Bullet.MAX_AGE = 1000;

Bullet.prototype.update = function(dt) {
  if (Date.now() - this.spawnTime >= Bullet.MAX_AGE) {
    this.world.remove(this);
    this.world.removeBody(this.body);
  }
};

Bullet.prototype.render = function(ctx) {
  ctx.save();
  ctx.rotate(this.body.angle);
  ctx.fillStyle = '#ff0';
  ctx.fillRect(this.body.position[0] - this.body.width / 2,
               this.body.position[1] - this.body.height / 2,
               this.body.width,
               this.body.height);
  ctx.restore();
};

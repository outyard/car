function Wall(world, width, height) {
  this.world = world;
  this.world.add(this);

  this.body = new RectangleBody(width, height);
  this.body.fixed = true;
  this.world.addBody(this.body);
}

Wall.prototype.update = function(dt) {
};

Wall.prototype.render = function(ctx) {
  ctx.save();
  ctx.fillStyle = '#644';
  ctx.fillRect(this.body.position[0] - this.body.width / 2,
               this.body.position[1] - this.body.height / 2,
               this.body.width,
               this.body.height);
  ctx.restore();
};

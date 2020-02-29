var canvas;
var ctx;
var pressedKeys;

var world;

var score;
var energy;

var car;
var balloon;
var goalBalloon;

var groundHeight = 300;
var backgroundImage;

init();
run();

function init() {
  backgroundImage = new Image();
  backgroundImage.src = 'background.jpg';

  canvas = document.querySelector('#canvas');
  canvas.width = 800;
  canvas.height = 550;

  ctx = canvas.getContext('2d');
  pressedKeys = [];
}

function restart() {
  world = new World();
  score = 0;
  loadWorld();
}

function loadWorld() {
  car = new Car(world);
  car.body.position = [250, 0];
  car.gun = Gun.MACHINE_GUN;

  var ground = new Wall(world, 500, groundHeight);
  ground.body.position = [ground.body.width / 2, ground.body.height];

  var ceiling = new Wall(world, 2550, groundHeight);
  ceiling.body.position = [ceiling.body.width / 2, -1000];

  var ground2 = new Wall(world, 500, groundHeight);
  ground2.body.position = [ground2.body.width / 2 + 1000, ground2.body.height];

  var ground3 = new Wall(world, 450, groundHeight);
  ground3.body.position = [ground3.body.width / 2 + 2000, ground3.body.height];

  var leftWall = new Wall(world, 150, 1200);
  leftWall.body.position = [75, -400];

  var rightWall = new Wall(world, 150, 1200);
  rightWall.body.position = [2500, -400];

  var floating = new Wall(world, 150, 900);
  floating.body.position = [1425, -000];
  var floating2 = new Wall(world, 150, 700);
  floating2.body.position = [1800, -700];

  addBalloon(500, -200, 100, '#0ff');
  addBalloon(1000, -150, 60, '#f0f');
  addBalloon(1200, -110, 40, '#0ff');
  addBalloon(1200, -710, 70, '#0f8');
  addBalloon(300, -710, 70, '#f8f');
  addBalloon(2000, -710, 55, '#8ff');
  addBalloon(2300, -310, 40, '#ff8');
  addBalloon(1900, -50, 70, '#f0f');
  addBalloon(1600, 0, 30, '#0ff');
  addBalloon(1600, -400, 60, '#08f');

  goalBalloon = new Balloon(world, 130, '#ff0');
  goalBalloon.body.position = [2280, -700];
  goalBalloon.onPop = function() {
    restart();
  };
}

function addBalloon(x, y, size, color) {
  balloon = new Balloon(world, size, color);
  balloon.body.position = [x, y];
  balloon.onPop = function() {
    ++score;
  };
}

function run() {
  var lastTime = Date.now();

  restart();

  clickGun(document.querySelector('#pistol-button'));
  clickThruster(document.querySelector('#normal-button'));
  
  (function loop() {
    requestAnimationFrame(loop);

    var time = Date.now();
    var dt = (time - lastTime) / 1000;
    lastTime = time;

    update(dt);
    render();
  })();
}

function update(dt) {
  car.update(dt);

  // todo: use energy
  var carAcceleration = 400;
  // if driving on ground
  if (Math.abs(car.body.velocity[1]) < 0.1) {
    car.body.acceleration[0] = 0;
    var accelerationEnergy = 50;
    if (pressedKeys[keyCode['Left']]) {
      car.body.acceleration[0] = -carAcceleration;
      car.useEnergy(50 * dt);
    }
    if (pressedKeys[keyCode['Right']]) {
      car.body.acceleration[0] = carAcceleration;
      car.useEnergy(50 * dt);
    }
  }

  if (car.body.position[1] > groundHeight) {
    restart();
  }

  world.update(dt);

  if (car.energy <= 0) {
    restart();
  }
}

function render() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(0.8, 0.8);
  // ctx.scale(0.2, 0.2);
  ctx.translate(-car.body.position[0] - canvas.width * 0.3,
                -car.body.position[1] + canvas.height * 0.1);
  ctx.drawImage(backgroundImage, -600, -1800, 7000, 3500);
  
  world.render(ctx);

  ctx.restore();

  drawUi();
}

function drawUi() {
  var energy = car.energy;
  ctx.fillStyle = '#f80';
  ctx.fillRect(0, 0, energy / Car.DEFAULT_ENERGY * canvas.width, 20);

  ctx.fillStyle = '#fff';
  ctx.font = '40px arial';
  ctx.fillText(score, 20, 70);
}

window.addEventListener('keydown', (e) => {
  pressedKeys[e.keyCode] = true;

  switch (e.keyCode) {
    case keyCode['Up']:
      car.startThruster();
      break;
    case keyCode['Space']:
      car.startShooting();
      break;
  }
});

window.addEventListener('keyup', (e) => {
  pressedKeys[e.keyCode] = false;

  switch (e.keyCode) {
    case keyCode['Up']:
      car.stopThruster();
      break;
    case keyCode['Space']:
      car.stopShooting();
      break;
  }
});

function clickGun(button) {
  var gunButtons = document.querySelectorAll('#gun-buttons button');
  for (var i = 0; i < gunButtons.length; ++i) {
    gunButtons[i].classList.remove('selected');
  }

  button.classList.add('selected');
  var name = button.getAttribute('data-value');
  car.gun = Gun[name];
}

function clickThruster(button) {
  var thrusterButtons = document.querySelectorAll('#thruster-buttons button');
  for (var i = 0; i < thrusterButtons.length; ++i) {
    thrusterButtons[i].classList.remove('selected');
  }

  button.classList.add('selected');
  var name = button.getAttribute('data-value');
  car.thruster = Thruster[name];
}

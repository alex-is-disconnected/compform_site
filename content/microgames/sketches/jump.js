// require https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5.js
// require /microgames/sketches/p5.play.js

//http://keycode.info/
const key_a = 65;
const key_d = 68;
const key_space = 32;

let ball;
let walls;

let camera_y = 0;

function setup() {
  createCanvas(512, 512);

  ball = createSprite(250, -50, 20, 20);
  ball.draw = () => {
    push();
    stroke(255);
    fill(0);
    ellipse(0, 0, 20, 20);
    pop();
  };
  walls = new Group();
  const bottom_wall = createSprite(width * 0.5, 5, width + 10, 10);
  bottom_wall.immovable = true;
  walls.add(bottom_wall);

  buildCourse(walls);
}

function buildCourse(walls) {
  let rows = 128;
  let cols = 16;
  let grid = width / cols;
  for (row = 0; row < rows; row++) {
    for (col = 0; col < cols; col++) {
      const bias = (col / cols) * 0.1;
      const hold = noise(col * 0.3, row * 0.3) + bias < 0.4;
      const cliff = col === 0;
      if (!cliff && !hold) continue;
      let x = col * grid;
      let y = -row * grid - col * 16;
      const block = createSprite(x, y, grid, grid);
      block.immovable = true;
      walls.add(block);
    }
  }
}

function draw() {
  // physics
  ball.velocity.y += 0.5;
  ball.velocity.x *= 0.9;
  ball.velocity.y *= 0.9;

  camera_y = lerp(camera_y, ball.position.y, 0.05);

  // input
  if (keyIsDown(key_a)) {
    ball.velocity.x = lerp(ball.velocity.x, -5, 0.5);
  }
  if (keyIsDown(key_d)) {
    ball.velocity.x = lerp(ball.velocity.x, 5, 0.5);
  }
  if (keyIsDown(key_space) && ball.overlap(walls)) {
    ball.velocity.y = -20;
  }

  // collision
  ball.collide(walls, (ball, wall) => {
    ball.velocity.x *= 0.9;
    ball.velocity.y *= 0.9;
  });

  if (ball.position.x > width) ball.position.x = width;

  // draw
  background(50);

  translate(0, -camera_y);
  translate(0, height * 0.75);
  drawSprites();
}

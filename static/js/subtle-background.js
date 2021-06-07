const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const PARTICLE_AMOUNT = 100;
const MAX_SPEED = 1;
const MAX_RADIUS = 1;
const CONNECT_DISTANCE = 150;
const COLOR = '#F2F2F2'

let particles = [];

function draw(p) {
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
  ctx.fillStyle = COLOR;
  ctx.fill();
}

function connect() {
  let opacity = 1;
  for (let i = 0; i < particles.length; i++) {
    let p1 = particles[i];

    for (let j = 0; j < particles.length; j++) {
      let p2 = particles[j];

      let a = p1.x - p2.x;
      let b = p1.y - p2.y;
      let c = Math.sqrt(a * a + b * b);

      if (c < CONNECT_DISTANCE) {
        let opacity = 1 - (c / 20000);
        ctx.strokeStyle = 'rgba(242, 242, 242,' + opacity + ')';
        ctx.lineWidth = 0.01;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  }
}

function move(p) {

  if (p.x + p.radius > canvas.width || p.x - p.radius < 0) {
    p.dx *= -1;
  }

  if (p.y + p.radius > canvas.height || p.y - p.radius < 0) {
    p.dy *= -1;
  }

  p.x += p.dx;
  p.y += p.dy;
}

function init() {
  for (let i = 0; i < PARTICLE_AMOUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      dx: (Math.random() * MAX_SPEED) - MAX_SPEED / 2, //Between 1 and -1
      dy: (Math.random() * MAX_SPEED) - MAX_SPEED / 2,
      radius: Math.random() * MAX_RADIUS + 1
    });
  }
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    draw(particles[i]);
    connect();
  }
  requestAnimationFrame(update);
}

init();
update();


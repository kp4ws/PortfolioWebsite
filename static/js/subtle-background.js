const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = document.body.scrollHeight; //TODO! Make responsive size

const PARTICLE_AMOUNT = 150;
const MAX_SPEED = 1;
const MAX_RADIUS = 1;
const CONNECT_DISTANCE = 100;
const LINE_WIDTH = 1;
const PARTICLE_COLOR = '#F2F2F2'

let particles = [];

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "lighter";

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    //Create circle (particle)
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = PARTICLE_COLOR;
    ctx.fill();

    //optional
    //ctx.strokeStyle = 'orange';
    //ctx.stroke();
  }

  connectParticles();
}

function connectParticles() {
  let strokeOpacity = 1;
  for (let i = 0; i < particles.length; i++) {
    let p1 = particles[i];

    for (let j = 0; j < particles.length; j++) {
      let p2 = particles[j];

      //Pythagorean theorem for distance
      let sideA = p2.x - p1.x;
      let sideB = p2.y - p1.y;
      let distance = Math.sqrt(sideA * sideA + sideB * sideB);

      //Create line if within distance
      if (distance < CONNECT_DISTANCE) {
        strokeOpacity = 1 - distance / 100; //TODO
        
        ctx.beginPath();

         //Gives the connected lines a specific opacity baseed on distance to each other
        ctx.strokeStyle = 'rgba(242, 242, 242,' + strokeOpacity + ')'; 
        
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineWidth = LINE_WIDTH;
        ctx.stroke();
      }
    }
  }
}

function moveParticles() {

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    //Collision detection
    if (p.x + p.radius > canvas.width || p.x - p.radius < 0) {
      p.dx *= -1;
    }

    if (p.y + p.radius > canvas.height || p.y - p.radius < 0) {
      p.dy *= -1;
    }

    //Move particle
    p.x += p.dx;
    p.y += p.dy;
  }

}

function init() {
  
  //Populate particles array
  for (let i = 0; i < PARTICLE_AMOUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,  //Between 0 and canvas.width ?
      y: Math.random() * canvas.height, //Between 0 and canvas.height ?
      dx: (Math.random() * MAX_SPEED) - MAX_SPEED / 2, //Between MAX_SPEED and -MAX_SPEED
      dy: (Math.random() * MAX_SPEED) - MAX_SPEED / 2, //Between MAX_SPEED and -MAX_SPEED
      radius: Math.random() * MAX_RADIUS + 1 //Between 1 and MAX_RADIUS ?
    });
  }
}

function update() {
  drawParticles();
  moveParticles();

  requestAnimationFrame(update);
}

init();
update();


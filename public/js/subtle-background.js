const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = document.body.scrollHeight;

const MAX_SPEED = 0.2;
const MAX_RADIUS = 5;
const LINE_WIDTH = 1;
const PARTICLE_COLOR = 'rgb(192,192,192)';

let PARTICLE_AMOUNT = 100;
let CONNECT_DISTANCE = 100;

let particles;
let isSmall;
let windowSetting;

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
  }

  connectParticles();
}

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    let p1 = particles[i];

    for (let j = 0; j < particles.length; j++) {
      let p2 = particles[j];

      //Pythagorean theorem for distance
      let sideA = p2.x - p1.x;
      let sideB = p2.y - p1.y;
      let distance = Math.sqrt(sideA * sideA + sideB * sideB);

      //Create line if within distance
      if (distance <= CONNECT_DISTANCE) {
        strokeOpacity = 1 - distance / CONNECT_DISTANCE;
        ctx.beginPath();

         //Gives the connected lines a specific opacity baseed on distance to each other
        ctx.strokeStyle = 'rgba(192,192,192,' + strokeOpacity + ')';
        
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

function resizeParticles()
{
  if(canvas.width < 1000)
  {
    windowSetting = 0;
  }
  else if (canvas.width < 1500)
  {
    windowSetting = 1;
  }
  else if (canvas.width < 2000)
  {
    windowSetting = 2;
  }
}

function init() {

  resizeParticles();

  switch(windowSetting)
  {
    case 0:
      if (canvas.width < 1000) {
        PARTICLE_AMOUNT = 100;
        CONNECT_DISTANCE = 100;
        windowSetting = 1;
        createParticles();
      }
      break;
      case 1:
      if (canvas.width > 1500 && !isSmall) {
        PARTICLE_AMOUNT = 200;
        CONNECT_DISTANCE = 100;
        windowSetting = 2;
      }
      createParticles();
        break;
        case 2:
          createParticles();
          break;

    default:
      if (canvas.width < 1000)
      {
        PARTICLE_AMOUNT = 100;
        CONNECT_DISTANCE = 100;
        windowSetting = 1;
      }
      else {
        PARTICLE_AMOUNT = 200;
        CONNECT_DISTANCE = 100;
        windowSetting = 2;
      }
      createParticles();
    break;
  }
  
}

function createParticles()
{
  //Reset particles array
  particles = [];

  //Populate particles array
  for (let i = 0; i < PARTICLE_AMOUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,  //Between 0 and canvas.width 
      y: Math.random() * canvas.height, //Between 0 and canvas.height 
      dx: (Math.random() * MAX_SPEED) - MAX_SPEED / 2, //Between MAX_SPEED and -MAX_SPEED
      dy: (Math.random() * MAX_SPEED) - MAX_SPEED / 2, //Between MAX_SPEED and -MAX_SPEED
      radius: Math.random() * MAX_RADIUS + 1 //Between 1 and MAX_RADIUS 
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

window.addEventListener('resize', function(){
  canvas.width = window.innerWidth;
  canvas.height = document.body.scrollHeight;
  init();
});
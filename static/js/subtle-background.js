const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = document.body.scrollHeight;

const PARTICLE_COLOR = 'rgb(192,192,192)';
const MQLS = [
  window.matchMedia('(min-width: 576px)'),
  window.matchMedia('(min-width: 768px)'),
  window.matchMedia('(min-width: 992px)'),
  window.matchMedia('(min-width: 1200px)'),
  window.matchMedia('(min-width: 1600px)')
]

let maxSpeed;
let maxRadius;
let lineWidth;
let particleAmount;
let connectDistance;
let particles;

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //ctx.globalCompositeOperation = "lighter";

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
      if (distance <= connectDistance) {
        strokeOpacity = 1 - distance / connectDistance;
        ctx.beginPath();

        //Gives the connected lines a specific opacity baseed on distance to each other
        ctx.strokeStyle = 'rgba(192,192,192,' + strokeOpacity + ')';

        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineWidth = lineWidth;
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

function update() {
  drawParticles();
  moveParticles();
  
  requestAnimationFrame(update);
}

function resetParticles(speed, radius, width, amount, distance) {
  particles = [];
  maxSpeed = speed;
  maxRadius = radius;
  lineWidth = width;
  particleAmount = amount;
  connectDistance = distance;

  //Populate particles array
  for (let i = 0; i < particleAmount; i++) {
    particles.push({
      x: Math.random() * canvas.width,  //Between 0 and canvas.width 
      y: Math.random() * canvas.height, //Between 0 and canvas.height 
      dx: (Math.random() * maxSpeed) - maxSpeed / 2, //Between maxSpeed and -maxSpeed
      dy: (Math.random() * maxSpeed) - maxSpeed / 2, //Between maxSpeed and -maxSpeed
      radius: Math.random() * maxRadius + 1 //Between 1 and maxRadius 
    });
  }
}

function resizeParticles() {
  if (MQLS[0].matches && !MQLS[1].matches && !MQLS[2].matches && !MQLS[3].matches && !MQLS[4].matches) {
    //console.log("portrait");
    //Portrait phones
    resetParticles(0.2, 5, 1, 95, 120);
  }
  else if (MQLS[1].matches && !MQLS[2].matches && !MQLS[3].matches && !MQLS[4].matches) {
    //console.log("tablet");
    //Tablets
    resetParticles(0.2, 5, 1, 100, 150);
  }
  else if (MQLS[2].matches && !MQLS[3].matches && !MQLS[4].matches) {
    //console.log("laptop");
    //Laptops
    resetParticles(0.2, 5, 1, 150, 200);
  }
  else if (MQLS[3].matches && !MQLS[4].matches) {
    // console.log("extra large");
    //Large devices
    resetParticles(0.2, 5, 1, 200, 200);
  }
  else if (MQLS[4].matches)
  {
    // console.log("extra XL large");
    //Extra large devices
    resetParticles(0.2, 5, 1, 400, 200);
  }
  else if (!MQLS[0].matches && !MQLS[1].matches && !MQLS[2].matches && !MQLS[3].matches && !MQLS[4].matches) {
    // console.log("mobile");
    //mobile phone
    resetParticles(0.2, 5, 1, 90, 80);
  }
}

for (let i = 0; i < MQLS.length; i++) {
  MQLS[i].addEventListener("change", resizeParticles);
}

window.addEventListener('resize', function () {
  canvas.width = window.innerWidth;
  canvas.height = document.body.scrollHeight;
});

resizeParticles();
update();
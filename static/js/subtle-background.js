"use strict";

const canvas = document.getElementById("bg-canvas").transferControlToOffscreen();
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = document.body.scrollHeight;

const MQLS = [
  window.matchMedia('(min-width: 576px)'),
  window.matchMedia('(min-width: 768px)'),
  window.matchMedia('(min-width: 992px)'),
  window.matchMedia('(min-width: 1200px)'),
  window.matchMedia('(min-width: 1600px)')
]

let particleSystem = null;

class ParticleSystem {
  #particle_color = 'rgb(192,192,192)';
  constructor(maxSpeed, maxRadius, lineWidth, particleAmount, connectDistance) {
    this.maxSpeed = maxSpeed;
    this.maxRadius = maxRadius;
    this.lineWidth = lineWidth;
    this.particleAmount = particleAmount;
    this.connectDistance = connectDistance;
    this.particles = [];
    this.init();
  }

  init() {
    //Populate particles array
    for (let i = 0; i < this.particleAmount; i++) {
      this.particles.push({
        x: Math.random() * canvas.width,  //Between 0 and canvas.width 
        y: Math.random() * canvas.height, //Between 0 and canvas.height 
        dx: (Math.random() * this.maxSpeed) - this.maxSpeed / 2, //Between maxSpeed and -maxSpeed
        dy: (Math.random() * this.maxSpeed) - this.maxSpeed / 2, //Between maxSpeed and -maxSpeed
        radius: Math.random() * this.maxRadius + 1 //Between 1 and maxRadius 
      });
    }
  }

  run() {
    this.drawParticles();
    this.connectParticles();
    this.moveParticles();
  }

  drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //ctx.globalCompositeOperation = "lighter";

    for (let i = 0; i < this.particles.length; i++) {
      let p = this.particles[i];

      //Create circle (particle)
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.#particle_color;
      ctx.fill();
    }
  }

  connectParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      let p1 = this.particles[i];

      for (let j = 0; j < this.particles.length; j++) {
        let p2 = this.particles[j];

        //Pythagorean theorem for distance
        let sideA = p2.x - p1.x;
        let sideB = p2.y - p1.y;
        let distance = Math.sqrt(sideA * sideA + sideB * sideB);

        //Create line if within distance
        if (distance <= this.connectDistance) {
          let strokeOpacity = 1 - distance / this.connectDistance;
          ctx.beginPath();

          //Gives the connected lines a specific opacity baseed on distance to each other
          ctx.strokeStyle = 'rgba(192,192,192,' + strokeOpacity + ')';

          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineWidth = this.lineWidth;
          ctx.stroke();
        }
      }
    }
  }

  moveParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      let p = this.particles[i];

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

}

function resizeParticles() {
  if (MQLS[0].matches && !MQLS[1].matches && !MQLS[2].matches && !MQLS[3].matches && !MQLS[4].matches) {
    particleSystem = new ParticleSystem(0.2, 5, 1, 95, 120);
  }
  else if (MQLS[1].matches && !MQLS[2].matches && !MQLS[3].matches && !MQLS[4].matches) {
    particleSystem = new ParticleSystem(0.2, 5, 1, 100, 150);
  }
  else if (MQLS[2].matches && !MQLS[3].matches && !MQLS[4].matches) {
    particleSystem = new ParticleSystem(0.2, 5, 1, 150, 200);
  }
  else if (MQLS[3].matches && !MQLS[4].matches) {
    particleSystem = new ParticleSystem(0.2, 5, 1, 200, 200);
  }
  else if (MQLS[4].matches) {
    particleSystem = new ParticleSystem(0.2, 5, 1, 400, 200);
  }
  else if (!MQLS[0].matches && !MQLS[1].matches && !MQLS[2].matches && !MQLS[3].matches && !MQLS[4].matches) {
    particleSystem = new ParticleSystem(0.2, 5, 1, 90, 80);
  }
}

for (let i = 0; i < MQLS.length; i++) {
  MQLS[i].addEventListener("change", resizeParticles);
}

window.addEventListener('resize', function () {
  canvas.width = window.innerWidth;
  canvas.height = document.body.scrollHeight;
});

function update() {
  particleSystem.run();
  requestAnimationFrame(update);
}

resizeParticles();
update();
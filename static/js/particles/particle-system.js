const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Used for bug fixes when resizing window
let currentWindowWidth = window.innerWidth;

let particles = [];
let connections = [];

function getParticleAmount() {
  const screenWidth = window.innerWidth;

  if (screenWidth < 768) {
    //Mobile
    return 200;
  } else if (screenWidth < 1200) {
    //Tablet
    return 500;
  } else {
    //Large screens
    return 800;
  }
}

function getConnectionDistance() {
  const screenWidth = window.innerWidth;

  if (screenWidth < 768) {
    //Mobile
    return 80;
  } else if (screenWidth < 1200) {
    //Tablet
    return 90;
  } else {
    //Large screens
    return 100;
  }
}

function initializeParticles() {
  const particleAmount = getParticleAmount();
  //clear existing particles and connections
  particles = [];
  connections = [];

  for (let i = 0; i < particleAmount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
    });
  }
}

initializeParticles();

if(window.Worker) {
  //If browser supports web workers, perform particle tasks in worker object
  const worker = new Worker("/js/particles/particle-worker.js");
  
  worker.onmessage = (event) => {
    particles = event.data.particles;
    connections = event.data.connections;
    drawParticles();
  };

  function drawParticles() {
    //Draw particles
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
    }

    //Draw connections
    for (const connection of connections) {
      const p1 = particles[connection.i];
      const p2 = particles[connection.j];
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = `rgba(255, 255, 255, ${connection.opacity})`; // White with opacity
      ctx.stroke();
    }
    requestAnimationFrame(updateParticles);
  }

  function updateParticles() {
    const connectionDistance = getConnectionDistance();
    worker.postMessage({
      particles: particles,
      width: canvas.width,
      height: canvas.height,
      connectionDistance: connectionDistance,
    });
  }

  drawParticles();
}
else {
  //Browser doesn't support web workers. 
  //Fallback is simply drawing particles once without updating.
  function drawParticlesFallback() {
    //Draw particles
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
    }
  }

  drawParticlesFallback();
}

window.addEventListener('resize', () => {
  //Sometimes this fires incorrectly on mobile devices, so we check against width to see if there is a change.
  if(window.innerWidth === currentWindowWidth) {
    return;
  }
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  currentWindowWidth = window.innerWidth; 

  initializeParticles();
  window.Worker ? drawParticles() : drawParticlesFallback();
});
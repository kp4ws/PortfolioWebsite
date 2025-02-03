const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Callback function for initializing particles
let initCallback;

//Determines whether requestAnimation should run or not
let animationEnabled = true;

if(window.Worker) {
  //If browser supports web workers, perform particle tasks in worker object
  const worker = new Worker("/js/particles/particle-worker.js");
  
  worker.onmessage = (event) => {
    const {particles, connections} = event.data;
    drawParticles(particles, connections);
  };

  function drawParticles(particles = [], connections = []) {
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

    if(animationEnabled) {
      requestAnimationFrame(() => updateParticles(particles));
    }
  }

  function updateParticles(particles) {
    worker.postMessage({
      action: "update",
      particles: particles,
      width: canvas.width,
      height: canvas.height,
    });
  }

  initCallback = () => {
    worker.postMessage({
      action: "init",
      width: canvas.width,
      height: canvas.height,
    });
  };

  initCallback();
}
else {
  //Browser doesn't support web workers. 
  //Fallback is simply drawing particles once without updating.

  function initializeParticlesFallback() {
    const particleAmount = 500; //Arbitrary number not based on screen width
    const particles = [];

    for (let i = 0; i < particleAmount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      });
    }
    
    return particles;
  } 

  function drawParticlesFallback(particles) {
    //Draw particles
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
    }
  }

  //Define initCallback used for initialization
  initCallback = () => {
    const particles = initializeParticlesFallback();
    drawParticlesFallback(particles);
  };

  initCallback();
}

//Used for bug fixes when resizing window
let currentWindowWidth = window.innerWidth;
let resizeTimeout;

window.addEventListener('resize', () => {
  //Sometimes this fires incorrectly on mobile devices, so we check against width to see if there is a change.
  if (window.innerWidth === currentWindowWidth) return;
  currentWindowWidth = window.innerWidth;
  
  animationEnabled = false;
  clearTimeout(resizeTimeout);

  resizeTimeout = setTimeout(() => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initCallback();
    animationEnabled = true;
  }, 200); //Debounce with 200ms delay
});
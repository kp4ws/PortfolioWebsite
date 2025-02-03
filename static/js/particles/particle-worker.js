function getParticleAmount(screenWidth) {
  if (screenWidth < 768) {
    //Mobile
    return 350;
  } else if (screenWidth < 1200) {
    //Tablet
    return 400;
  } else {
    //Large screens
    return 650;
  }
}

function getConnectionDistance(screenWidth) {
  if (screenWidth < 768) {
    //Mobile
    return 70;
  } else if (screenWidth < 1200) {
    //Tablet
    return 80;
  } else {
    //Large screens
    return 90;
  }
}

function initializeParticles(canvasWidth, canvasHeight) {
  const particleAmount = getParticleAmount(canvasWidth);
  const particles = [];

  for (let i = 0; i < particleAmount; i++) {
    particles.push({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
    });
  }

  return particles;
}

function updateParticles(particles, canvasWidth, canvasHeight) {  
  //Update particle logic
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;

    //Boundary bouncing
    if (p.x + p.radius > canvasWidth) {
      p.x = canvasWidth - p.radius;
      p.vx *= -1;
    } else if (p.x - p.radius < 0) {
      p.x = p.radius;
      p.vx *= -1;
    }

    if (p.y + p.radius > canvasHeight) {
      p.y = canvasHeight - p.radius;
      p.vy *= -1;
    } else if (p.y - p.radius < 0) {
      p.y = p.radius;
      p.vy *= -1;
    }
  }

  //Particle connection logic
  const connectionDistance = getConnectionDistance(canvasWidth);
  const connections = [];

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const p1 = particles[i];
      const p2 = particles[j];

      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < connectionDistance) {
        const opacity = 1 - distance / connectionDistance;
        connections.push({ i, j, distance, opacity }); // Store indices and distance
      }
    }
  }

  return {particles, connections};
}

onmessage = (event) => {
  const {action, ...data} = event.data;

  switch(action) {
    case 'init':
      const particles = initializeParticles(data.width, data.height);
      postMessage({ particles: particles });
      break;
    
    case 'update':
      const updatedData = updateParticles(data.particles, data.width, data.height);
      postMessage({ particles: updatedData.particles, connections: updatedData.connections });
      break;

    default:
      console.log('undefined action passed to worker');
      break;
  }
};

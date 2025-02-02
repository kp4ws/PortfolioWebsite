onmessage = (event) => {
  let particles = event.data.particles;
  const canvasWidth = event.data.width;
  const canvasHeight = event.data.height;
  const connectionDistance = event.data.connectionDistance;
  const connections = [];

  //Update particle logic
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;

    //Boundary bouncing
    if (p.x + p.radius > canvasWidth) {
      p.x = canvasWidth - p.radius;
      p.vx *= -1;
    }
    else if (p.x - p.radius < 0) {
      p.x = p.radius;
      p.vx *= -1;
    }

    if (p.y + p.radius > canvasHeight) {
      p.y = canvasHeight - p.radius;
      p.vy *= -1;
    }
    else if (p.y - p.radius < 0) {
      p.y = p.radius;
      p.vy *= -1;
    }
  }

  //Particle connection logic
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const p1 = particles[i];
      const p2 = particles[j];

      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < connectionDistance) {
        const opacity = 1 - distance / connectionDistance;
        connections.push({i, j, distance, opacity}); // Store indices and distance
      }
    }
  }

  //Send updated particles and their connections back
  postMessage({particles, connections});
};

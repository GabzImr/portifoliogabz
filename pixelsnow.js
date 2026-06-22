
function initPixelSnow(canvasId, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const config = {
    color:       options.color       ?? '#B497CF',
    density:     options.density     ?? 100,   
    minSize:     options.minSize     ?? 2,
    maxSize:     options.maxSize     ?? 5,
    speed:       options.speed       ?? 0.6,
    glow:        options.glow        ?? true,
    drift:       options.drift       ?? 0.3,  
  };

  let width, height;
  let particles = [];
  let animId;

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return { r, g, b };
  }
  const baseColor = hexToRgb(config.color);

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width  = canvas.width  = rect.width;
    height = canvas.height = rect.height;
  }

  function createParticle(randomY = true) {
    const depth = Math.random(); 
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : -10,
      size: config.minSize + depth * (config.maxSize - config.minSize),
      speed: (0.3 + depth * 0.7) * config.speed,
      depth,
      driftPhase: Math.random() * Math.PI * 2,
      driftSpeed: 0.3 + Math.random() * 0.4,
      opacity: 0.25 + depth * 0.6,
      twinklePhase: Math.random() * Math.PI * 2,
    };
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < config.density; i++) {
      particles.push(createParticle(true));
    }
  }

  let time = 0;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    time += 0.016;

    particles.forEach(p => {
      
      p.y += p.speed;

      
      p.driftPhase += 0.016 * p.driftSpeed;
      const driftX = Math.sin(p.driftPhase) * config.drift * (1 + p.depth);

      
      if (p.y > height + 10) {
        Object.assign(p, createParticle(false));
      }

      const drawX = p.x + driftX;
      const drawY = p.y;

      
      const twinkle = config.glow
        ? 0.75 + 0.25 * Math.sin(time * 1.5 + p.twinklePhase)
        : 1;

      const alpha = p.opacity * twinkle;

      if (config.glow) {
        ctx.shadowBlur = p.size * 2;
        ctx.shadowColor = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${alpha * 0.6})`;
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.fillStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${alpha})`;
      ctx.fillRect(
        Math.round(drawX),
        Math.round(drawY),
        Math.round(p.size),
        Math.round(p.size)
      );
    });

    ctx.shadowBlur = 0;
    animId = requestAnimationFrame(draw);
  }

  resize();
  initParticles();
  window.addEventListener('resize', () => {
    resize();
  });
  draw();

  return () => {
    cancelAnimationFrame(animId);
  };
}

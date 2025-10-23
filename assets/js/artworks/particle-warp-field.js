// Particle Warp Field
// Artwork module with p5.js instance mode

export class ParticleWarpField {
  constructor(containerId) {
    this.containerId = containerId;
    this.instance = null;
    this.particles = [];
    this.colorMode = window.colorMode || false;
    this.config = this.generateConfig();
  }

  getColorPalette() {
    if (!this.colorMode) return null;
    return {
      background: '#000000',
      particle: '#892CDC'
    };
  }

  generateConfig() {
    return {
      particleCount: Math.floor(Math.random() * 200) + 200, // 200-400
      forceMultiplier: Math.random() * 10 + 20, // 20-30
      forceDivisor: Math.random() * 50 + 80, // 80-130
      fadeSpeed: Math.random() * 10 + 25, // 25-35
      alpha: Math.floor(Math.random() * 40) + 70 // 70-110
    };
  }

  init() {
    const self = this;
    const config = this.config;
    const colors = this.getColorPalette();

    this.instance = new p5((p) => {
      p.setup = () => {
        const container = document.getElementById(self.containerId);
        const size = container.offsetWidth;
        p.createCanvas(size, size);
        
        self.particles = [];
        for (let i = 0; i < config.particleCount; i++) {
          self.particles.push(p.createVector(p.random(p.width), p.random(p.height)));
        }
      };

      p.draw = () => {
        // Always black background
        p.background(0, config.fadeSpeed);
        
        for (let particle of self.particles) {
          let dx = p.width / 2 - particle.x;
          let dy = p.height / 2 - particle.y;
          let angle = p.atan2(dy, dx);
          let distSq = dx * dx + dy * dy;
          let force = config.forceDivisor / distSq;
          
          particle.x += p.cos(angle) * force * config.forceMultiplier;
          particle.y += p.sin(angle) * force * config.forceMultiplier;
          
          if (colors) {
            p.stroke(colors.particle);
            p.strokeWeight(2);
          } else {
            p.stroke(255, config.alpha);
            p.strokeWeight(1);
          }
          
          p.point(particle.x, particle.y);
          
          if (particle.x < 0 || particle.x > p.width || particle.y < 0 || particle.y > p.height) {
            particle.x = p.random(p.width);
            particle.y = p.random(p.height);
          }
        }
      };

      p.windowResized = () => {
        const container = document.getElementById(self.containerId);
        if (container) {
          const size = container.offsetWidth;
          p.resizeCanvas(size, size);
          
          self.particles = [];
          for (let i = 0; i < config.particleCount; i++) {
            self.particles.push(p.createVector(p.random(size), p.random(size)));
          }
        }
      };
    }, this.containerId);
  }

  randomize() {
    this.colorMode = window.colorMode || false;
    this.config = this.generateConfig();
    this.particles = [];
    if (this.instance) {
      this.destroy();
      this.init();
    }
  }

  destroy() {
    if (this.instance) {
      this.instance.remove();
      this.instance = null;
    }
  }

  getCode() {
    return `let particles = [];
function setup() {
  createCanvas(400, 400);
  stroke(255, 80);
  for (let i = 0; i < 300; i++) {
    particles.push(
      createVector(random(width), random(height))
    );
  }
}
function draw() {
  background(0, 30);
  for (let p of particles) {
    let dx = width / 2 - p.x;
    let dy = height / 2 - p.y;
    let angle = atan2(dy, dx);
    let distSq = dx * dx + dy * dy;
    let force = 100 / distSq;
    p.x += cos(angle) * force * 30;
    p.y += sin(angle) * force * 30;
    point(p.x, p.y);
    if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
      p.x = random(width);
      p.y = random(height);
    }
  }
}`;
  }
}
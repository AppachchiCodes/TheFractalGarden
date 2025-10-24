// Spiral Nebula
// Original artwork - Particles flowing in logarithmic spiral arms

export class SpiralNebula {
  constructor(containerId) {
    this.containerId = containerId;
    this.instance = null;
    this.particles = [];
    this.colorMode = window.colorMode || false;
    this.config = this.generateConfig();
  }

  getColorPalette() {
    if (!this.colorMode) return null;
    return ['#FFF5E4', '#FFE3E1', '#FFD1D1', '#FF9494'];
  }

  generateConfig() {
  return {
    particleCount: 500,
    spiralArms: 4,
    spiralTightness: 0.2,
    rotationSpeed: 0.005,
    particleSpeed: 0.35,
    fadeSpeed: 30,
    alpha: 140,
    particleSize: 1.5
  };
}

generateRandomConfig() {
  return {
    particleCount: Math.floor(Math.random() * 800) + 200, 
    spiralArms: Math.floor(Math.random() * 6) + 2, 
    spiralTightness: Math.random() * 0.3 + 0.05, 
    rotationSpeed: Math.random() * 0.014 + 0.001, 
    particleSpeed: Math.random() * 0.7 + 0.1, 
    fadeSpeed: Math.random() * 45 + 15, 
    alpha: Math.floor(Math.random() * 140) + 80, 
    particleSize: Math.random() * 2.5 + 0.5 
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
          let angle = p.random(p.TWO_PI);
          let radius = p.random(10, p.width / 2);
          
          self.particles.push({
            angle: angle,
            radius: radius,
            speed: config.particleSpeed,
            arm: Math.floor(p.random(config.spiralArms))
          });
        }
      };

      p.draw = () => {
        p.background(0, config.fadeSpeed);
        p.translate(p.width / 2, p.height / 2);
        p.noStroke();
        
        for (let particle of self.particles) {
          let armOffset = (p.TWO_PI / config.spiralArms) * particle.arm;
          let spiralAngle = particle.angle + armOffset + particle.radius * config.spiralTightness;
          
          let x = particle.radius * p.cos(spiralAngle);
          let y = particle.radius * p.sin(spiralAngle);
          
          if (colors) {
            // Color gradient from center to outer
            let colorIndex = p.map(particle.radius, 0, p.width / 2, 0, colors.length - 1);
            let c = p.lerpColor(
              p.color(colors[Math.floor(colorIndex)]),
              p.color(colors[Math.min(Math.ceil(colorIndex), colors.length - 1)]),
              colorIndex % 1
            );
            p.fill(c);
          } else {
            let brightness = p.map(particle.radius, 0, p.width / 2, 255, 80);
            p.fill(brightness, config.alpha);
          }
          
          p.circle(x, y, config.particleSize);
          
          particle.radius += particle.speed;
          particle.angle += config.rotationSpeed;
          
          if (particle.radius > p.width / 2) {
            particle.radius = 10;
            particle.angle = p.random(p.TWO_PI);
          }
        }
      };

      p.windowResized = () => {
        const container = document.getElementById(self.containerId);
        if (container) {
          const size = container.offsetWidth;
          p.resizeCanvas(size, size);
        }
      };
    }, this.containerId);
  }

  randomize() {
    this.colorMode = window.colorMode || false;
    this.config = this.generateRandomConfig();
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
let spiralArms = 4;
function setup() {
  createCanvas(400, 400);
  for (let i = 0; i < 500; i++) {
    particles.push({
      angle: random(TWO_PI),
      radius: random(10, 200),
      speed: 0.3,
      arm: floor(random(spiralArms))
    });
  }
  noStroke();
}
function draw() {
  background(0, 30);
  translate(width/2, height/2);
  for (let p of particles) {
    let armOffset = (TWO_PI / spiralArms) * p.arm;
    let spiralAngle = p.angle + armOffset + p.radius * 0.2;
    let x = p.radius * cos(spiralAngle);
    let y = p.radius * sin(spiralAngle);
    let brightness = map(p.radius, 0, 200, 255, 80);
    fill(brightness, 120);
    circle(x, y, 1.5);
    p.radius += p.speed;
    p.angle += 0.005;
    if (p.radius > 200) p.radius = 10;
  }
}`;
  }
}
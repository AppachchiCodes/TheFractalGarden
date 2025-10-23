// Magnetic Particles Orbit
// Artwork module with p5.js instance mode

export class MagneticParticlesOrbit {
  constructor(containerId) {
    this.containerId = containerId;
    this.instance = null;
    this.particles = [];
    this.config = this.generateConfig();
  }

  getColorPalette() {
    if (!window.colorMode) return null;
    return ['#F08787', '#FFC7A7', '#FEE2AD', '#F8FAB4'];
  }

  generateConfig() {
    return {
      particleCount: Math.floor(Math.random() * 300) + 300, // 300-600
      noiseScale: Math.random() * 0.003 + 0.003, // 0.003-0.006
      angleMultiplier: Math.floor(Math.random() * 3) + 3, // 3-5
      fadeSpeed: Math.random() * 20 + 30, // 30-50
      alpha: Math.floor(Math.random() * 50) + 80, // 80-130
      speed: Math.random() * 0.5 + 0.5 // 0.5-1
    };
  }

  init() {
    const self = this;
    const config = this.config;

    this.instance = new p5((p) => {
      let gradientColors = null; // Pre-calculated gradient array
      let lastColorMode = false;
      const GRADIENT_STEPS = 100; // Pre-calculate 100 color steps
      
      // Function to create gradient array
      function updateColors() {
        const colorStrings = self.getColorPalette();
        if (colorStrings) {
          gradientColors = [];
          const colorObjs = colorStrings.map(c => p.color(c));
          
          // Pre-calculate gradient with GRADIENT_STEPS colors
          for (let i = 0; i < GRADIENT_STEPS; i++) {
            let t = i / (GRADIENT_STEPS - 1);
            let colorIndex = t * (colorObjs.length - 1);
            let c = p.lerpColor(
              colorObjs[Math.floor(colorIndex)],
              colorObjs[Math.min(Math.ceil(colorIndex), colorObjs.length - 1)],
              colorIndex % 1
            );
            gradientColors.push(c);
          }
        } else {
          gradientColors = null;
        }
        lastColorMode = window.colorMode;
      }
      
      p.setup = () => {
        const container = document.getElementById(self.containerId);
        const size = container.offsetWidth;
        p.createCanvas(size, size);
        
        // Initialize colors
        updateColors();
        
        self.particles = [];
        for (let i = 0; i < config.particleCount; i++) {
          self.particles.push(
            p.createVector(
              p.random(-p.width/2, p.width/2),
              p.random(-p.height/2, p.height/2)
            )
          );
        }
      };

      p.draw = () => {
        // Check if color mode changed
        if (lastColorMode !== window.colorMode) {
          updateColors();
        }
        
        p.background(0, config.fadeSpeed);
        p.translate(p.width / 2, p.height / 2);
        
        for (let particle of self.particles) {
          let angle = p.noise(particle.x * config.noiseScale, particle.y * config.noiseScale) 
                      * p.TWO_PI * config.angleMultiplier;
          particle.x += p.cos(angle) * config.speed;
          particle.y += p.sin(angle) * config.speed;
          
          if (p.dist(0, 0, particle.x, particle.y) > p.width / 2) {
            particle.x = p.random(-p.width / 2, p.width / 2);
            particle.y = p.random(-p.height / 2, p.height / 2);
          }
          
          // Use pre-calculated gradient - just index into array (FAST!)
          if (gradientColors) {
            let distFromCenter = p.dist(0, 0, particle.x, particle.y);
            let t = p.map(distFromCenter, 0, p.width / 2, 0, 1);
            let index = Math.floor(t * (gradientColors.length - 1));
            index = p.constrain(index, 0, gradientColors.length - 1);
            p.stroke(gradientColors[index]);
            p.strokeWeight(2);
          } else {
            p.stroke(255, config.alpha);
            p.strokeWeight(1);
          }
          
          p.point(particle.x, particle.y);
        }
      };

      p.windowResized = () => {
        const container = document.getElementById(self.containerId);
        if (container) {
          const size = container.offsetWidth;
          p.resizeCanvas(size, size);
          
          self.particles = [];
          for (let i = 0; i < config.particleCount; i++) {
            self.particles.push(
              p.createVector(
                p.random(-size/2, size/2),
                p.random(-size/2, size/2)
              )
            );
          }
        }
      };
    }, this.containerId);
  }

  randomize() {
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
  stroke(255, 100);
  for (let i = 0; i < 500; i++) {
    particles.push(
      createVector(random(width), random(height))
    );
  }
}
function draw() {
  background(0, 40);
  translate(width / 2, height / 2);
  for (let p of particles) {
    let angle = noise(p.x * 0.005, p.y * 0.005) * TWO_PI * 4;
    p.x += cos(angle);
    p.y += sin(angle);
    if (dist(0, 0, p.x, p.y) > width / 2) {
      p.x = random(-width / 2, width / 2);
      p.y = random(-height / 2, height / 2);
    }
    point(p.x, p.y);
  }
}`;
  }
}
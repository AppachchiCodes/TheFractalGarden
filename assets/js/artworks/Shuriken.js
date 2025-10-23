// Shuriken
// Spinning parametric motion patterns with trails

export class Shuriken {
  constructor(containerId) {
    this.containerId = containerId;
    this.instance = null;
    this.t = 0;
    this.config = this.generateConfig();
  }

  getColorPalette() {
    if (!window.colorMode) return null;
    return ['#FF6B6B', '#FF8E53', '#FFB84D', '#FFA07A'];
  }

  generateConfig() {
    return {
      a: Math.floor(Math.random() * 3) + 2, // 2-4
      b: Math.floor(Math.random() * 3) + 2, // 2-4
      particleCount: Math.floor(Math.random() * 100) + 150, // 150-250
      radius: Math.floor(Math.random() * 50) + 100, // 100-150
      particleSize: Math.random() * 2 + 2, // 2-4
      timeSpeed: Math.random() * 0.005 + 0.008, // 0.008-0.013
      alpha: Math.random() * 0.2 + 0.2 // 0.2-0.4
    };
  }

  init() {
    const self = this;
    const config = this.config;

    this.instance = new p5((p) => {
      let gradientColors = null;
      let lastColorMode = false;
      const GRADIENT_STEPS = 100;
      
      function updateColors() {
        const colorStrings = self.getColorPalette();
        if (colorStrings) {
          gradientColors = [];
          const colorObjs = colorStrings.map(c => p.color(c));
          
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
        p.background(0); // Only clear once
        p.noStroke();
        self.t = 0;
        updateColors();
      };

      p.draw = () => {
        // Check if we need to update colors or clear background
        if (lastColorMode !== window.colorMode) {
          updateColors();
          p.background(0); // Clear when switching modes
        }
        
        // Reset transformation matrix
        p.push();
        p.translate(p.width / 2, p.height / 2);
        
        for (let i = 0; i < config.particleCount; i++) {
          let x = p.sin(config.a * self.t + i / 100) * config.radius;
          let y = p.cos(config.b * self.t + i / 20) * config.radius;
          
          if (gradientColors) {
            let index = Math.floor((i / config.particleCount) * (gradientColors.length - 1));
            index = p.constrain(index, 0, gradientColors.length - 1);
            let c = gradientColors[index];
            p.fill(p.red(c), p.green(c), p.blue(c), config.alpha * 255);
          } else {
            let alpha = (i / config.particleCount) * config.alpha * 255;
            p.fill(255, alpha);
          }
          
          p.ellipse(x, y, config.particleSize, config.particleSize);
        }
        
        p.pop(); // Restore transformation
        
        self.t += config.timeSpeed;
      };

      p.windowResized = () => {
        const container = document.getElementById(self.containerId);
        if (container) {
          const size = container.offsetWidth;
          p.resizeCanvas(size, size);
          p.background(0); // Clear on resize
        }
      };
    }, this.containerId);
  }

  randomize() {
    this.config = this.generateConfig();
    this.t = 0;
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
    return `let a = 3, b = 2;
let t = 0;

function setup() {
  createCanvas(400, 400);
  background(0);
  noStroke();
}

function draw() {
  translate(width / 2, height / 2);
  for (let i = 0; i < 200; i++) {
    let x = sin(a * t + i / 100) * 150;
    let y = cos(b * t + i / 20) * 150;
    fill(255, (i / 200) * 100);
    ellipse(x, y, 3, 3);
  }
  t += 0.01;
}`;
  }
}
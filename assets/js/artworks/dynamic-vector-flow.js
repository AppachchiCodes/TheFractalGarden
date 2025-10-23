// Dynamic Vector Flow
// Flowing lines driven by Perlin noise

export class DynamicVectorFlow {
  constructor(containerId) {
    this.containerId = containerId;
    this.instance = null;
    this.t = 0;
    this.config = this.generateConfig();
  }

  getColorPalette() {
    if (!window.colorMode) return null;
    return ['#4A90E2', '#50C9CE', '#7FDBFF', '#B3E5FC'];
  }

  generateConfig() {
    return {
      lineCount: Math.floor(Math.random() * 100) + 150, // 150-250
      noiseScale: Math.random() * 0.005 + 0.01, // 0.01-0.015
      timeSpeed: Math.random() * 0.005 + 0.008, // 0.008-0.013
      fadeSpeed: Math.random() * 10 + 20, // 20-30
      alpha: Math.floor(Math.random() * 50) + 80, // 80-130
      strokeWeight: Math.random() * 0.5 + 1 // 1-1.5
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
        p.noFill();
        self.t = 0;
        updateColors();
      };

      p.draw = () => {
        if (lastColorMode !== window.colorMode) {
          updateColors();
        }
        
        p.background(0, config.fadeSpeed);
        
        for (let i = 0; i < config.lineCount; i++) {
          let x = p.width * p.noise(i * config.noiseScale, self.t);
          let y = p.height * p.noise(i * config.noiseScale + 100, self.t);
          let nx = p.width * p.noise(i * config.noiseScale, self.t + 5);
          let ny = p.height * p.noise(i * config.noiseScale + 105, self.t + 5);
          
          if (gradientColors) {
            let index = Math.floor((i / config.lineCount) * (gradientColors.length - 1));
            index = p.constrain(index, 0, gradientColors.length - 1);
            p.stroke(gradientColors[index]);
            p.strokeWeight(config.strokeWeight + 0.5);
          } else {
            let alpha = 100 + 155 * p.sin(self.t * 2 + i * 0.02);
            p.stroke(255, alpha);
            p.strokeWeight(config.strokeWeight);
          }
          
          p.line(x, y, nx, ny);
        }
        
        self.t += config.timeSpeed;
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
    return `let t = 0;

function setup() {
  createCanvas(400, 400);
  background(0);
  stroke(255, 100);
  noFill();
}

function draw() {
  background(0, 25);
  for (let i = 0; i < 200; i++) {
    let x = width * noise(i * 0.01, t);
    let y = height * noise(i * 0.01 + 100, t);
    let nx = width * noise(i * 0.01, t + 5);
    let ny = height * noise(i * 0.01 + 105, t + 5);
    stroke(100 + 155 * sin(t * 2 + i * 0.02));
    line(x, y, nx, ny);
  }
  t += 0.010;
}`;
  }
}
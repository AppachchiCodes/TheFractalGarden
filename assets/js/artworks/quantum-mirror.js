// Quantum Mirror
// Symmetrical particle explosion with mirrored coordinates

export class QuantumMirror {
  constructor(containerId) {
    this.containerId = containerId;
    this.instance = null;
    this.colorMode = window.colorMode || false;
    this.config = this.generateConfig();
  }

  getColorPalette() {
    if (!this.colorMode) return null;
    return ['#E3FDFD', '#CBF1F5', '#A6E3E9', '#71C9CE'];
  }

  generateConfig() {
    return {
      particleCount: Math.floor(Math.random() * 100) + 150, // 150-250
      maxRadius: Math.floor(Math.random() * 50) + 150, // 150-200
      rotationSpeed: Math.random() * 0.005 + 0.008, // 0.008-0.013
      particleSize: Math.random() * 1.5 + 1.5, // 1.5-3
      fadeSpeed: Math.random() * 0.1 + 0.15, // 0.15-0.25
      alpha: Math.floor(Math.random() * 100) + 150 // 150-250
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
        p.noStroke();
      };

      p.draw = () => {
        p.background(0, config.fadeSpeed * 255);
        p.translate(p.width / 2, p.height / 2);
        
        for (let i = 0; i < config.particleCount; i++) {
          let angle = p.random(p.TWO_PI);
          let r = p.random(config.maxRadius);
          let x = r * p.cos(angle + p.frameCount * config.rotationSpeed);
          let y = r * p.sin(angle + p.frameCount * config.rotationSpeed);
          
          if (colors) {
            // Color gradient from outer to inner
            let colorIndex = p.map(r, 0, config.maxRadius, 0, colors.length - 1);
            let c = p.lerpColor(
              p.color(colors[Math.floor(colorIndex)]),
              p.color(colors[Math.min(Math.ceil(colorIndex), colors.length - 1)]),
              colorIndex % 1
            );
            p.fill(c);
          } else {
            let brightness = p.map(r, 0, config.maxRadius, 255, 100);
            p.fill(brightness, config.alpha);
          }
          
          p.ellipse(x, y, config.particleSize, config.particleSize);
          p.ellipse(-x, y, config.particleSize, config.particleSize);
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
    this.config = this.generateConfig();
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
    return `function setup() {
  createCanvas(400, 400);
  noStroke();
}
function draw() {
  translate(width/2, height/2);
  background(0, 50);
  for (let i = 0; i < 200; i++) {
    let angle = random(TWO_PI);
    let r = random(200);
    let x = r * cos(angle + frameCount * 0.01);
    let y = r * sin(angle + frameCount * 0.01);
    let brightness = map(r, 0, 200, 255, 100);
    fill(brightness, 150);
    ellipse(x, y, 2, 2);
    ellipse(-x, y, 2, 2);
  }
}`;
  }
}
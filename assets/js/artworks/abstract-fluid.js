// Abstract Fluid

export class AbstractFluid {
  constructor(containerId) {
    this.containerId = containerId;
    this.instance = null;
    this.t = 0;
    this.colorMode = window.colorMode || false;
    this.config = this.generateConfig();
  }

  getColorPalette() {
    if (!this.colorMode) return null;
    return ['#FFFFD0', '#F3CCFF', '#D09CFA', '#A555EC'];
  }

  generateConfig() {
    return {
      gridSpacing: Math.floor(Math.random() * 10) + 10, // 10-19
      noiseScale: Math.random() * 0.015 + 0.005, // 0.005-0.02
      timeSpeed: Math.random() * 0.015 + 0.005, // 0.005-0.02
      angleMultiplier: Math.floor(Math.random() * 2) + 1, // 1-2
      lineLength: Math.random() * 5 + 8, // 8-13
      alpha: Math.floor(Math.random() * 50) + 80 // 80-130
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
        p.noFill();
        self.t = 0;
      };

      p.draw = () => {
      let lineLength = config.lineLength;
      let angleMultiplier = config.angleMultiplier;
      let timeSpeed = config.timeSpeed;
      
      if (window.audioController && window.audioController.isActive()) {
        const audio = window.audioController.getAudioData();
        
        lineLength = config.lineLength * (1 + audio.bass * 1.2);
        angleMultiplier = config.angleMultiplier * (1 + audio.mid * 0.8);
        timeSpeed = config.timeSpeed * (1 + audio.treble * 2);
      }
      
      p.background(0);
      
      for (let x = 0; x < p.width; x += config.gridSpacing) {
        for (let y = 0; y < p.height; y += config.gridSpacing) {
          let angle = p.noise(x * config.noiseScale, y * config.noiseScale, self.t) * p.TWO_PI * angleMultiplier;
          let x2 = x + p.cos(angle) * lineLength;
          let y2 = y + p.sin(angle) * lineLength;
          
          if (colors) {
            let colorIndex = p.map(y, 0, p.height, 0, colors.length - 1);
            let c = p.lerpColor(
              p.color(colors[Math.floor(colorIndex)]),
              p.color(colors[Math.ceil(colorIndex)]),
              colorIndex % 1
            );
            p.stroke(c);
            p.strokeWeight(1.5);
          } else {
            p.stroke(255, config.alpha);
            p.strokeWeight(1);
          }
          
          p.line(x, y, x2, y2);
        }
      }
      
      self.t += timeSpeed;
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
  stroke(255, 100);
  noFill();
}
function draw() {
  background(0);
  for (let x = 0; x < width; x += 15) {
    for (let y = 0; y < height; y += 15) {
      let angle = noise(x * 0.01, y * 0.01, t) * TWO_PI * 2;
      let x2 = x + cos(angle) * 10;
      let y2 = y + sin(angle) * 10;
      line(x, y, x2, y2);
    }
  }
  t += 0.01;
}`;
  }
}
// Breathing Mandala
// Original artwork - Pulsing geometric shapes radiating from center

export class BreathingMandala {
  constructor(containerId) {
    this.containerId = containerId;
    this.instance = null;
    this.t = 0;
    this.config = this.generateConfig();
  }

  getColorPalette() {
    if (!window.colorMode) return null;
    return ['#364F6B', '#3FC1C9', '#F5F5F5', '#FC5185'];
  }

  generateConfig() {
  return {
    layers: Math.floor(Math.random() * 12) + 3, 
    sides: Math.floor(Math.random() * 9) + 3, 
    breathSpeed: Math.random() * 0.05 + 0.01, 
    minSize: Math.floor(Math.random() * 30) + 20, 
    maxSize: Math.floor(Math.random() * 80) + 60, 
    rotationSpeed: Math.random() * 0.008 + 0.001, 
    alpha: Math.floor(Math.random() * 120) + 80 
  };
}

  init() {
    const self = this;
    const config = this.config;

    this.instance = new p5((p) => {
      let colorObjects = null; // Store p5 color objects here
      
      p.setup = () => {
        const container = document.getElementById(self.containerId);
        const size = container.offsetWidth;
        p.createCanvas(size, size);
        p.noFill();
        p.strokeWeight(1);
        self.t = 0;
        
        // Pre-convert color strings to p5 color objects ONCE
        const colorStrings = self.getColorPalette();
        if (colorStrings) {
          colorObjects = colorStrings.map(c => p.color(c));
        }
      };

      p.draw = () => {
        let breathSpeed = config.breathSpeed;
        let rotationSpeed = config.rotationSpeed;
        let minSize = config.minSize;
        let maxSize = config.maxSize;
        
        if (window.audioController && window.audioController.isActive()) {
          const audio = window.audioController.getAudioData();
          
          breathSpeed = config.breathSpeed * (1 + audio.mid * 1.5);
          rotationSpeed = config.rotationSpeed * (1 + audio.treble * 2);
          minSize = config.minSize * (1 + audio.bass * 0.8);
          maxSize = config.maxSize * (1 + audio.bass * 0.8);
        }
        
        p.background(0);
        p.translate(p.width / 2, p.height / 2);
        
        let breath = p.sin(self.t) * 0.5 + 0.5;
        
        for (let layer = 0; layer < config.layers; layer++) {
          let size = p.map(layer, 0, config.layers, minSize, maxSize);
          let breathSize = size * (1 + breath * 0.3);
          
          let rotation = self.t * rotationSpeed * (layer % 2 === 0 ? 1 : -1);
          
          if (colorObjects) {
            let colorIndex = p.map(layer, 0, config.layers - 1, 0, colorObjects.length - 1);
            let c = p.lerpColor(
              colorObjects[Math.floor(colorIndex)],
              colorObjects[Math.min(Math.ceil(colorIndex), colorObjects.length - 1)],
              colorIndex % 1
            );
            p.stroke(c);
            p.strokeWeight(2);
          } else {
            p.stroke(255, config.alpha);
            p.strokeWeight(1);
          }
          
          p.push();
          p.rotate(rotation);
          
          p.beginShape();
          for (let i = 0; i < config.sides; i++) {
            let angle = p.TWO_PI / config.sides * i;
            let x = breathSize * p.cos(angle);
            let y = breathSize * p.sin(angle);
            p.vertex(x, y);
          }
          p.endShape(p.CLOSE);
          
          if (layer < config.layers - 1 && colorObjects) {
            let nextSize = p.map(layer + 1, 0, config.layers, minSize, maxSize);
            let nextBreathSize = nextSize * (1 + breath * 0.3);
            
            let colorIndex = p.map(layer, 0, config.layers - 1, 0, colorObjects.length - 1);
            let currentColor = p.lerpColor(
              colorObjects[Math.floor(colorIndex)],
              colorObjects[Math.min(Math.ceil(colorIndex), colorObjects.length - 1)],
              colorIndex % 1
            );
            p.stroke(p.red(currentColor), p.green(currentColor), p.blue(currentColor), config.alpha * 0.3);
            
            for (let i = 0; i < config.sides; i++) {
              let angle = p.TWO_PI / config.sides * i;
              let x1 = breathSize * p.cos(angle);
              let y1 = breathSize * p.sin(angle);
              let x2 = nextBreathSize * p.cos(angle);
              let y2 = nextBreathSize * p.sin(angle);
              
              p.line(x1, y1, x2, y2);
            }
          } else if (layer < config.layers - 1) {
            p.stroke(255, config.alpha * 0.3);
            let nextSize = p.map(layer + 1, 0, config.layers, minSize, maxSize);
            let nextBreathSize = nextSize * (1 + breath * 0.3);
            
            for (let i = 0; i < config.sides; i++) {
              let angle = p.TWO_PI / config.sides * i;
              let x1 = breathSize * p.cos(angle);
              let y1 = breathSize * p.sin(angle);
              let x2 = nextBreathSize * p.cos(angle);
              let y2 = nextBreathSize * p.sin(angle);
              
              p.line(x1, y1, x2, y2);
            }
          }
          
          p.pop();
        }
        
        self.t += breathSpeed;
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
  stroke(255, 150);
  noFill();
}
function draw() {
  background(0);
  translate(width/2, height/2);
  let breath = sin(t) * 0.5 + 0.5;
  for (let layer = 0; layer < 8; layer++) {
    let size = map(layer, 0, 8, 40, 100);
    let breathSize = size * (1 + breath * 0.3);
    let rotation = t * 0.003 * (layer % 2 === 0 ? 1 : -1);
    push();
    rotate(rotation);
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI / 6 * i;
      let x = breathSize * cos(angle);
      let y = breathSize * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
  }
  t += 0.02;
}`;
  }
}
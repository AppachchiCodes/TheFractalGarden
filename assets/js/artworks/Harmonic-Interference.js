// Harmonic Interference
// Wave interference creating moiré patterns

export class HarmonicInterference {
  constructor(containerId) {
    this.containerId = containerId;
    this.instance = null;
    this.t = 0;
    this.config = this.generateConfig();
  }

  getColorPalette() {
    if (!window.colorMode) return null;
    return ['#667EEA', '#764BA2', '#F093FB', '#4FACFE'];
  }

      generateConfig() {
      return {
        rings: 7,
        baseRadius: 20,
        radiusSpacing: 20,
        waveAmplitude: 100,
        waveFrequency: 5,
        timeSpeed: 0.02,
        strokeAlpha: 150,
        strokeWeight: 1.2
      };
    }
    generateRandomConfig() {
      
      return {
        rings: Math.floor(Math.random() * 12) + 3, 
        baseRadius: Math.floor(Math.random() * 30) + 10, 
        radiusSpacing: Math.floor(Math.random() * 25) + 10, 
        waveAmplitude: Math.floor(Math.random() * 250) + 50, 
        waveFrequency: Math.floor(Math.random() * 18) + 2, 
        timeSpeed: Math.random() * 0.04 + 0.01, 
        strokeAlpha: Math.floor(Math.random() * 100) + 80, 
        strokeWeight: Math.random() * 1.5 + 0.5 
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
        
        p.background(0, 30);
        p.translate(p.width / 2, p.height / 2);
        
        for (let i = 0; i < config.rings; i++) {
          let radius = config.baseRadius + i * config.radiusSpacing;
          let wave = p.sin(self.t + i * 0.1) * config.waveAmplitude;
          
          if (gradientColors) {
            let index = Math.floor((i / config.rings) * (gradientColors.length - 1));
            index = p.constrain(index, 0, gradientColors.length - 1);
            p.stroke(gradientColors[index]);
            p.strokeWeight(config.strokeWeight + 0.5);
          } else {
            p.stroke(255, config.strokeAlpha);
            p.strokeWeight(config.strokeWeight);
          }
          
          p.beginShape();
          for (let a = 0; a < p.TWO_PI; a += 0.1) {
            let r = radius + wave * p.sin(a * config.waveFrequency + self.t);
            let x = r * p.cos(a);
            let y = r * p.sin(a);
            p.vertex(x, y);
          }
          p.endShape(p.CLOSE);
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
    this.config = this.generateRandomConfig();
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
  background(0, 30);
  translate(width / 2, height / 2);
  
  for (let i = 0; i < 8; i++) {
    let radius = 20 + i * 20;
    let wave = sin(t + i * 0.1) * 100;
    
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.1) {
      let r = radius + wave * sin(a * 5 + t);
      let x = r * cos(a);
      let y = r * sin(a);
      vertex(x, y);
    }
    endShape(CLOSE);
  }
  
  t += 0.02;
}`;
  }
}
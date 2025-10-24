// Morphing Hexagrid
// Hexagonal grid that breathes and rotates

export class MorphingHexagrid {
  constructor(containerId) {
    this.containerId = containerId;
    this.instance = null;
    this.t = 0;
    this.config = this.generateConfig();
  }

  getColorPalette() {
    if (!window.colorMode) return null;
    return ['#11998E', '#38EF7D', '#00F260', '#0575E6'];
  }

  generateConfig() {
  return {
    cols: Math.floor(Math.random() * 6) + 5, 
    rows: Math.floor(Math.random() * 6) + 5, 
    spacing: Math.floor(Math.random() * 28) + 12, 
    baseSize: Math.floor(Math.random() * 15) + 8, 
    sizeAmplitude: Math.floor(Math.random() * 25) + 5, 
    timeSpeed: Math.random() * 0.04 + 0.01, 
    strokeAlpha: Math.floor(Math.random() * 100) + 130, 
    strokeWeight: Math.random() * 1.0 + 0.5 
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
      
      function hexagon(size) {
        p.beginShape();
        for (let i = 0; i < 6; i++) {
          let angle = p.TWO_PI / 6 * i;
          let x = size * p.cos(angle);
          let y = size * p.sin(angle);
          p.vertex(x, y);
        }
        p.endShape(p.CLOSE);
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
        
        p.background(0);
        p.translate(p.width / 2, p.height / 2);
        
        for (let i = -config.cols; i < config.cols; i++) {
          for (let j = -config.rows; j < config.rows; j++) {
            p.push();
            let x = i * config.spacing + (j % 2) * config.spacing / 2;
            let y = j * config.spacing * 0.866;
            p.translate(x, y);
            
            let dist = p.sqrt(x * x + y * y);
            let size = config.baseSize + p.sin(self.t + dist * 0.05) * config.sizeAmplitude;
            let rot = self.t + dist * 0.01;
            p.rotate(rot);
            
            if (gradientColors) {
              let t = p.map(dist, 0, p.width / 2, 0, 1);
              let index = Math.floor(t * (gradientColors.length - 1));
              index = p.constrain(index, 0, gradientColors.length - 1);
              p.stroke(gradientColors[index]);
              p.strokeWeight(config.strokeWeight + 0.5);
            } else {
              p.stroke(255, config.strokeAlpha);
              p.strokeWeight(config.strokeWeight);
            }
            
            hexagon(size);
            p.pop();
          }
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
  stroke(255, 200);
  noFill();
}

function draw() {
  background(0);
  translate(width / 2, height / 2);
  
  let cols = 8;
  let rows = 8;
  let spacing = 20;
  
  for (let i = -cols; i < cols; i++) {
    for (let j = -rows; j < rows; j++) {
      push();
      let x = i * spacing + (j % 2) * spacing / 2;
      let y = j * spacing * 0.866;
      translate(x, y);
      
      let dist = sqrt(x * x + y * y);
      let size = 15 + sin(t + dist * 0.05) * 10;
      let rot = t + dist * 0.01;
      rotate(rot);
      
      hexagon(size);
      pop();
    }
  }
  
  t += 0.02;
}

function hexagon(size) {
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI / 6 * i;
    let x = size * cos(angle);
    let y = size * sin(angle);
    vertex(x, y);
  }
  endShape(CLOSE);
}`;
  }
}
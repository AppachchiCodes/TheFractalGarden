// Ocean Currents
// Flowing wave-like lines using Perlin noise

export class OceanCurrents {
  constructor(containerId) {
    this.containerId = containerId;
    this.instance = null;
    this.zoff = 0;
    this.colorMode = window.colorMode || false;
    this.config = this.generateConfig();
  }

  getColorPalette() {
    if (!this.colorMode) return null;
    return ['#F38181', '#FCE38A', '#EAFFD0', '#95E1D3'];
  }

  generateConfig() {
    return {
      scale: Math.floor(Math.random() * 10) + 15, // 15-24
      noiseScale: Math.random() * 0.05 + 0.08, // 0.08-0.13
      zIncrement: Math.random() * 0.005 + 0.008, // 0.008-0.013
      waveAmplitude: Math.random() * 5 + 8, // 8-13
      angleMultiplier: Math.floor(Math.random() * 3) + 3, // 3-5
      fadeSpeed: Math.random() * 5 + 8, // 8-13
      alpha: Math.floor(Math.random() * 60) + 60 // 60-120
    };
  }

  init() {
    const self = this;
    const config = this.config;
    const colors = this.getColorPalette();

    this.instance = new p5((p) => {
      let cols, rows;

      p.setup = () => {
        const container = document.getElementById(self.containerId);
        const size = container.offsetWidth;
        p.createCanvas(size, size);
        
        cols = Math.floor(p.width / config.scale);
        rows = Math.floor(p.height / config.scale);
        
        p.noFill();
        
        self.zoff = 0;
      };

      p.draw = () => {
  let waveAmplitude = config.waveAmplitude;
  let angleMultiplier = config.angleMultiplier;
  let zIncrement = config.zIncrement;
  let fadeSpeed = config.fadeSpeed;
  
  if (window.audioController && window.audioController.isActive()) {
    const audio = window.audioController.getAudioData();
    
    waveAmplitude = config.waveAmplitude * (1 + audio.bass * 2);
    angleMultiplier = config.angleMultiplier * (1 + audio.mid * 0.8);
    zIncrement = config.zIncrement * (1 + audio.treble * 1.5);
  }
  
  p.background(0, fadeSpeed);
  
  let yoff = 0;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    
    if (colors) {
      let colorIndex = p.map(y, 0, rows, 0, colors.length - 1);
      let c = p.lerpColor(
        p.color(colors[Math.floor(colorIndex)]),
        p.color(colors[Math.min(Math.ceil(colorIndex), colors.length - 1)]),
        colorIndex % 1
      );
      p.stroke(c);
      p.strokeWeight(2);
    } else {
      p.stroke(255, config.alpha);
      p.strokeWeight(1);
    }
    
    p.beginShape();
    
    for (let x = 0; x <= cols; x++) {
      let angle = p.noise(xoff, yoff, self.zoff) * p.TWO_PI * angleMultiplier;
      let wave = p.sin(angle) * waveAmplitude;
      
      let xx = x * config.scale;
      let yy = y * config.scale + wave;
      
      p.vertex(xx, yy);
      xoff += config.noiseScale;
    }
    
    p.endShape();
    yoff += config.noiseScale;
  }
  
  self.zoff += zIncrement;
};

      p.windowResized = () => {
        const container = document.getElementById(self.containerId);
        if (container) {
          const size = container.offsetWidth;
          p.resizeCanvas(size, size);
          cols = Math.floor(size / config.scale);
          rows = Math.floor(size / config.scale);
        }
      };
    }, this.containerId);
  }

  randomize() {
    this.colorMode = window.colorMode || false;
    this.config = this.generateConfig();
    this.zoff = 0;
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
    return `let cols, rows;
let scl = 20;
let zoff = 0;
function setup() {
  createCanvas(400, 400);
  cols = floor(width / scl);
  rows = floor(height / scl);
  stroke(255, 80);
  noFill();
}
function draw() {
  background(0, 10);
  let yoff = 0;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    beginShape();
    for (let x = 0; x <= cols; x++) {
      let angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
      let wave = sin(angle) * 10;
      let xx = x * scl;
      let yy = y * scl + wave;
      vertex(xx, yy);
      xoff += 0.1;
    }
    endShape();
    yoff += 0.1;
  }
  zoff += 0.01;
}`;
  }
}
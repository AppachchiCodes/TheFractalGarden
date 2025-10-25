// Digital DNA Helix
// Artwork module with p5.js instance mode

export class DigitalDnaHelix {
  constructor(containerId) {
    this.containerId = containerId;
    this.instance = null;
    this.t = 0;
    this.colorMode = window.colorMode || false;
    this.config = this.generateConfig();
  }

  getColorPalette() {
    if (!this.colorMode) return null;
    return ['#96A78D', '#B6CEB4', '#D9E9CF', '#F0F0F0'];
  }

  generateConfig() {
    return {
      waveSpeed: Math.random() * 0.03 + 0.03, // 0.03-0.06
      amplitude: Math.floor(Math.random() * 40) + 60, // 60-100
      lineSpacing: Math.floor(Math.random() * 4) + 6, // 6-9
      timeIncrement: Math.random() * 1 + 1.5, // 1.5-2.5
      circleSize: Math.random() * 2 + 2, // 2-4
      alpha: Math.floor(Math.random() * 100) + 200 // 200-300
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
        let amplitude = config.amplitude;
        let waveSpeed = config.waveSpeed;
        let timeIncrement = config.timeIncrement;
        
        if (window.audioController && window.audioController.isActive()) {
          const audio = window.audioController.getAudioData();
          
          amplitude = config.amplitude * (1 + audio.bass * 1.5);
          waveSpeed = config.waveSpeed * (1 + audio.mid * 0.8);
          timeIncrement = config.timeIncrement * (1 + audio.treble * 2);
        }
        
        p.background(0);
        p.translate(p.width / 2, p.height / 2);
        
        for (let i = -180; i < 180; i += config.lineSpacing) {
          let x1 = p.sin((i + self.t) * waveSpeed) * amplitude;
          let x2 = -x1;
          let y = i;
          
          if (colors) {
            let colorIndex = p.map(Math.abs(i), 0, 180, 0, colors.length - 1);
            let c = p.lerpColor(
              p.color(colors[Math.floor(colorIndex)]),
              p.color(colors[Math.min(Math.ceil(colorIndex), colors.length - 1)]),
              colorIndex % 1
            );
            p.stroke(c);
            p.strokeWeight(1.5);
            p.fill(c);
          } else {
            p.stroke(255, config.alpha);
            p.strokeWeight(1);
            p.noFill();
          }
          
          p.line(x1, y, x2, y);
          if (colors) {
            p.circle(x1, y, config.circleSize);
            p.circle(x2, y, config.circleSize);
          } else {
            p.noFill();
            p.circle(x1, y, config.circleSize);
            p.circle(x2, y, config.circleSize);
          }
        }
        
        self.t += timeIncrement;
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
  stroke(255);
  noFill();
}
function draw() {
  background(0);
  translate(width / 2, height / 2);
  for (let i = -180; i < 180; i += 8) {
    let x1 = sin((i + t) * 0.05) * 80;
    let x2 = -x1;
    let y = i;
    line(x1, y, x2, y);
    circle(x1, y, 3);
    circle(x2, y, 3);
  }
  t += 2;
}`;
  }
}
// Recursive Echoes
// Original artwork - Concentric waves emanating and fading outward

export class RecursiveEchoes {
  constructor(containerId) {
    this.containerId = containerId;
    this.instance = null;
    this.waves = [];
    this.colorMode = window.colorMode || false;
    this.config = this.generateConfig();
  }

  getColorPalette() {
    if (!this.colorMode) return null;
    return ['#BAD7DF', '#FFE2E2', '#F6F6F6', '#99DDCC'];
  }

  generateConfig() {
    return {
      spawnInterval: Math.floor(Math.random() * 20) + 20, // 20-40 frames
      maxWaves: Math.floor(Math.random() * 5) + 8, // 8-12 waves
      waveSpeed: Math.random() * 1 + 1.5, // 1.5-2.5
      strokeWeight: Math.random() * 1.5 + 1, // 1-2.5
      fadeSpeed: Math.random() * 3 + 2, // 2-5
      maxRadius: 0, // Will be set based on canvas size
      rippleCount: Math.floor(Math.random() * 2) + 3, // 3-4 ripples per wave
      rippleSpacing: Math.floor(Math.random() * 10) + 15 // 15-24
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
        p.strokeWeight(config.strokeWeight);
        
        config.maxRadius = p.width * 0.7;
        self.waves = [];
      };

      p.draw = () => {
        p.background(0, config.fadeSpeed);
        p.translate(p.width / 2, p.height / 2);
        
        if (p.frameCount % config.spawnInterval === 0 && self.waves.length < config.maxWaves) {
          self.waves.push({
            radius: 0,
            alpha: 255
          });
        }
        
        for (let i = self.waves.length - 1; i >= 0; i--) {
          let wave = self.waves[i];
          
          for (let r = 0; r < config.rippleCount; r++) {
            let rippleRadius = wave.radius - (r * config.rippleSpacing);
            if (rippleRadius > 0) {
              let rippleAlpha = wave.alpha * (1 - r / config.rippleCount);
              
              if (colors) {
                // Color gradient based on radius
                let colorIndex = p.map(rippleRadius, 0, config.maxRadius, 0, colors.length - 1);
                let c = p.lerpColor(
                  p.color(colors[Math.floor(colorIndex)]),
                  p.color(colors[Math.min(Math.ceil(colorIndex), colors.length - 1)]),
                  colorIndex % 1
                );
                p.stroke(p.red(c), p.green(c), p.blue(c), rippleAlpha);
                p.strokeWeight(config.strokeWeight + 1);
              } else {
                p.stroke(255, rippleAlpha);
                p.strokeWeight(config.strokeWeight);
              }
              
              p.circle(0, 0, rippleRadius * 2);
            }
          }
          
          wave.radius += config.waveSpeed;
          wave.alpha = p.map(wave.radius, 0, config.maxRadius, 255, 0);
          
          if (wave.radius > config.maxRadius) {
            self.waves.splice(i, 1);
          }
        }
      };

      p.windowResized = () => {
        const container = document.getElementById(self.containerId);
        if (container) {
          const size = container.offsetWidth;
          p.resizeCanvas(size, size);
          config.maxRadius = size * 0.7;
        }
      };
    }, this.containerId);
  }

  randomize() {
    this.colorMode = window.colorMode || false;
    this.config = this.generateConfig();
    this.waves = [];
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
    return `let waves = [];
function setup() {
  createCanvas(400, 400);
  noFill();
  strokeWeight(1.5);
}
function draw() {
  background(0, 3);
  translate(width/2, height/2);
  
  if (frameCount % 30 === 0 && waves.length < 10) {
    waves.push({ radius: 0, alpha: 255 });
  }
  
  for (let i = waves.length - 1; i >= 0; i--) {
    let wave = waves[i];
    
    for (let r = 0; r < 3; r++) {
      let rippleRadius = wave.radius - (r * 20);
      if (rippleRadius > 0) {
        let rippleAlpha = wave.alpha * (1 - r / 3);
        stroke(255, rippleAlpha);
        circle(0, 0, rippleRadius * 2);
      }
    }
    
    wave.radius += 2;
    wave.alpha = map(wave.radius, 0, 280, 255, 0);
    
    if (wave.radius > 280) {
      waves.splice(i, 1);
    }
  }
}`;
  }
}
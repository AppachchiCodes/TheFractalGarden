// Falling Star Trails
// Artwork module with p5.js instance mode

export class FallingStarTrails {
  constructor(containerId) {
    this.containerId = containerId;
    this.instance = null;
    this.stars = [];
    this.colorMode = window.colorMode || false;
    this.config = this.generateConfig();
  }

  getColorPalette() {
    if (!this.colorMode) return null;
    return {
      background: '#000000ff',
      star: '#B6F500'
    };
  }

  generateConfig() {
    return {
      spawnInterval: Math.floor(Math.random() * 2) + 2, // 2-3 frames
      minSpeed: Math.random() * 1 + 1.5, // 1.5-2.5
      maxSpeed: Math.random() * 2 + 4, // 4-6
      trailLength: Math.floor(Math.random() * 5) + 8, // 8-12
      alpha: Math.random() * 50 + 200, // 200-250
      fadeSpeed: Math.random() * 20 + 30 // 30-50
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
        self.stars = [];
      };

      p.draw = () => {
        if (colors) {
          p.background(colors.background);
        } else {
          p.background(0, config.fadeSpeed);
        }
        
        if (p.frameCount % config.spawnInterval === 0) {
          self.stars.push({
            x: p.random(p.width),
            y: 0,
            speed: p.random(config.minSpeed, config.maxSpeed)
          });
        }

        for (let s of self.stars) {
          if (colors) {
            p.stroke(colors.star);
            p.strokeWeight(2);
          } else {
            p.stroke(255, config.alpha);
            p.strokeWeight(1);
          }
          p.line(s.x, s.y, s.x, s.y + config.trailLength);
          s.y += s.speed;
        }

        self.stars = self.stars.filter(s => s.y < p.height);
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
    this.stars = [];
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
    return `let stars = [];
function setup() {
  createCanvas(400, 400);
  stroke(255);
}
function draw() {
  background(0, 50);
  if (frameCount % 3 == 0) {
    stars.push({
      x: random(width), 
      y: 0, 
      speed: random(2, 6)
    });
  }
  for (let s of stars) {
    line(s.x, s.y, s.x, s.y + 10);
    s.y += s.speed;
  }
  stars = stars.filter(s => s.y < height);
}`;
  }
}
// Neural Pulse Grid
// Network of connected nodes with dynamic movement

export class NeuralPulseGrid {
  constructor(containerId) {
    this.containerId = containerId;
    this.instance = null;
    this.nodes = [];
    this.config = this.generateConfig();
  }

  getColorPalette() {
    if (!window.colorMode) return null;
    return ['#A3DC9A', '#DEE791', '#FFF9BD', '#FFD6BA'];
  }

  generateConfig() {
  return {
    nodeCount: 80,
    nodeSpeed: 0.75,
    minRadius: 3,
    maxRadius: 5,
    connectionDistance: 90,
    fadeSpeed: 50,
    nodeAlpha: 200,
    lineAlpha: 55
  };
}
generateRandomConfig() {
  return {
    nodeCount: Math.floor(Math.random() * 120) + 30, 
    nodeSpeed: Math.random() * 1.7 + 0.3, 
    minRadius: Math.random() * 3 + 1, 
    maxRadius: Math.random() * 7 + 3, 
    connectionDistance: Math.random() * 150 + 50, 
    fadeSpeed: Math.random() * 60 + 20, 
    nodeAlpha: Math.floor(Math.random() * 155) + 100, 
    lineAlpha: Math.floor(Math.random() * 80) + 20 
  };
}

  init() {
    const self = this;
    const config = this.config;

    this.instance = new p5((p) => {
      let gradientColors = null; // Pre-calculated gradient array
      let lastColorMode = false;
      const GRADIENT_STEPS = 100; // Pre-calculate 100 color steps
      
      // Function to create gradient array
      function updateColors() {
        const colorStrings = self.getColorPalette();
        if (colorStrings) {
          gradientColors = [];
          const colorObjs = colorStrings.map(c => p.color(c));
          
          // Pre-calculate gradient with GRADIENT_STEPS colors
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
        
        // Initialize colors
        updateColors();
        
        self.nodes = [];
        for (let i = 0; i < config.nodeCount; i++) {
          self.nodes.push({
            x: p.random(p.width),
            y: p.random(p.height),
            r: p.random(config.minRadius, config.maxRadius),
            dx: p.random(-config.nodeSpeed, config.nodeSpeed),
            dy: p.random(-config.nodeSpeed, config.nodeSpeed)
          });
        }
      };

      p.draw = () => {
        if (lastColorMode !== window.colorMode) {
          updateColors();
        }
        
        let nodeSpeed = config.nodeSpeed;
        let connectionDistance = config.connectionDistance;
        let fadeSpeed = config.fadeSpeed;
        
        if (window.audioController && window.audioController.isActive()) {
          const audio = window.audioController.getAudioData();
          
          nodeSpeed = config.nodeSpeed * (1 + audio.mid * 1.5);
          connectionDistance = config.connectionDistance * (1 + audio.bass * 0.8);
          fadeSpeed = config.fadeSpeed * (1 + audio.treble * 0.5);
        }
        
        p.background(0, fadeSpeed);
        
        for (let i = 0; i < self.nodes.length; i++) {
          let n = self.nodes[i];
          
          n.x += n.dx * (nodeSpeed / config.nodeSpeed);
          n.y += n.dy * (nodeSpeed / config.nodeSpeed);
          
          if (n.x < 0 || n.x > p.width) n.dx *= -1;
          if (n.y < 0 || n.y > p.height) n.dy *= -1;
          
          for (let j = i + 1; j < self.nodes.length; j++) {
            let m = self.nodes[j];
            let d = p.dist(n.x, n.y, m.x, m.y);
            
            if (d < connectionDistance) {
              let alpha = p.map(d, 0, connectionDistance, config.lineAlpha, 0);
              
              if (gradientColors) {
                let t = p.map(n.y, 0, p.height, 0, 1);
                let index = Math.floor(t * (gradientColors.length - 1));
                index = p.constrain(index, 0, gradientColors.length - 1);
                let c = gradientColors[index];
                p.stroke(p.red(c), p.green(c), p.blue(c), alpha);
                p.strokeWeight(1.5);
              } else {
                p.stroke(255, alpha);
                p.strokeWeight(1);
              }
              
              p.line(n.x, n.y, m.x, m.y);
            }
          }
        }
        
        p.noStroke();
        for (let n of self.nodes) {
          if (gradientColors) {
            let t = p.map(n.y, 0, p.height, 0, 1);
            let index = Math.floor(t * (gradientColors.length - 1));
            index = p.constrain(index, 0, gradientColors.length - 1);
            p.fill(gradientColors[index]);
          } else {
            p.fill(255, config.nodeAlpha);
          }
          p.circle(n.x, n.y, n.r);
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
    this.config = this.generateRandomConfig();
    this.nodes = [];
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
    return `let nodes = [];
function setup() {
  createCanvas(400, 400);
  for (let i = 0; i < 80; i++) {
    nodes.push({
      x: random(width),
      y: random(height),
      r: random(2, 5),
      dx: random(-1, 1),
      dy: random(-1, 1),
    });
  }
  stroke(255, 50);
  noFill();
}
function draw() {
  background(0, 50);
  for (let i = 0; i < nodes.length; i++) {
    let n = nodes[i];
    n.x += n.dx;
    n.y += n.dy;
    if (n.x < 0 || n.x > width) n.dx *= -1;
    if (n.y < 0 || n.y > height) n.dy *= -1;
    for (let j = i + 1; j < nodes.length; j++) {
      let m = nodes[j];
      let d = dist(n.x, n.y, m.x, m.y);
      if (d < 80) {
        stroke(255, map(d, 0, 80, 255, 0));
        line(n.x, n.y, m.x, m.y);
      }
    }
    fill(255);
    noStroke();
    circle(n.x, n.y, n.r);
  }
}`;
  }
}
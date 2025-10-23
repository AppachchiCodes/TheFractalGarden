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
      nodeCount: Math.floor(Math.random() * 40) + 60, // 60-100
      nodeSpeed: Math.random() * 0.5 + 0.5, // 0.5-1
      minRadius: Math.random() * 2 + 2, // 2-4
      maxRadius: Math.random() * 3 + 4, // 4-7
      connectionDistance: Math.random() * 40 + 70, // 70-110
      fadeSpeed: Math.random() * 20 + 40, // 40-60
      nodeAlpha: Math.floor(Math.random() * 100) + 150, // 150-250
      lineAlpha: Math.floor(Math.random() * 50) + 30 // 30-80
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
        // Check if color mode changed
        if (lastColorMode !== window.colorMode) {
          updateColors();
        }
        
        p.background(0, config.fadeSpeed);
        
        // Draw connections
        for (let i = 0; i < self.nodes.length; i++) {
          let n = self.nodes[i];
          
          n.x += n.dx;
          n.y += n.dy;
          
          if (n.x < 0 || n.x > p.width) n.dx *= -1;
          if (n.y < 0 || n.y > p.height) n.dy *= -1;
          
          for (let j = i + 1; j < self.nodes.length; j++) {
            let m = self.nodes[j];
            let d = p.dist(n.x, n.y, m.x, m.y);
            
            if (d < config.connectionDistance) {
              let alpha = p.map(d, 0, config.connectionDistance, config.lineAlpha, 0);
              
              if (gradientColors) {
                // Use pre-calculated gradient - just index into array (FAST!)
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
        
        // Draw nodes
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
    this.config = this.generateConfig();
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
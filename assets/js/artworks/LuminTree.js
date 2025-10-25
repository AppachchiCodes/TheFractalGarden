// LuminTree
// Recursive fractal tree with organic swaying motion

export class LuminTree {
  constructor(containerId) {
    this.containerId = containerId;
    this.instance = null;
    this.config = this.generateConfig();
  }

  getColorPalette() {
    if (!window.colorMode) return null;
    return ['#80A1BA', '#B4DEBD', '#C2E2FA', '#FFF7DD'];
  }

  generateConfig() {
    return {
      // Fixed tree structure - never changes
      trunkLength: 85,
      branchRatio: 0.67,
      minBranchLength: 4,
      minAngle: Math.PI / 16,
      maxAngle: Math.PI / 2,
      strokeWeight: 1,
      alpha: 200,
      // Only sway speed can be randomized
      swaySpeed: Math.random() * 0.005 + 0.008 // 0.008-0.013
    };
  }

  init() {
    const self = this;
    const config = this.config;

    this.instance = new p5((p) => {
      let gradientColors = null;
      let lastColorMode = false;
      const GRADIENT_STEPS = 10;
      let maxDepth = 0;
      
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
        updateColors();
        
        // Calculate max depth
        let len = config.trunkLength;
        maxDepth = 0;
        while (len > config.minBranchLength) {
          maxDepth++;
          len *= config.branchRatio;
        }
      };

      function branch(len, depth) {
        let weight = p.map(len, config.minBranchLength, config.trunkLength, 1, config.strokeWeight * 3);
        p.strokeWeight(weight);
        
        if (gradientColors) {
          let colorIndex = Math.floor((depth / maxDepth) * (gradientColors.length - 1));
          colorIndex = p.constrain(colorIndex, 0, gradientColors.length - 1);
          p.stroke(gradientColors[colorIndex]);
        } else {
          p.stroke(255, config.alpha);
        }
        
        p.line(0, 0, 0, -len);
        p.translate(0, -len);
        
        if (len > config.minBranchLength) {
          p.push();
          p.rotate(p.map(p.sin(p.frameCount * config.swaySpeed), -1, 1, config.maxAngle, config.minAngle));
          branch(len * config.branchRatio, depth + 1);
          p.pop();
          
          p.push();
          p.rotate(-p.map(p.sin(p.frameCount * config.swaySpeed), -1, 1, config.maxAngle, config.minAngle));
          branch(len * config.branchRatio, depth + 1);
          p.pop();
        }
      }

      p.draw = () => {
        if (lastColorMode !== window.colorMode) {
          updateColors();
        }
        
        p.background(0);
        p.translate(p.width / 2, p.height);
        
        branch(config.trunkLength, 0);
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
    // Only randomize sway speed, keep tree structure the same
    this.config.swaySpeed = Math.random() * 0.005 + 0.008;
    // No need to destroy and reinit - just update the config
  }

  destroy() {
    if (this.instance) {
      this.instance.remove();
      this.instance = null;
    }
  }

  getCode() {
    return `let angle;
function setup() {
  createCanvas(400, 400);
  angle = PI / 4;
  stroke(255);
}
function draw() {
  background(0);
  translate(width / 2, height);
  angle = map(sin(frameCount * 0.01), -1, 1, PI / 2, PI / 16);
  branch(100);
}
function branch(len) {
  line(0, 0, 0, -len);
  translate(0, -len);
  if (len > 4) {
    push();
    rotate(angle);
    branch(len * 0.67);
    pop();
    push();
    rotate(-angle);
    branch(len * 0.67);
    pop();
  }
}`;
  }
}
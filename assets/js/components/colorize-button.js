// Colorize Button Component
// Handles color mode toggle

export class ColorizeButton {
  constructor(onToggle) {
    this.onToggle = onToggle;
    this.isColorMode = false;
    this.button = null;
    this.init();
  }

  init() {
    this.button = document.createElement('button');
    this.button.className = 'colorize-button';
    this.button.setAttribute('aria-label', 'Toggle color mode');
    this.button.setAttribute('title', 'Toggle color mode');
    
    this.button.innerHTML = `
      <svg width="100" height="48" viewBox="0 0 100 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="96" height="44" rx="22" fill="white" stroke="#1a1a1a" stroke-width="3"/>
        <text x="50" y="30" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#1a1a1a" text-anchor="middle">Click Me</text>
      </svg>
    `;
    
    this.button.addEventListener('click', () => this.toggle());
    
    document.body.appendChild(this.button);
  }

  toggle() {
    this.isColorMode = !this.isColorMode;
    
    document.documentElement.setAttribute('data-color-mode', this.isColorMode);
    
    window.colorMode = this.isColorMode;
    
    this.button.setAttribute(
      'aria-label', 
      this.isColorMode ? 'Switch to monochrome mode' : 'Switch to color mode'
    );
    
    if (this.onToggle) {
      this.onToggle(this.isColorMode);
    }
  }

  getColorMode() {
    return this.isColorMode;
  }
}
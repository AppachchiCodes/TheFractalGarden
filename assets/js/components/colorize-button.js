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
    // Create button element
    this.button = document.createElement('button');
    this.button.className = 'colorize-button';
    this.button.setAttribute('aria-label', 'Toggle color mode');
    this.button.setAttribute('title', 'Toggle color mode');
    
    // Add SVG icon
    this.button.innerHTML = `
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 8 A16 16 0 0 1 38.627 18 L24 24 Z" fill="#FF6B9D" class="color-segment"/>
        <path d="M38.627 18 A16 16 0 0 1 40 24 L24 24 Z" fill="#FFB366" class="color-segment"/>
        <path d="M40 24 A16 16 0 0 1 38.627 30 L24 24 Z" fill="#FFE066" class="color-segment"/>
        <path d="M38.627 30 A16 16 0 0 1 24 40 L24 24 Z" fill="#A3DC9A" class="color-segment"/>
        <path d="M24 40 A16 16 0 0 1 9.373 30 L24 24 Z" fill="#A6E3E9" class="color-segment"/>
        <path d="M9.373 30 A16 16 0 0 1 8 24 L24 24 Z" fill="#5FA3D0" class="color-segment"/>
        <path d="M8 24 A16 16 0 0 1 9.373 18 L24 24 Z" fill="#5A9BD5" class="color-segment"/>
        <path d="M9.373 18 A16 16 0 0 1 24 8 L24 24 Z" fill="#8B7EC8" class="color-segment"/>
        <circle cx="24" cy="24" r="12" fill="white" stroke="#1a1a1a" stroke-width="2"/>
        <circle cx="18" cy="24" r="1.5" fill="#1a1a1a"/>
        <circle cx="24" cy="24" r="1.5" fill="#1a1a1a"/>
        <circle cx="30" cy="24" r="1.5" fill="#1a1a1a"/>
        <g transform="translate(32, 10) rotate(45 8 8)">
          <rect x="6" y="2" width="4" height="12" fill="#E0E0E0" stroke="#1a1a1a" stroke-width="1.5"/>
          <ellipse cx="8" cy="2" rx="2.5" ry="2" fill="#808080" stroke="#1a1a1a" stroke-width="1.5"/>
          <path d="M 6 14 L 8 18 L 10 14 Z" fill="#E0E0E0" stroke="#1a1a1a" stroke-width="1.5"/>
        </g>
        <circle cx="24" cy="24" r="20" fill="none" stroke="#1a1a1a" stroke-width="3"/>
      </svg>
    `;
    
    // Add click handler
    this.button.addEventListener('click', () => this.toggle());
    
    // Add to document
    document.body.appendChild(this.button);
  }

  toggle() {
    this.isColorMode = !this.isColorMode;
    
    // Update DOM attribute for CSS
    document.documentElement.setAttribute('data-color-mode', this.isColorMode);
    
    // Update global state
    window.colorMode = this.isColorMode;
    
    // Update aria label
    this.button.setAttribute(
      'aria-label', 
      this.isColorMode ? 'Switch to monochrome mode' : 'Switch to color mode'
    );
    
    // Call callback to update artworks
    if (this.onToggle) {
      this.onToggle(this.isColorMode);
    }
  }

  getColorMode() {
    return this.isColorMode;
  }
}
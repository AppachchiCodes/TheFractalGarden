// Main Application
// Initializes the gallery and manages global state

import { Gallery } from '../components/gallery.js';
import { ColorizeButton } from '../components/colorize-button.js';

class App {
  constructor() {
    this.gallery = null;
    this.colorizeButton = null;
    
    // Initialize global color mode state
    window.colorMode = false;
    
    this.init();
  }

  async init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.start());
    } else {
      await this.start();
    }
  }

  async start() {
    try {
      // Initialize gallery
      this.gallery = new Gallery();
      await this.gallery.init();
      
      // Initialize colorize button
      this.colorizeButton = new ColorizeButton((colorMode) => {
        this.onColorModeChange(colorMode);
      });
      
      // Setup navigation active state
      this.setupNavigation();
      
      console.log('The Fractal Garden initialized successfully');
    } catch (error) {
      console.error('Failed to initialize app:', error);
      this.showError();
    }
  }

  onColorModeChange(colorMode) {
    console.log(`Color mode ${colorMode ? 'enabled' : 'disabled'}`);
    
    // Update global state
    window.colorMode = colorMode;
    
    // Reload all artworks with new color mode
    if (this.gallery) {
      this.gallery.reloadAllArtworks();
    }
  }

  setupNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;
      if (linkPath === currentPath || (currentPath === '/' && linkPath === '/')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  showError() {
    const gallery = document.getElementById('gallery');
    if (gallery) {
      gallery.innerHTML = `
        <div class="gallery-empty">
          <p>Failed to load gallery. Please refresh the page.</p>
        </div>
      `;
    }
  }
}

// Initialize app
new App();
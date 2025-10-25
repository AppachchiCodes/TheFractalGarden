import { Gallery } from '../components/gallery.js';
import { ColorizeButton } from '../components/colorize-button.js';
import { AudioController } from '../components/audio-controller.js';
import { MusicButton } from '../components/music-button.js';

class App {
  constructor() {
    this.gallery = null;
    this.colorizeButton = null;
    this.audioController = null;
    this.musicButton = null;
    
    window.colorMode = false;
    
    this.init();
  }

  async init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.start());
    } else {
      await this.start();
    }
  }

  async start() {
    try {
      this.gallery = new Gallery();
      await this.gallery.init();
      
      this.colorizeButton = new ColorizeButton((colorMode) => {
        this.onColorModeChange(colorMode);
      });
      
      await this.initAudio();
      
      this.setupNavigation();
      
      console.log('The Fractal Garden initialized successfully');
    } catch (error) {
      console.error('Failed to initialize app:', error);
      this.showError();
    }
  }

  async initAudio() {
    try {
      console.log('Initializing audio system...');
      
      this.audioController = new AudioController();
      await this.audioController.init('assets/audio/track.mp3');
      
      this.musicButton = new MusicButton(this.audioController);
      
      window.audioController = this.audioController;
      
      console.log('Audio system ready!');
    } catch (error) {
      console.error('Audio initialization failed:', error);
    }
  }

  onColorModeChange(colorMode) {
    console.log(`Color mode ${colorMode ? 'enabled' : 'disabled'}`);
    
    window.colorMode = colorMode;
    
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

new App();
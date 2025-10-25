export class MusicButton {
  constructor(audioController) {
    this.audioController = audioController;
    this.button = null;
    this.isPlaying = false;
    this.init();
    this.startStateSync();
  }

  init() {
    this.button = document.createElement('button');
    this.button.className = 'music-button';
    this.button.setAttribute('aria-label', 'Play music');
    this.button.setAttribute('title', 'Toggle audio reactivity');
    
    this.updateButtonContent();
    
    this.button.addEventListener('click', () => this.toggle());
    
    document.body.appendChild(this.button);
  }

  startStateSync() {
    setInterval(() => {
      const actualState = this.audioController.isActive();
      if (this.isPlaying !== actualState) {
        this.isPlaying = actualState;
        this.updateButtonContent();
        if (actualState) {
          this.button.classList.add('active');
        } else {
          this.button.classList.remove('active');
        }
      }
    }, 100);
  }

  updateButtonContent() {
    const text = this.isPlaying ? 'Pause' : 'Play';
    this.button.innerHTML = `
      <svg width="80" height="30" viewBox="0 0 80 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="40" y="20" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="white" text-anchor="middle">${text}</text>
      </svg>
    `;
  }

  toggle() {
    const actuallyPlaying = this.audioController.isActive();
    this.isPlaying = actuallyPlaying;
    
    if (!this.isPlaying) {
      this.audioController.play();
      this.isPlaying = true;
      this.button.classList.add('active');
      this.button.setAttribute('aria-label', 'Pause music');
    } else {
      this.audioController.pause();
      this.isPlaying = false;
      this.button.classList.remove('active');
      this.button.setAttribute('aria-label', 'Play music');
    }
    
    this.updateButtonContent();
  }
}
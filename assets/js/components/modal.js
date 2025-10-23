// Modal Component
// Handles opening/closing the artwork detail modal

export class Modal {
  constructor() {
    this.modal = document.getElementById('artwork-modal');
    this.overlay = this.modal.querySelector('.modal-overlay');
    this.closeBtn = this.modal.querySelector('.modal-close');
    this.titleEl = document.getElementById('modal-title');
    this.descriptionEl = document.getElementById('modal-description');
    this.codeEl = document.getElementById('modal-code');
    
    this.initEventListeners();
  }

  initEventListeners() {
    // Close on overlay click
    this.overlay.addEventListener('click', () => this.close());
    
    // Close on close button click
    this.closeBtn.addEventListener('click', () => this.close());
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  open(artwork) {
    this.titleEl.textContent = artwork.title;
    this.descriptionEl.textContent = artwork.description;
    this.codeEl.textContent = artwork.code;
    
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  isOpen() {
    return this.modal.classList.contains('active');
  }
}
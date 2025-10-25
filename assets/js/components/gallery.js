// Gallery Component
// Handles rendering artwork cards and managing p5 instances

import { ARTWORKS } from '../config/artworks.js';
import { Modal } from './modal.js';

export class Gallery {
  constructor() {
    this.container = document.getElementById('gallery');
    this.artworkInstances = new Map();
    this.modal = new Modal();
    this.observerOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    };
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      this.observerOptions
    );
  }

  async init() {
    await this.renderCards();
    this.setupObserver();
  }

  async renderCards() {
    for (const artwork of ARTWORKS) {
      const card = this.createCard(artwork);
      this.container.appendChild(card);
    }
  }

  createCard(artworkData) {
    const card = document.createElement('div');
    card.className = 'artwork-card';
    card.dataset.artworkId = artworkData.id;
    
    const header = document.createElement('div');
    header.className = 'artwork-header';
    
    const title = document.createElement('h2');
    title.className = 'artwork-title';
    title.textContent = artworkData.title;
    
    header.appendChild(title);
    
    const canvasContainer = document.createElement('div');
    canvasContainer.className = 'artwork-canvas-container';
    canvasContainer.id = `canvas-${artworkData.id}`;
    
    const footer = document.createElement('div');
    footer.className = 'artwork-footer';
    
    const randomizeBtn = document.createElement('button');
    randomizeBtn.className = 'btn';
    randomizeBtn.textContent = 'Randomize';
    randomizeBtn.onclick = () => this.randomizeArtwork(artworkData.id);
    
    const infoBtn = document.createElement('button');
    infoBtn.className = 'btn btn-icon';
    infoBtn.innerHTML = 'ⓘ';
    infoBtn.setAttribute('aria-label', 'View artwork details');
    infoBtn.onclick = () => this.showArtworkDetails(artworkData.id);
    
    footer.appendChild(randomizeBtn);
    footer.appendChild(infoBtn);
    
    card.appendChild(header);
    card.appendChild(canvasContainer);
    card.appendChild(footer);
    
    return card;
  }

  setupObserver() {
    const cards = this.container.querySelectorAll('.artwork-card');
    cards.forEach(card => this.observer.observe(card));
  }

  async handleIntersection(entries) {
    for (const entry of entries) {
      const artworkId = entry.target.dataset.artworkId;
      
      if (entry.isIntersecting && !this.artworkInstances.has(artworkId)) {
        await this.loadArtwork(artworkId);
      }
    }
  }

  async loadArtwork(artworkId) {
    const artworkData = ARTWORKS.find(a => a.id === artworkId);
    if (!artworkData) return;
    
    try {
      const module = await artworkData.module();
      const ArtworkClass = module[Object.keys(module)[0]];
      const instance = new ArtworkClass(`canvas-${artworkId}`);
      instance.init();
      this.artworkInstances.set(artworkId, { instance, data: artworkData });
    } catch (error) {
      console.error(`Failed to load artwork: ${artworkId}`, error);
    }
  }

  randomizeArtwork(artworkId) {
  const artwork = this.artworkInstances.get(artworkId);
  if (artwork && artwork.instance) {
    if (window.audioController && window.audioController.isActive()) {
      window.audioController.pause();
      setTimeout(() => {
        artwork.instance.randomize();
      }, 100);
    } else {
      artwork.instance.randomize();
    }
  }
}

  async showArtworkDetails(artworkId) {
    const artwork = this.artworkInstances.get(artworkId);
    if (!artwork) return;
    
    this.modal.open({
      title: artwork.data.title,
      description: artwork.data.description,
      code: artwork.instance.getCode()
    });
  }

  async reloadAllArtworks() {
    // Destroy all existing artwork instances
    this.artworkInstances.forEach(artwork => {
      if (artwork.instance && artwork.instance.destroy) {
        artwork.instance.destroy();
      }
    });
    this.artworkInstances.clear();
    
    // Reload all visible artworks
    const cards = this.container.querySelectorAll('.artwork-card');
    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible) {
        const artworkId = card.dataset.artworkId;
        await this.loadArtwork(artworkId);
      }
    }
  }

  destroy() {
    this.artworkInstances.forEach(artwork => {
      if (artwork.instance && artwork.instance.destroy) {
        artwork.instance.destroy();
      }
    });
    this.artworkInstances.clear();
    this.observer.disconnect();
  }
}
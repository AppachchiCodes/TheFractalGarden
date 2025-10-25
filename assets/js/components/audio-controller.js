export class AudioController {
  constructor() {
    this.audio = null;
    this.audioContext = null;
    this.analyser = null;
    this.dataArray = null;
    this.isPlaying = false;
    
    this.audioData = {
      bass: 0,
      mid: 0,
      treble: 0,
      volume: 0
    };
  }

  async init(audioPath) {
    this.audio = new Audio(audioPath);
    this.audio.loop = true;
    this.audio.volume = 0.7;
    
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    
    const source = this.audioContext.createMediaElementSource(this.audio);
    source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
    
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    
    this.startUpdateLoop();
  }

  startUpdateLoop() {
    const update = () => {
      this.update();
      requestAnimationFrame(update);
    };
    update();
  }

  update() {
    if (!this.isPlaying || !this.analyser) {
      this.audioData = { bass: 0, mid: 0, treble: 0, volume: 0 };
      return;
    }
    
    this.analyser.getByteFrequencyData(this.dataArray);
    
    const bass = this.dataArray.slice(0, 5).reduce((a, b) => a + b) / (5 * 255);
    const mid = this.dataArray.slice(5, 20).reduce((a, b) => a + b) / (15 * 255);
    const treble = this.dataArray.slice(20, 40).reduce((a, b) => a + b) / (20 * 255);
    
    this.audioData.bass = bass;
    this.audioData.mid = mid;
    this.audioData.treble = treble;
    this.audioData.volume = (bass + mid + treble) / 3;
  }

  async play() {
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    await this.audio.play();
    this.isPlaying = true;
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
  }

  getAudioData() {
    return this.audioData;
  }

  isActive() {
    return this.isPlaying;
  }
}
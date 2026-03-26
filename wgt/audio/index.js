import { ImsBaseClass } from '../../lib/ImsBaseClass.js';
import { ImsAudioData } from './ImsAudioData.js';
import { template } from './template.js';
import { styles } from './styles.js';

export class ImsAudio extends ImsBaseClass {

  dataClass = ImsAudioData;

  /** @type {HTMLAudioElement} */
  #audio;
  /** @type {AudioContext} */
  #audioCtx;
  /** @type {AnalyserNode} */
  #analyser;
  /** @type {any} */
  #waveformData;
  #rafId;

  init$ = {
    ppIcon: 'play',
    currentTime: '00:00',
    totalTime: '00:00',
    volIcon: 'unmute',
    volumeValue: 100,

    togglePlay: () => {
      this.togglePlay();
    },

    toggleMute: () => {
      this.toggleMute();
    },

    onVolChange: (e) => {
      if (!this.#audio) return;
      let val = parseFloat(e.currentTarget.$.value);
      this.setVolume(val);
    },
  }

  /** Toggle play/pause */
  togglePlay() {
    if (!this.#audio) return;
    if (this.#audio.paused) {
      this.#audio.play();
    } else {
      this.#audio.pause();
    }
  }

  /** Start playback */
  play() {
    if (!this.#audio) return;
    this.#audio.play();
  }

  /** Pause playback */
  pause() {
    if (!this.#audio) return;
    this.#audio.pause();
  }

  /**
   * Seek to a position
   * @param {number} seconds
   */
  seek(seconds) {
    if (!this.#audio) return;
    this.#audio.currentTime = Math.max(0, Math.min(seconds, this.#audio.duration || 0));
  }

  /**
   * Set volume
   * @param {number} val - 0-100
   */
  setVolume(val) {
    if (!this.#audio) return;
    this.#audio.volume = Math.max(0, Math.min(val, 100)) / 100;
    this.$.volumeValue = val;
  }

  /** Toggle mute */
  toggleMute() {
    if (!this.#audio) return;
    this.#audio.muted = !this.#audio.muted;
    this.$.volIcon = this.#audio.muted ? 'mute' : 'unmute';
  }

  /**
   * @param {number} seconds
   */
  #timeFmt(seconds) {
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
  }

  get hotspotState() {
    return { time: this.#audio?.currentTime ?? 0 };
  }

  #drawWaveform() {
    if (!this.canvas || !this.#analyser) return;
    let ctx = this.ctx2d;
    let w = this.canvas.width;
    let h = this.canvas.height;

    this.#analyser.getFloatTimeDomainData(this.#waveformData);

    ctx.clearRect(0, 0, w, h);

    // Waveform
    let waveColor = this.srcData?.waveformColor || 'rgba(255, 255, 255, 0.3)';
    ctx.strokeStyle = waveColor;
    ctx.lineWidth = 2;
    ctx.beginPath();

    let sliceWidth = w / this.#waveformData.length;
    let x = 0;
    for (let i = 0; i < this.#waveformData.length; i++) {
      let v = this.#waveformData[i];
      let y = (v + 1) / 2 * h;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }
    ctx.stroke();

    // Progress
    if (this.#audio && this.#audio.duration) {
      let progress = this.#audio.currentTime / this.#audio.duration;
      let progressColor = this.srcData?.progressColor || 'rgba(79, 195, 247, 0.5)';
      ctx.fillStyle = progressColor;
      ctx.fillRect(0, 0, w * progress, h);
    }

    this.#rafId = requestAnimationFrame(() => this.#drawWaveform());
  }

  init() {
    this.#audio = new Audio();
    let audioSrc = this.srcData.srcList?.[0];
    if (!audioSrc) return;
    try {
      let srcUrl = new URL(audioSrc, location.href);
      if (srcUrl.origin === location.origin) {
        this.#audio.crossOrigin = 'anonymous';
      }
    } catch (e) {
      // relative URL — same origin
      this.#audio.crossOrigin = 'anonymous';
    }



    this.#audio.src = audioSrc;
    this.#audio.loop = this.srcData.loop || false;

    this.#audio.addEventListener('loadedmetadata', () => {
      this.$.totalTime = this.#timeFmt(this.#audio.duration);
      this.$.progress = 100;
    });

    this.#audio.addEventListener('timeupdate', () => {
      this.$.currentTime = this.#timeFmt(this.#audio.currentTime);
    });

    this.#audio.addEventListener('play', () => {
      this.$.ppIcon = 'pause';
      // Lazy init AudioContext on user gesture
      if (!this.#audioCtx) {
        try {
          this.#audioCtx = new AudioContext();
          this.#analyser = this.#audioCtx.createAnalyser();
          this.#analyser.fftSize = 2048;
          this.#waveformData = new Float32Array(this.#analyser.frequencyBinCount);
          let source = this.#audioCtx.createMediaElementSource(this.#audio);
          source.connect(this.#analyser);
          this.#analyser.connect(this.#audioCtx.destination);
        } catch (e) {
          // Cross-origin audio — waveform unavailable
          this.#audioCtx = null;
        }
      }
      this.#drawWaveform();
    });

    this.#audio.addEventListener('pause', () => {
      this.$.ppIcon = 'play';
      cancelAnimationFrame(this.#rafId);
    });

    this.#audio.addEventListener('ended', () => {
      this.$.ppIcon = 'play';
      cancelAnimationFrame(this.#rafId);
    });

    // Click to seek
    this.canvas.addEventListener('click', (e) => {
      if (!this.#audio.duration) return;
      let rect = this.canvas.getBoundingClientRect();
      let ratio = (e.clientX - rect.left) / rect.width;
      this.#audio.currentTime = ratio * this.#audio.duration;
    });

    this.canvas.width = this.rect.width;
    this.canvas.height = 80;

    if (this.srcData.autoplay) {
      this.#audio.play().catch(() => {});
    }
  }

  onResize = () => {
    super.onResize();
    if (this.canvas) {
      this.canvas.width = this.rect.width;
    }
  }

  destroyCallback() {
    super.destroyCallback();
    cancelAnimationFrame(this.#rafId);
    this.#audio?.pause();
    this.#audioCtx?.close();
  }
}

ImsAudio.shadowStyles = styles;
ImsAudio.template = template;

ImsAudio.reg('ims-audio');

export { ImsAudioData };
export default ImsAudio;

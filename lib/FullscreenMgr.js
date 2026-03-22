export class FullscreenMgr {

  static #initialized = false;
  /** @type {String} */
  static #fsIsName;
  /** @type {String} */
  static #_fsRequestName;
  /** @type {String} */
  static #_fsExitName
  /** @type {String} */
  static #fsCallbackName;

  /**
   * 
   * @param {String[]} names 
   * @returns 
   */
  static #getSupported(names) {
    let el = document.createElement('div');
    return names.find((name) => {
      if (window['__FULLSCREEN_API_UNSUPPORTED_TEST__']) {
        return false;
      }
      return !!document[name] || !!el[name];
    });
  }

  static get #fsRequestName() {
    let names = [
      'requestFullscreen',
      'webkitRequestFullscreen',
      'mozRequestFullScreen',
      'msRequestFullscreen',
    ];
    if (!this.#_fsRequestName) {
      this.#_fsRequestName = this.#getSupported(names);
    }
    return this.#_fsRequestName;
  }

  static get #fsExitName() {
    let names = [
      'exitFullscreen',
      'webkitExitFullscreen',
      'msExitFullscreen',
      'mozCancelFullScreen',
    ];
    if (!this.#_fsExitName) {
      this.#_fsExitName = this.#getSupported(names);
    }
    return this.#_fsExitName;
  }

  static supported() {
    return !!this.#fsRequestName;
  }

  static enable(el) {
    if (this.supported()) {
      el[this.#fsRequestName]?.();
    }
    // CSS-only fallback: :host([fullscreen]) styles handle the rest
  }

  static disable() {
    if (this.supported()) {
      document[this.#fsExitName]?.();
    }
    // CSS-only fallback: removing [fullscreen] attribute handles the rest
  }

  static get current() {
    return document[this.#fsIsName];
  }

  static init() {
    if (!this.supported()) {
      return;
    } else if (this.#initialized) {
      return;
    }

    if (this.#fsRequestName.startsWith('webkit')) {
      this.#fsCallbackName = 'onwebkitfullscreenchange';
      this.#fsIsName = 'webkitIsFullScreen';
    } else if (this.#fsRequestName.startsWith('moz')) {
      this.#fsCallbackName = 'onmozfullscreenchange';
      this.#fsIsName = 'mozFullScreen';
    } else if (this.#fsRequestName.startsWith('ms')) {
      this.#fsCallbackName = 'MSFullscreenChange';
      this.#fsIsName = 'webkitIsFullScreen';
    } else {
      this.#fsCallbackName = 'onfullscreenchange';
      this.#fsIsName = 'fullscreen';
    }
    this.#initialized = true;
  }

}

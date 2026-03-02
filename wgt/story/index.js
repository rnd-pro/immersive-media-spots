import Symbiote, { html, css } from '@symbiotejs/symbiote';
import { loadSourceData } from '../../lib/loadSourceData.js';

/**
 * @typedef {Object} StorySlide
 * @property {string} srcData - URL to IMS widget data JSON
 * @property {string} [caption] - Optional caption text
 */

/**
 * @typedef {Object} ImsStoryConfig
 * @property {string} imsType - 'story'
 * @property {StorySlide[]} slides - Array of slide definitions
 */

export class ImsStory extends Symbiote {

  init$ = {
    currentSlide: 0,
    totalSlides: 0,
    caption: '',
    onNext: () => {
      if (this.$.currentSlide < this.$.totalSlides - 1) {
        this.$.currentSlide++;
      }
    },
    onPrev: () => {
      if (this.$.currentSlide > 0) {
        this.$.currentSlide--;
      }
    },
  };

  /** @type {ImsStoryConfig} */
  #config;
  /** @type {StorySlide[]} */
  #slides = [];

  async initCallback() {
    this.sub('srcData', async (url) => {
      if (!url) return;
      this.#config = await loadSourceData(url);
      this.#slides = this.#config.slides || [];
      this.$.totalSlides = this.#slides.length;
      if (this.#slides.length) {
        this.$.currentSlide = 0;
      }
    });

    this.sub('currentSlide', (idx) => {
      this.#renderSlide(idx);
    });
  }

  /**
   * @param {number} idx
   */
  async #renderSlide(idx) {
    let slide = this.#slides[idx];
    if (!slide) return;

    let container = this.ref.slideContainer;
    container.innerHTML = '';

    this.$.caption = slide.caption || '';

    let viewer = document.createElement('ims-viewer');
    viewer.setAttribute('src-data', slide.srcData);
    container.appendChild(viewer);
  }
}

ImsStory.template = html`
<div ref="slideContainer" class="slide-container"></div>
<div class="story-nav" ${{'@hidden': '!totalSlides'}}>
  <ims-button icon="left" ${{onclick: 'onPrev'}}></ims-button>
  <span class="counter">{{currentSlide}} / {{totalSlides}}</span>
  <ims-button icon="right" ${{onclick: 'onNext'}}></ims-button>
</div>
<div class="caption" ${{'@hidden': '!caption'}}>{{caption}}</div>
`;

ImsStory.shadowStyles = css`
:host {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: relative;
  background-color: var(--color-bg);
  color: var(--color-fg);
}
.slide-container {
  flex: 1;
  display: flex;
  min-height: 0;
}
.slide-container > * {
  width: 100%;
  height: 100%;
}
.story-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--ui-gap, 8px);
  padding: var(--ui-padding, 8px);
}
.counter {
  font-family: var(--ims-font-mono, monospace);
  font-size: var(--ims-font-size, 12px);
  opacity: 0.7;
  min-width: 60px;
  text-align: center;
}
.caption {
  text-align: center;
  padding: 8px 16px;
  font-size: 14px;
  opacity: 0.8;
}
`;

ImsStory.bindAttributes({
  'src-data': 'srcData',
});

ImsStory.reg('ims-story');

export default ImsStory;

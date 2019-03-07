import html from './Shutter.html';
import CustomElement from '../../utils/custom-element';
import { eventFire } from '../../utils/misc';

class Shutter extends CustomElement {
  _acceptedSizes: string[] = ['small', 'wide', 'full'];
  _acceptedSides: string[] = ['left', 'right'];

  constructor() {
    super();

    this.template = document.createElement('template');
    this.template.innerHTML = this._translate(html);
    this._prepareTemplate(this.template, 'fc-shutter');

    // TEST

    this._styleElement();

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(this.template.content.cloneNode(true));
      this.shadowRoot
        .querySelector('#shutter-close')
        .addEventListener('click', () => this.close());
      this.shadowRoot
        .querySelector('#shutter-overlay')
        .addEventListener('click', () => this.close());
    }
  }

  connectedCallback() {
    if (!this.hasAttribute('size')) {
      this.setAttribute('size', 'small');
    }

    if (!this.hasAttribute('side')) {
      this.setAttribute('side', 'right');
    }
  }

  static get observedAttributes() {
    return ['size', 'side'];
  }

  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    switch (name) {
      case 'size':
        this.changeSizeValue(oldValue, newValue);
        break;
      case 'side':
        this.changeSideValue(oldValue, newValue);
        break;
      default:
        throw new Error(`Attribute ${name} is not supported.`);
    }
  }

  open() {
    this.classList.add('show');
    eventFire(this, 'opened');
  }

  close() {
    this.classList.remove('show');
    eventFire(this, 'closed');
  }

  get isOpen() {
    return this.classList.contains('show');
  }

  set title(newTitle: string) {
    this.shadowRoot.querySelector('shutter-title').textContent = newTitle;
  }

  get size() {
    return this.getAttribute('size');
  }

  set size(newSize: string) {
    if (this.checkSizeValue(newSize)) {
      this.setAttribute('size', newSize);
    }
  }

  get side() {
    return this.getAttribute('side');
  }

  set side(newSide: string) {
    if (this.checkSideValue(newSide)) {
      this.setAttribute('side', newSide);
    }
  }

  changeSizeValue(oldValue: string, newValue: string) {
    if (this.checkSizeValue(newValue)) {
      const header = this.shadowRoot.querySelector('#shutter-container');
      header.classList.remove(oldValue);
      header.classList.add(newValue);
    }
  }

  checkSizeValue(size: string) {
    return this._acceptedSizes.indexOf(size) != -1;
  }

  changeSideValue(oldValue: string, newValue: string) {
    if (this.checkSideValue(newValue)) {
      this.classList.remove(oldValue);
      this.classList.add(newValue);
    }
  }

  checkSideValue(side: string) {
    return this._acceptedSides.indexOf(side) != -1;
  }
}

window.customElements.define('fc-shutter', Shutter);

export default Shutter;

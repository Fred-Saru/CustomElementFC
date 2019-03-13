import html from './Shutter.html';
import CustomElement from '../../models/custom-element';
import { eventFire } from '../../utils/misc';

class Shutter extends CustomElement {
  _acceptedSizes: string[] = ['small', 'wide', 'full'];
  _acceptedSides: string[] = ['left', 'right'];

  constructor() {
    super();

    this._template = document.createElement('template');
    this._template.innerHTML = this._translate(html);
    this._prepareTemplate('fc-shutter');

    this._styleElement();

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(this._template.content.cloneNode(true));
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
    return ['size', 'side', 'header'];
  }

  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    switch (name) {
      case 'size':
        this.changeSizeValue(oldValue, newValue);
        break;
      case 'side':
        this.changeSideValue(oldValue, newValue);
        break;
      case 'header':
        this.changeHeaderValue(oldValue, newValue);
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

  get content() {
    return <HTMLElement>(
      this.shadowRoot.querySelector('#shutter-content').firstElementChild
    );
  }

  set content(newValue: HTMLElement | null) {
    const content = this.shadowRoot.querySelector('#shutter-content');
    content.innerHTML = '';

    if (newValue) {
      content.appendChild(newValue);
    }
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

  get header() {
    return this.getAttribute('header');
  }

  set header(newTitle: string) {
    this.setAttribute('header', newTitle);
  }

  changeHeaderValue(oldValue: string, newValue: string) {
    this.shadowRoot.querySelector('#shutter-title').textContent = newValue;
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

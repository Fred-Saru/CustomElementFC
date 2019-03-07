import html from './Shutter.html';
import CustomElement from '../../utils/custom-element';
import { eventFire } from '../../utils/misc';

class Shutter extends CustomElement {

  _size: string = "small";
  _acceptedSizes: string[] = ["small", "wide", "full"];

  constructor() {
    super();

    this.template = document.createElement('template');
    this.template.innerHTML = this._translate(html);
    this._prepareTemplate(this.template, 'fc-shutter');
  }

  connectedCallback() {
    this._styleElement();

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(this.template.content.cloneNode(true));
      this.shadowRoot.querySelector('#shutter-close').addEventListener('click', () => this.close());
      this.shadowRoot.querySelector('#shutter-overlay').addEventListener('click', () => this.close());
    }
  }

  open() {
    this.removeAttribute('hidden');
    eventFire(this, "opened");
  }

  close() {
    this.setAttribute('hidden', '');
    eventFire(this, "closed");
  }

  get isOpen() {
    return !this.hasAttribute('hidden');
  }

  set title(newTitle: string) {
    this.shadowRoot.querySelector('shutter-title').textContent = newTitle;
  }

  get size() {
    return this._size;
  }

  set size(newSize: string) {
    const tempSize = newSize.toLowerCase() || this._acceptedSizes[0];

    if (this._acceptedSizes.indexOf(tempSize) != -1) {
      this._size = tempSize;
    }
  }

}

window.customElements.define('fc-shutter', Shutter);

export default Shutter;
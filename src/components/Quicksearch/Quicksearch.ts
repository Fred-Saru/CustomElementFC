import CustomElement from "../../utils/custom-element";
import html from './Quicksearch.html';

export default class Quicksearch extends CustomElement {

  constructor() {
    super();

    this.template = document.createElement('template');
    this.template.innerHTML = this._translate(html);
    this._prepareTemplate(this.template, 'fc-shutter-preference');
    this._styleElement();

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(this.template.content.cloneNode(true));
    }
  }
}

window.customElements.define('fc-quicksearch', Quicksearch);
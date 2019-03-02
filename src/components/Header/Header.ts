import html from './Header.html';
import CustomElement from '../../utils/util';

export default class Header extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = html;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

window.customElements.define('fc-header', Header);
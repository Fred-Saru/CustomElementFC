import html from './Menu.html';
import CustomElement from '../../utils/custom-element';

export default class Menu extends CustomElement {

  constructor() {
    super();

    this.template = document.createElement('template');
    this.template.innerHTML = this._translate(html);
    this._prepareTemplate(this.template, 'fc-menu');
  }

  connectedCallback() {
    this._styleElement();

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(this.template.content.cloneNode(true));
      this.shadowRoot.querySelector('#menuCollapseBtn').addEventListener('click', () => this.collapsed = !this.collapsed);
    }
  }

  collapse(shouldCollape: boolean) {
    const menu = this.shadowRoot.querySelector('.menu-zone');

    if (shouldCollape) {
      menu.classList.add('is-collapsed');
    } else {
      menu.classList.remove('is-collapsed');
    }
  }

  get collapsed() {
    return this.hasAttribute('collapsed');
  }

  set collapsed(collapse) {
    if (collapse) {
      this.setAttribute('collapsed', '');
      this.collapse(true);
    } else {
      this.removeAttribute('collapsed');
      this.collapse(false);
    }
  }
}

window.customElements.define('fc-menu', Menu);
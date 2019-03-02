import html from './Menu.html';

export default class Menu extends HTMLElement {

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = html;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.querySelector('#menuCollapseBtn').addEventListener('click', () => this.collapsed = !this.collapsed);
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
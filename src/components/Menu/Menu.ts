import html from './Menu.html';
import CustomElement from '../../utils/custom-element';

export default class Menu extends CustomElement {

  constructor() {
    super();

    this.template = document.createElement('template');
    this.template.innerHTML = this._translate(html);
    this._prepareTemplate(this.template, 'fc-menu');
    this._styleElement();

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(this.template.content.cloneNode(true));
      this.shadowRoot.querySelector('#menuCollapseBtn').addEventListener('click', () => this.collapsed = !this.collapsed);
      this.shadowRoot.querySelector('#hubBtn').addEventListener('click', this.toggleMenu);
      this.shadowRoot.querySelector('#menuBtn').addEventListener('click', this.toggleMenu);
      window.addEventListener('resize', this.resizeHandler);
      this.resizeHandler();
    }
  }

  resizeHandler = () => {
    var width = window.innerWidth;
    if (width < 1280) {
      this.collapsed = true;
    } else {
      this.collapsed = false;
    }
  }

  toggleMenu = (e: MouseEvent) => {
    const menus = <HTMLElement[]><any>this.shadowRoot.querySelectorAll('.hub');
    for (let i in menus) {
      if (menus[i].classList.contains('hidden')) {
        menus[i].classList.remove('hidden');
      } else {
        menus[i].classList.add('hidden');
      }
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
import html from './Menu.html';
import CustomElement from '../../models/custom-element';
import { Icon } from '../Icon/Icon';
import { IMenu, CurrentContext } from '../../data/context-data';
import '../Tile/Tile';

export default class Menu extends CustomElement {
  constructor() {
    super();

    this._template = document.createElement('template');
    this._template.innerHTML = this._translate(html);
    this._prepareTemplate('fc-menu');
    this._styleElement();

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(this._template.content.cloneNode(true));
      this.shadowRoot
        .querySelector('#menuCollapseBtn')
        .addEventListener('click', () => (this.collapsed = !this.collapsed));
      this.shadowRoot
        .querySelector('#hubBtn')
        .addEventListener('click', this.toggleMenu);
      this.shadowRoot
        .querySelector('#menuBtn')
        .addEventListener('click', this.toggleMenu);
      window.addEventListener('resize', this.resizeHandler);
      this.resizeHandler();
    }
  }

  connectedCallback() {
    this.initialize(CurrentContext.getAllMenuData());
  }

  initialize = (menuData: IMenu[]) => {
    const hub = this.shadowRoot.querySelector('#tileHub');
    const fragment = document.createDocumentFragment();
    const selectedMenu = CurrentContext.getCurrentMenuData();
    const menus = menuData.sort((a, b) => a.order > b.order ? 1 : -1);
    menus.forEach((menu) => {
      const tile = document.createElement('fc-tile');
      tile.setAttribute('tile', JSON.stringify({ url: menu.url, label: CurrentContext.extractLabel(menu.label), icon: menu.icon }));
      if (selectedMenu.order === menu.order) {
        tile.setAttribute('selected', 'true');
      }
      fragment.appendChild(tile);
    });

    hub.appendChild(fragment);
  }

  resizeHandler = () => {
    var width = window.innerWidth;
    if (width < 1280) {
      this.collapsed = true;
    } else {
      this.collapsed = false;
    }
  };

  toggleMenu = (e: MouseEvent) => {
    const menus = <HTMLElement[]>Array.from(
      (<any>this.shadowRoot.querySelectorAll('.hub'))
    );
    for (let i in menus) {
      if (menus[i].classList.contains('hidden')) {
        menus[i].classList.remove('hidden');
        menus[i].parentElement.querySelector('fc-icon').setAttribute('name', 'arrow-up');
      } else {
        menus[i].classList.add('hidden');
        menus[i].parentElement.querySelector('fc-icon').setAttribute('name', 'arrow-down');
      }
    }
  };

  collapse(shouldCollape: boolean) {
    const menu = this.shadowRoot.querySelector('.menu-zone');
    const collapseIcon = <Icon>(
      this.shadowRoot.querySelector('#menuCollapseBtn fc-icon')
    );
    if (shouldCollape) {
      menu.classList.add('is-collapsed');
      collapseIcon.setAttribute('name', 'arrow-right');
    } else {
      menu.classList.remove('is-collapsed');
      collapseIcon.setAttribute('name', 'arrow-left');
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

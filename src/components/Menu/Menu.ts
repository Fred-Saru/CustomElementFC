import html from './Menu.html';
import CustomElement from '../../models/custom-element';
import { Icon } from '../Icon/Icon';
import { IMenu, CurrentContext } from '../../data/context-data';
import './Tile/Tile';
import './Link/Link';
import Link, { ILink } from './Link/Link';
import './LinkGroup/LinkGroup';
import Tile from './Tile/Tile';


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
        .addEventListener('click', () => {
          this.collapsed = !this.collapsed
          this.collapse(this.collapsed);
        });
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
    this._updateProperties(['links', 'collapsed']);
    this.initialize(CurrentContext.getAllMenuData());
  }

  static get observedAttributes() {
    return ['collapsed', 'links'];
  }

  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    switch (name) {
      case 'collapsed':
        this.collapse((newValue !== null && newValue !== undefined));
        break;
      case 'links':
        if (newValue) {
          this.renderLinks(JSON.parse(newValue));
        }
        break;
      default:
        throw new Error(`Application ${name} is not supported.`);
    }
  }

  initialize = (menuData: IMenu[]) => {
    const hub = this.shadowRoot.querySelector('#tileList');
    const fragment = document.createDocumentFragment();
    const selectedMenu = CurrentContext.getCurrentMenuData();
    const menus = menuData.sort((a, b) => a.order > b.order ? 1 : -1);
    menus.forEach((menu) => {
      const tile = <Tile>document.createElement('fc-tile');
      tile.tile = { url: menu.url, label: CurrentContext.extractLabel(menu.label), icon: menu.icon };

      if (selectedMenu.order === menu.order) {
        tile.selected = true;
      }

      fragment.appendChild(tile);
    });

    hub.appendChild(fragment);
  }

  renderLinks = (newLinks: ILink[]) => {
    const menuContainer = this.shadowRoot.querySelector('#menuList');
    const fragment = document.createDocumentFragment();

    newLinks.forEach((newLink) => {
      const link = newLink.clickable ? <Link>document.createElement('fc-link') : <Link>document.createElement('fc-link-group');
      link.link = newLink;
      fragment.appendChild(link);
    });

    menuContainer.appendChild(fragment);
  };

  resizeHandler = () => {
    var width = window.innerWidth;
    if (width < 1280 || this.collapsed) {
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
      const menu = menus[i];
      if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        (<Icon>menu.parentElement.querySelector('fc-icon')).name = 'arrow-up';
      } else {
        menu.classList.add('hidden');
        (<Icon>menu.parentElement.querySelector('fc-icon')).name = 'arrow-down';
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
      collapseIcon.name = 'arrow-right';
    } else {
      menu.classList.remove('is-collapsed');
      collapseIcon.name = 'arrow-left';
    }
  }

  get collapsed() {
    return this.hasAttribute('collapsed');
  }

  set collapsed(collapse) {
    if (collapse) {
      this.setAttribute('collapsed', '');
    } else {
      this.removeAttribute('collapsed');
    }
  }

  get links(): ILink[] {
    return <ILink[]>JSON.parse(this.getAttribute('links'));
  }

  set links(newLinks: ILink[]) {
    this.setAttribute('links', JSON.stringify(newLinks));
  }
}

window.customElements.define('fc-menu', Menu);

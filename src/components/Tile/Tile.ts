import html from './Tile.html';
import CustomElement from "../../models/custom-element";

export interface ITile {
  url: string;
  label: string;
  icon: string;
}

export default class Tile extends CustomElement {
  constructor() {
    super();

    this._template = document.createElement('template');
    this._template.innerHTML = html;
    this._prepareTemplate('fc-tile');
    this._styleElement();

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(this._template.content.cloneNode(true));
    }

  }

  connectedCallback() {
    this.renderTile(this.tile);
  }

  static get observedAttributes(): string[] {
    return ['tile', 'isSelected'];
  }

  attributeChangedCallback = (name: string, oldValue: any, newValue: any) => {
    switch (name) {
      case 'tile':
        this.renderTile(newValue);
        break;
      case 'isSelected':
        this.changeSelection(newValue);
        break;
      default:
        throw new Error(`Attributes ${name} is not supported.`);
    }
  }

  changeSelection = (shouldSelect: boolean) => {
    const tileContainer = this.shadowRoot.querySelector('#tileContainer');
    const isSelected = tileContainer.classList.contains('selected');
    if (shouldSelect && !isSelected) {
      tileContainer.classList.add('selected');
    } else if (!shouldSelect && isSelected) {
      tileContainer.classList.remove('selected');
    }
  }

  renderTile = (tile: ITile) => {
    const tileContainer = this.shadowRoot.querySelector('#tileContainer');
    if (this.isSelected) {
      tileContainer.classList.add('selected');
    }

    const tileLink = tileContainer.querySelector('#tileLink');
    tileLink.setAttribute('href', tile.url);
    tileLink.querySelector('fc-icon').setAttribute('name', tile.icon);
    tileLink.querySelector('span').textContent = tile.label;
  };

  get tile(): ITile {
    return <ITile>JSON.parse(this.getAttribute('tile'));
  }

  set tile(newTile: ITile) {
    this.setAttribute('url', JSON.stringify(newTile));
  }

  get isSelected(): boolean {
    return this.hasAttribute('selected');
  }
}

window.customElements.define('fc-tile', Tile);
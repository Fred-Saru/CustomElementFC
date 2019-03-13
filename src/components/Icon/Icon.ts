import html from './Icon.html';
import CustomElement from '../../models/custom-element';
declare function require(path: string): any;

const iconNames = [
  'arrow-down',
  'arrow-left',
  'arrow-right',
  'arrow-up',
  'close',
  'email',
  'exact-search',
  'fab',
  'fil',
  'fla',
  'free-search',
  'help',
  'ingredient',
  'mp',
  'off',
  'refcom',
  'sample',
  'search',
  'settings',
  'socle',
  'substance',
  'supplier',
  'techno',
  'triangle-down',
  'triangle-up'
];

let icons: any = {};

iconNames.forEach((name: string) => {
  icons[name.toLowerCase()] = require(`./icons/${name}.svg`);
});

export class Icon extends CustomElement {
  _acceptedColors: string[] = [
    'pink',
    'purple',
    'red',
    'blue',
    'orange',
    'white',
    'black'
  ];

  constructor() {
    super();

    this._template = document.createElement('template');
    this._template.innerHTML = html;
    this._prepareTemplate('fc-icon');
    this._styleElement();
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(this._template.content.cloneNode(true));
    }
  }

  static get observedAttributes() {
    return ['name', 'size', 'color'];
  }

  connectedCallback() {
    this.shadowRoot.querySelector('#icon-container').innerHTML =
      icons[`${this.name}`];
  }

  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    switch (name) {
      case 'name':
        this.shadowRoot.querySelector('#icon-container').innerHTML =
          icons[`${this.name}`];
        break;
      case 'size':
        const container = <HTMLElement>(
          this.shadowRoot.querySelector('#icon-container')
        );
        container.style.width = newValue + 'px';
        container.style.height = newValue + 'px';
        break;
      case 'color':
        if (this.checkColorValue(newValue)) {
          const iconContainer = this.shadowRoot.querySelector(
            '#icon-container'
          );
          iconContainer.classList.remove(oldValue);
          iconContainer.classList.add(newValue);
        }
        break;
      default:
        throw new Error(`Attribute ${name} is not supported.`);
    }
  }

  get name() {
    return this.getAttribute('name');
  }

  set name(newName: string) {
    this.setAttribute('name', newName.toLowerCase());
  }

  get size() {
    return this.getAttribute('size');
  }

  set size(newSize: string) {
    if (typeof Number(newSize) === 'number') {
      this.setAttribute('size', newSize);
    }
  }

  get color() {
    return this.getAttribute('color');
  }

  set color(newColor: string) {
    if (this.checkColorValue(newColor)) {
      this.setAttribute('color', newColor);
    }
  }

  checkColorValue(newColor: string): boolean {
    return this._acceptedColors.indexOf(newColor) != -1;
  }
}

window.customElements.define('fc-icon', Icon);

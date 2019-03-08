declare function require(path: string): any;

const iconNames = [
  'arrow-down',
  'arrow-left',
  'arrow-right',
  'arrow-up',
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
];

let icons: any = {};

iconNames.forEach((name: string) => {
  icons[name.toLowerCase()] = require(`./icons/${name}.svg`);
});

export class Icon extends HTMLElement {

  static get observedAttributes() {
    return ['name'];
  }

  createdCallback() {
    this.innerHTML = icons[`${this.name}`];
  }

  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    if (name === 'name') {
      this.innerHTML = icons[`${this.name}`];
    }
  }

  get name() {
    return this.getAttribute('name');
  }

  set name(newName: string) {
    this.setAttribute('name', newName.toLowerCase());
  }
}

window.customElements.define('fc-icon', Icon);
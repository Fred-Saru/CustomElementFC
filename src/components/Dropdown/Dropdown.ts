import html from './Dropdown.html';
import CustomElement from '../../models/custom-element';
import { eventFire } from '../../utils/misc';

export interface IDropdownItem {
  label: string;
  value: string;
}

export default class Dropdown extends CustomElement {
  constructor() {
    super();

    this._template = document.createElement('template');
    this._template.innerHTML = html;
    this._prepareTemplate('fc-dropdown');
    this._styleElement();

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(this._template.content.cloneNode(true));
      this.shadowRoot.querySelector('#dropdownBtn').addEventListener('click', this._showDropdown);
      document.addEventListener('click', this._handleHideDropdown);
      this.shadowRoot.querySelector('#dropdownList').addEventListener('click', (e: MouseEvent) => {
        this.value = (<any>e.target).getAttribute('value');
        this._hideDropdown();
      });
    }
  }

  static get observedAttributes() {
    return ['value', 'items'];
  }

  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    switch (name) {
      case 'value':
        if (newValue !== oldValue) {
          this.selectDefault();
        }
        break;
      case 'items':
        this.renderDropdownList(JSON.parse(newValue));
        this.selectDefault();
        break;
      default:
        throw new Error(`Attribute ${name} is currently not handled.`);
    }
  }


  selectDefault = () => {
    let selectedItem: IDropdownItem;

    if (this.value === null || this.value === undefined) {
      selectedItem = this.items[0];
    } else {
      this.items.forEach((item: IDropdownItem) => {
        if (this.value == item.value) {
          selectedItem = item;
        }
      });
    }
    this.selectItem(selectedItem);
  }

  selectItem(item: IDropdownItem) {
    this.value = item.value;
    this.shadowRoot.querySelector('#btnLabel').textContent = item.label;
    eventFire(this, 'change');
  }

  renderDropdownList = (items: IDropdownItem[]) => {
    const dropdownList = this.shadowRoot.querySelector('#dropdownList');
    dropdownList.innerHTML = "";

    const fragment = document.createDocumentFragment();

    items.forEach((item: IDropdownItem) => {
      const li = document.createElement('li');
      li.setAttribute('value', item.value);
      li.innerText = item.label;
      li.classList.add('dropdown-item');
      li.classList.add('style-scope');
      li.classList.add('fc-dropdown');

      fragment.appendChild(li);
    });

    dropdownList.appendChild(fragment);
  }

  _handleHideDropdown = (e: Event) => {
    if (!this.isOpen) { return; }

    const dropdown = this.shadowRoot.querySelector('#dropdownContainer');
    if (!dropdown.contains(<Node>e.target)) {
      this._hideDropdown();
    }
  }

  _showDropdown = (e: Event) => {
    e.stopPropagation();
    (<HTMLElement>this.shadowRoot.querySelector('#dropdownList')).classList.remove('hide');
  }

  _hideDropdown = () => {
    (<HTMLElement>this.shadowRoot.querySelector('#dropdownList')).classList.add('hide');
  }

  get items(): IDropdownItem[] {
    return <IDropdownItem[]>JSON.parse(this.getAttribute('items'));
  }

  set items(newValue: IDropdownItem[]) {
    this.setAttribute('items', JSON.stringify(newValue));
  }

  get isOpen() {
    return !this.shadowRoot.querySelector('#dropdownList').classList.contains('hide');
  }

  get value() {
    return this.getAttribute('value');
  }

  set value(newValue: string) {
    this.setAttribute('value', newValue);
  }
}

window.customElements.define('fc-dropdown', Dropdown);
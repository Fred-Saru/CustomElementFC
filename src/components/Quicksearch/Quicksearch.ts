import CustomElement from '../../models/custom-element';
import html from './Quicksearch.html';
import { CurrentContext, ISearch } from '../../data/context-data';
import '../Dropdown/Dropdown';
import Dropdown from '../Dropdown/Dropdown';
import { Icon } from '../Icon/Icon';

export default class Quicksearch extends CustomElement {
  _searchData: ISearch[];
  _selectedItem: ISearch;
  _isExact: boolean = true;


  constructor() {
    super();

    this._template = document.createElement('template');
    this._template.innerHTML = this._translate(html);
    this._prepareTemplate('fc-shutter-preference');
    this._styleElement();

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(this._template.content.cloneNode(true));
      this.shadowRoot.querySelector('#searchType').addEventListener('click', this.handleSearchTypeClick);
      this.shadowRoot.querySelector('#searchBtn').addEventListener('click', this.handleSearchClick);
      this.shadowRoot.querySelector('#searchDropdown').addEventListener('change', this.handleSelectionChange);
    }
  }

  connectedCallback() {
    this.initialize(CurrentContext.getAllSearchData());
  }

  initialize(searchData: ISearch[]) {
    this._searchData = searchData;
    const items: any[] = [];

    this._searchData.forEach((app, idx) => {
      const label = CurrentContext.extractLabel(app.label);
      items.push({ label: label, value: idx });
    });

    (<Dropdown>this.shadowRoot.querySelector('#searchDropdown')).items = items;
  }

  updatePlaceholder = () => {
    if (!this._selectedItem) {
      return;
    }

    const placeholder = this._isExact ? CurrentContext.extractLabel(this._selectedItem.exactSearch.placeholder) : CurrentContext.extractLabel(this._selectedItem.freeSearch.placeholder);
    (<HTMLInputElement>this.shadowRoot.querySelector('#searchInput')).placeholder = placeholder;
  }

  handleSearchTypeClick = () => {
    const typeBtn = this.shadowRoot.querySelector('#searchType');
    if (this._isExact) {
      this._isExact = false;
      (<Icon>typeBtn.querySelector('fc-icon')).name = 'free-search';
    } else {
      this._isExact = true;
      (<Icon>typeBtn.querySelector('fc-icon')).name = 'exact-search';
    }

    this.updatePlaceholder();
  }

  handleSelectionChange = () => {
    const index = parseInt(this.shadowRoot.querySelector('#searchDropdown').getAttribute('value'));
    this._selectedItem = this._searchData[index];
    this.updatePlaceholder();
  }

  handleSearchClick = () => {
    const searchConf = this._isExact ? this._selectedItem.exactSearch : this._selectedItem.freeSearch;
    let term = (<HTMLInputElement>this.shadowRoot.querySelector('#searchInput')).value;
    const url = searchConf.url;
    if (searchConf.formattingOptions) {
      if (searchConf.formattingOptions.trim) {
        term = term.trim();
      }

      if (searchConf.formattingOptions.characterCasing === "upper") {
        term = term.toUpperCase();
      } else if (searchConf.formattingOptions.characterCasing === "lower") {
        term = term.toLowerCase();
      }
    }

    window.location.href = url.replace('{term}', encodeURIComponent(term));
  }
}

window.customElements.define('fc-quicksearch', Quicksearch);

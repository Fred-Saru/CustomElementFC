import html from './Header.html';
import CustomElement from '../../utils/custom-element';
import { ServiceProvider, CommonServices } from '../../utils/service-provider';
import '../Shutter/Preferences/Preferences';
import { IPreferenceShutter } from '../Shutter/Preferences/Preferences';
import '../Quicksearch/Quicksearch';

export default class Header extends CustomElement {
  constructor() {
    super();

    this._template = document.createElement('template');
    this._template.innerHTML = html;
    this._prepareTemplate(this._template, 'fc-header');
    this._styleElement();

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(this._template.content.cloneNode(true));
      this.shadowRoot
        .querySelector('#open-btn')
        .addEventListener('click', () => {
          ServiceProvider.Instance.getService<IPreferenceShutter>(
            CommonServices.PreferenceShutterService
          ).open(null);
        });
      window.addEventListener('resize', this.resizeHandler);
      this.resizeHandler();
    }
  }

  resizeHandler = () => {
    const width = window.innerWidth;
    const zone = this.shadowRoot.querySelector('.application-zone');
    if (width < 900) {
      if (!zone.classList.contains('hidden')) {
        zone.classList.add('hidden');
      }
    } else {
      if (zone.classList.contains('hidden')) {
        zone.classList.remove('hidden');
      }
    }
  };
}

window.customElements.define('fc-header', Header);

import html from './Header.html';
import CustomElement from '../../utils/custom-element';
import { ServiceProvider, CommonService } from '../../utils/service-provider';
import { IShutterService } from '../../utils/shutter-service';
import Shutter from '../Shutter/Shutter';

export default class Header extends CustomElement {
  constructor() {
    super();

    this.template = document.createElement('template');
    this.template.innerHTML = html;
    this._prepareTemplate(this.template, 'fc-header');
  }

  connectedCallback() {
    this._styleElement();

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(this.template.content.cloneNode(true));
      this.shadowRoot.querySelector("#shutterOpener").addEventListener('click', () => {
        //ServiceProvider.Instance.getService<IShutterService>(CommonService.ShutterService).open("", null);
        (<Shutter>document.querySelector('fc-shutter')).open();
      });
    }
  }
}

window.customElements.define('fc-header', Header);
import html from './Link.html';
import CustomElement from "../../../models/custom-element";

export interface ILink {
  target: LinkTarget;
  url: string;
  parameters: string[];
  label: string;
  children: ILink[];
  clickable: boolean;
}

export declare type LinkTarget = "self" | "blank";

export default class Link extends CustomElement {
  _defaultTarget: LinkTarget = 'self';

  constructor() {
    super();

    this._template = document.createElement('template');
    this._template.innerHTML = html;
    this._prepareTemplate('fc-link');
    this._styleElement();

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(this._template.content.cloneNode(true));
    }
  }

  connectedCallback() {
    this.renderLink(this.link);
  }

  renderLink = (link: ILink) => {
    const linkEl = <HTMLAnchorElement>this.shadowRoot.querySelector('#linkHead');
    this.createAnchor(link, linkEl);

    if (link.children) {
      const childrenContainer = this.shadowRoot.querySelector('#linkChildren');
      const fragment = document.createDocumentFragment();
      link.children.forEach(child => {
        const li = document.createElement('li');
        const anchor = this.createAnchor(child);
        li.appendChild(anchor);
        fragment.appendChild(li);
      })
      childrenContainer.appendChild(fragment);
    }
  }

  createAnchor(link: ILink, anchor?: HTMLAnchorElement) {
    if (!anchor) {
      anchor = document.createElement('a');
      anchor.classList.add('sublink');
      anchor.classList.add('style-scope');
      anchor.classList.add('fc-link');
    }

    anchor.href = link.url;
    anchor.textContent = link.label;
    link.target = link.target || this._defaultTarget;
    anchor.target = `_${link.target}`;
    return anchor;
  }

  get link(): ILink {
    return <ILink>JSON.parse
      (this.getAttribute('link'));
  }

  set link(newLink: ILink) {
    this.setAttribute('link', JSON.stringify(newLink));
  }


}

window.customElements.define('fc-link', Link);
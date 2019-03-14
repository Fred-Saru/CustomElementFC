import html from './LinkGroup.html';
import CustomElement from "../../../models/custom-element";
import { LinkTarget, ILink } from '../Link/Link';
import { Icon } from '../../Icon/Icon';

export default class LinkGroup extends CustomElement {
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
      this.shadowRoot.querySelector('#grouHead').addEventListener('click', this.handleGroupClick);
    }
  }

  connectedCallback() {
    this.renderLink(this.link);
  }

  handleGroupClick = () => {
    const childrenList = this.shadowRoot.querySelector('#linkChildren');
    if (childrenList.classList.contains('hidden')) {
      childrenList.classList.remove('hidden');
      (<Icon>this.shadowRoot.querySelector('#grouHead fc-icon')).name = 'arrow-up';
    } else {
      childrenList.classList.add('hidden');
      (<Icon>this.shadowRoot.querySelector('#grouHead fc-icon')).name = 'arrow-down';
    }
  }

  renderLink = (link: ILink) => {
    const groupEl = <HTMLSpanElement>this.shadowRoot.querySelector('#groupHead');
    groupEl.textContent = link.label;

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

window.customElements.define('fc-link-group', LinkGroup);
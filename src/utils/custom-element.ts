import * as i18next from 'i18next';
import './translation-data';
import './translation-service';
import { i18n as ___i18n } from './translation-service';

export default class CustomElement extends HTMLElement {
  template: HTMLTemplateElement;

  public _i18n(key: string, options?: i18next.TranslationOptions): string {
    if (!key) {
      return null;
    }

    if (key.indexOf(':') === -1) {
      key = `${this._getTranslationModuleName()}:${key}`;
    }
    return ___i18n(key, options);
  }

  templateVar = /\[\[(.+)\]\]/g;
  public _translate(template: string): string {
    return template.replace(this.templateVar, (substring: string, ...args: any[]) => {
      return this._i18n(args[0]);
    });
  }

  public _prepareTemplate(template: HTMLTemplateElement, key: string): void {
    const ieWindow = (<any>window).ShadyCSS;
    ieWindow && ieWindow.prepareTemplate(template, key);
  }

  public _styleElement() {
    const ieWindow = (<any>window).ShadyCSS;
    ieWindow && ieWindow.styleElement(this);
  }

  public _getTranslationModuleName(): string {
    return this.nodeName.toLowerCase();
  }
}
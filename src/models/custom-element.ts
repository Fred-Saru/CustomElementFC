import * as i18next from 'i18next';
import '../services/translation-data';
import '../services/translation-service';
import { i18n as ___i18n } from '../services/translation-service';

export default class CustomElement extends HTMLElement {
  _template: HTMLTemplateElement;

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
    return template.replace(
      this.templateVar,
      (substring: string, ...args: any[]) => {
        return this._i18n(args[0]);
      }
    );
  }

  public _prepareTemplate(key: string): void {
    const ieWindow = (<any>window).ShadyCSS;
    ieWindow && ieWindow.prepareTemplate(this._template, key);
  }

  public _styleElement() {
    const ieWindow = (<any>window).ShadyCSS;
    ieWindow && ieWindow.styleElement(this);
  }

  public _getTranslationModuleName(): string {
    return this.nodeName.toLowerCase();
  }
}

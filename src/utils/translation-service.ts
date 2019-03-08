import { ServiceProvider, CommonServices } from './service-provider';
import * as i18next from 'i18next';
import InternationalHelper from './intl-helper';
import { i18n } from 'i18next';

interface ITranslationService {
  setLanguage(language: string): void;
  mergeResources(resources: any): void;
  translate(key: string, options?: any): string;
}

class TranslationService implements ITranslationService {
  private _language: string;
  private _shouldConfigure: boolean;
  private _mergedResources: i18next.Resource = {};


  public setLanguage(language: string): void {
    if (this._language != language) {
      this._language = language;
    }
  }

  public mergeResources(resources: i18next.Resource): void {
    if (!resources) {
      return;
    }

    for (let language in resources) {
      const source = resources[language];
      if (source) {
        let dest = this._mergedResources[language];
        if (!dest) {
          dest = {};
          this._mergedResources[language] = dest;
        }
        for (let key in source) {
          const current = source[key];
          if (!current) {
            continue;
          }
          // case of a module
          if (typeof current === 'object') {
            let destModule = dest[key];
            if (typeof destModule === 'string') {
              throw new Error(`Source is a module, found a resource key in dest (${language}:${key}).`);
            }
            if (!destModule) {
              destModule = {};
              dest[key] = destModule;
            }
            for (let resourceKey in current) {
              let resourceString = current[resourceKey];
              if (!resourceString) {
                continue;
              }
              if (typeof resourceString === 'string') { // resource string
                if (destModule[resourceKey]) {
                  console.warn(`Resource key ${language}:${key}:${resourceKey} is already present. Content will be overridden.`);
                }
                destModule[resourceKey] = resourceString;
                this._shouldConfigure = true;
              }
              else {
                throw new Error(`Resource type ${typeof resourceString} is not supported.`);
              }
            }
          }
          // case of a resource
          else if (typeof current === 'string') {
            if (dest[key]) {
              console.warn(`Resource key ${language}:${key} is already present and will be overridden.`);
              dest[key] = current;
              this._shouldConfigure = true;
            }
          } else {
            throw new Error(`Resource type ${typeof current} is not supported.`);
          }
        }
      }
    }
  }

  public translate(key: string, options?: i18next.TranslationOptions): string {
    this.ensureInitialized();
    return i18next.t(key, options);
  }

  private ensureInitialized(): void {
    if (this._shouldConfigure) {
      if (!this._language || this._language === '') {
        this._language = InternationalHelper.getPageLocale();
      }
      i18next.init({
        lng: this._language,
        fallbackLng: InternationalHelper.FallbackLocale,
        resources: this._mergedResources
      });
      this._shouldConfigure = false;
    }
  }

}

export function i18n_init(resources: i18next.Resource) {
  ServiceProvider.Instance.getService<ITranslationService>(CommonServices.TranslationService).mergeResources(resources);
}

export function i18n(key: string, options?: i18next.TranslationOptions): string {
  return ServiceProvider.Instance.getService<ITranslationService>(CommonServices.TranslationService).translate(key, options);
}

ServiceProvider.Instance.registerService(
  CommonServices.TranslationService,
  new TranslationService()
);
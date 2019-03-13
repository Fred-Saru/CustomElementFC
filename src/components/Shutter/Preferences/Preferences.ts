import '../../../services/shutter-service';
import {
  IShutterView,
  IShutterWrapper,
  ResolveCallback,
  IShutterService
} from '../../../services/shutter-service';
import CustomElement from '../../../models/custom-element';
import {
  ServiceProvider,
  CommonServices
} from '../../../services/service-provider';
import html from './Preference.html';

export class PreferencesShutterComponent extends CustomElement
  implements IShutterView<null, null> {
  constructor() {
    super();

    this._template = document.createElement('template');
    this._template.innerHTML = html;
    this._prepareTemplate('fc-shutter-preference');
    this._styleElement();

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(this._template.content.cloneNode(true));
    }
  }

  activate(
    args: null,
    shutter: IShutterWrapper,
    resolveCallback: ResolveCallback<null>
  ): void {
    shutter.title = "coucou c'est nous";
  }

  dispose(): void { }
}

window.customElements.define(
  'fc-shutter-preference',
  PreferencesShutterComponent
);

export interface IPreferenceShutter {
  open(args: null): Promise<null>;
}

const preferenceShutterKey: string = 'preference-shutter-key';

class PreferenceShutter implements IPreferenceShutter {
  open(args: null): Promise<null> {
    const shutter = ServiceProvider.Instance.getService<IShutterService>(
      CommonServices.ShutterService
    );
    return shutter.open<null, null>(preferenceShutterKey, args);
  }
}

(() => {
  const shutter = ServiceProvider.Instance.getService<IShutterService>(
    CommonServices.ShutterService
  );
  shutter.register(preferenceShutterKey, 'fc-shutter-preference');
  ServiceProvider.Instance.registerService(
    CommonServices.PreferenceShutterService,
    new PreferenceShutter()
  );
})();

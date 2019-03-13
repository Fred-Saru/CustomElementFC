import { ServiceProvider, CommonServices } from "./service-provider";
import { IMap } from "../utils/collections";

export declare type ShutterSize = 'full' | 'wide' | 'small';
export declare type ShutterSide = 'left' | 'right';

export interface IShutterService {
  register(key: string, viewName: string, options?: IShutterViewOption): void;
  open<TArgs, TResult>(key: string, args?: TArgs): Promise<TResult>;
}

export interface IShutterViewOption {
  shutterSize?: ShutterSize;
  shutterSide?: ShutterSide;
}

export interface IShutterViewRegistration {
  viewName: string;
  options: IShutterViewOption;
}

export interface IShutterWrapper {
  queryClose(): void;
  title: string;
}

class ShutterWrapper implements IShutterWrapper {
  private _shutter: IShutterComponent;

  get title(): string {
    return this.shutter.header;
  }

  set title(value: string) {
    this.shutter.header = value;
  }

  get shutter(): IShutterComponent {
    this.ensureShutter();
    return this._shutter;
  }

  get shutterContent(): HTMLElement {
    this.ensureShutter();
    return this._shutter.content;
  }

  private ensureShutter(): void {
    if (!this._shutter) {
      this._shutter = <IShutterComponent><any>document.querySelector('fc-shutter');
      if (!this._shutter) {
        throw new Error(`No shutter where found in the page.`);
      }
    }
  }

  public queryClose(): void {
    if (this._shutter) {
      this._shutter.close();
    }
  }
}

interface IShutterComponent extends HTMLElement {
  isOpen: boolean;
  size: string;
  side: string;
  content: HTMLElement;
  header: string;
  open(): void;
  close(): void;
}

export declare type ResolveCallback<TResult> = (result: TResult) => void;

export interface IShutterView<TArgs, TResult> extends HTMLElement {
  dispose(): void;
  activate(args: TArgs, shutter: IShutterWrapper, resolveCallback: ResolveCallback<TResult>): void;
}

export class ShutterService implements IShutterService {
  private _registrations: IMap<IShutterViewRegistration> = {};
  private _host: ShutterWrapper;

  public constructor() {
    this._host = new ShutterWrapper();
  }

  public register(key: string, viewName: string, options?: IShutterViewOption): void {
    options = options || {};
    options.shutterSize = options.shutterSize;
    options.shutterSide = options.shutterSide;

    this._registrations[key] = {
      viewName: viewName,
      options: options
    };
  }

  private checkView<TArgs, TResult>(view: IShutterView<TArgs, TResult>): boolean {
    if (!view) {
      return false;
    }
    if (typeof view.activate !== 'function') {
      return false;
    }
    if (typeof view.dispose !== 'function') {
      return false;
    }
    return true;
  }

  public open<TArgs, TResult>(key: string, args?: TArgs): Promise<TResult> {
    return new Promise<TResult>((resolve, reject) => {
      if (!this._host) {
        reject(new Error('Service has not been initialized.'));
      }

      let registration = this._registrations[key];
      if (!registration || !registration.viewName || registration.viewName === '') {
        reject(new Error(`No view registered for key ${key}`));
      }

      let view = <IShutterView<TArgs, TResult>><any>document.createElement(registration.viewName);
      if (!this.checkView(view)) {
        reject(new Error(`Invalid view implementation (component name: ${registration.viewName}`));
      }

      const shutter = this._host.shutter;
      shutter.header = '';
      shutter.size = registration.options.shutterSize;

      if (shutter.isOpen) {
        shutter.close();
      }

      let isResolved = false;
      const resolveCallback = (value?: TResult | Promise<TResult>) => {
        shutter.close();
        isResolved = true;
        resolve(value);
      };
      const closeCallback = () => {
        if (view) {
          view.dispose();
          shutter.content = null;
          view = null;
          shutter.removeEventListener('closed', closeCallback);
          if (!isResolved) {
            isResolved = true;
            resolve(null);
          }
        }
      };

      shutter.addEventListener('closed', closeCallback);
      shutter.content = view;
      view.activate(args, this._host, resolveCallback);
      shutter.open();
    });
  }
}

let service = new ShutterService();
ServiceProvider.Instance.registerService(CommonServices.ShutterService, service);
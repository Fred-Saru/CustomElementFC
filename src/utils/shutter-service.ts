import { IMap } from "./collections";
import { ServiceProvider, CommonService } from "./service-provider";

export declare type ShutterSize = 'large' | 'small';

export interface IShutterService {
  register(key: string, viewName: string, options?: IShutterViewOption): void;
  open<TArgs, TResult>(key: string, args?: TArgs): Promise<TResult>;
}

export interface IShutterViewOption {
  shutterSize?: ShutterSize;
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
  private _shutterId: string;
  private _shutterContentId: string;
  private _shutterContent: HTMLElement;

  constructor(shutterId: string, shutterContentId: string) {
    this._shutterId = shutterId;
    this._shutterContentId = shutterContentId;
  }

  get title(): string {
    return this.shutter.titleBar;
  }

  set title(value: string) {
    this.shutter.titleBar = value;
  }

  get shutter(): IShutterComponent {
    this.ensureShutter();
    return this._shutter;
  }

  get shutterContent(): HTMLElement {
    this.ensureShutterContent();
    return this._shutterContent;
  }

  private ensureShutter(): void {
    if (!this._shutter) {
      this._shutter = <IShutterComponent><any>document.getElementById(this._shutterId);
      if (!this._shutter) {
        throw new Error(`shutter with id ${this._shutterId} not found`);
      }
    }
  }

  private ensureShutterContent(): void {
    if (!this._shutterContent) {
      this._shutterContent = <IShutterComponent><any>document.getElementById(this._shutterContentId);
      if (!this._shutter) {
        throw new Error(`shutter content with id ${this._shutterContentId} not found`);
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
  isOpened: boolean;
  size: string;
  titleBar: string;
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

  public initialize(shutterId: string, shutterContentId: string): void {
    this._host = new ShutterWrapper(shutterId, shutterContentId);
  }

  public register(key: string, viewName: string, options?: IShutterViewOption): void {
    options = options || {};
    options.shutterSize = options.shutterSize || 'small';

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

      const shutterContent = this._host.shutterContent;
      const shutter = this._host.shutter;
      shutter.titleBar = '';
      shutter.size = registration.options.shutterSize;

      if (shutter.isOpened) {
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
          shutterContent.removeChild(view);
          view = null;
          shutter.removeEventListener('closed', closeCallback);
          if (!isResolved) {
            isResolved = true;
            resolve(null);
          }
        }
      };

      shutter.addEventListener('closed', closeCallback);
      shutterContent.appendChild(view);
      view.activate(args, this._host, resolveCallback);
      shutter.open();
    });
  }
}

export function loadShutterContent(content: HTMLElement) {
  document.getElementById('shutter-content').appendChild(content);
}

export function overrideShutterContent(content: HTMLElement) {
  document.getElementById('shutter-content').innerHTML = <any>content;
}

let service = new ShutterService();
service.initialize('shutter', 'shutter-content');
ServiceProvider.Instance.registerService(CommonService.ShutterService, service);
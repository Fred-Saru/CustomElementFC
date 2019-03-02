export class ServiceProvider {
  public static Instance = new ServiceProvider();

  private _services: any = {};

  private isDisposable(instance: any): boolean {
    return typeof instance.dispose === 'function';
  }

  private isRegistrationAware(instance: any) {
    return typeof instance.onServiceRegistered === 'function';
  }

  public registerService(name: string, instance: any) {
    const oldInstance = this._services[name];
    if (oldInstance && this.isDisposable(oldInstance)) {
      (<IDisposableService>oldInstance).dispose();
    }

    this._services[name] = instance;
    if (instance && this.isRegistrationAware(instance)) {
      (<IRegistrationAwareService>instance).onServiceRegistered(this);
    }
  }

  public getService<TService>(name: string) {
    return <TService>this._services[name];
  }
}

export interface IDisposableService {
  dispose(): void;
}

export interface IRegistrationAwareService {
  onServiceRegistered(serviceProvider: ServiceProvider): void;
}
import { IUser } from "./user-data";

declare var fcSettings: IFormulationCenterSettings;

export interface IFormulationCenterSettings {
  user: IUser;
  appKey: string;
}

export class FcSettings {
  static get user(): IUser {
    return fcSettings.user;
  }

  static get appKey(): string {
    return fcSettings.appKey;
  }

  validateSettings() {
    if (!fcSettings.user) {
      throw new Error('No user has been set in the formulation center settings.');
    }

    if (!fcSettings.appKey) {
      throw new Error('No application key has been set in the formulation center settings.');
    }
  }
}

(() => {
  const settingsValidator = new FcSettings();
  settingsValidator.validateSettings();
})();


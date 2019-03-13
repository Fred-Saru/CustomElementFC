import { FcSettings } from "./settings-data";

export interface IUser {
  roles: string[];
}

export class CurrentUser {

  static isInRole(role: string): boolean {
    return FcSettings.user.roles.indexOf(role) !== -1;
  }

  static get roles(): string[] {
    return FcSettings.user.roles;
  }
}
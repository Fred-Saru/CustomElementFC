declare var currentUser: ICurrentUser;

export interface ICurrentUser {
  roles: string[];
}

export class CurrentUser {
  public static isInRole(role: string): boolean {
    return currentUser.roles.indexOf(role) !== -1;
  }
}
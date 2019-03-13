import { CurrentUser } from "./user-data";
import { FcSettings } from "./settings-data";
import InternationalHelper from "../utils/intl-helper";

declare var currentContext: IApplication[];

export interface IApplication {
  key: string;
  menu: IMenu;
  title: ITitleDisplay;
  quicksearch: ISearch;
}

export interface ITitleDisplay {
  label: ILabel;
  icon: string;
  url: string;
}

export interface IMenu {
  label: ILabel;
  icon: string;
  url: string;
  order: number;
}

export interface ISearch {
  label: ILabel;
  exactSearch: ISearchOption;
  freeSearch: ISearchOption;
}

export interface ISearchOption {
  url: string;
  formattingOptions: ISearchFormattingOptions;
  placeholder: ILabel;
}

export declare type CharaterCasing = 'lower' | 'upper' | null;

export interface ISearchFormattingOptions {
  trim: boolean;
  characterCasing: CharaterCasing;
}

export interface ILabel {
  [key: string]: string
  def: string;
  en: string;
  fr: string;
}

export class CurrentContext {

  private static currentApplication: IApplication;

  public static extractLabel(label: ILabel): string {
    if (label.def) {
      return label.def;
    }

    return label[InternationalHelper.getPageLocale()];
  }

  public static getCurrentTitleData(): ITitleDisplay {
    const application = CurrentContext.getCurrentApplicationData();
    return application.title;
  }

  public static getAllMenuData(): IMenu[] {
    return currentContext.reduce<IMenu[]>((acc: IMenu[], value: IApplication) => {
      if (value.menu) {
        acc.push(value.menu)
      }
      return acc;
    }, []);
  }

  public static getCurrentSearchData(): ISearch {
    const application = CurrentContext.getCurrentApplicationData();
    return application.quicksearch;
  }

  public static getAllSearchData(): ISearch[] {
    return currentContext.reduce<ISearch[]>((acc: ISearch[], value: IApplication) => {
      if (value.quicksearch) {
        acc.push(value.quicksearch)
      }
      return acc;
    }, []);
  }

  public static getCurrentMenuData(): IMenu {
    const application = CurrentContext.getCurrentApplicationData();
    return application.menu;
  }

  public static getCurrentApplicationData(): IApplication {
    if (!CurrentContext.currentApplication) {
      const key = FcSettings.appKey;
      let application: IApplication;
      currentContext.forEach((app: IApplication) => {
        if (app.key.toLowerCase() === key) {
          application = app;
        }
      });

      if (!application) {
        throw new Error(`No application with the key ${key} has been found.`);
      }
      CurrentContext.currentApplication = application;
    }
    return CurrentContext.currentApplication;
  }
}
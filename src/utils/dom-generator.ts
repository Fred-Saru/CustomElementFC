export interface IDomOption {
  classes: string[],
  attributes: any
}

export class DomGenerator {
  static generate(tag: string, options?: IDomOption): HTMLElement {
    const el = document.createElement(tag);

    if (!options) {
      return el;
    }

    if (options.classes) {
      options.classes.map((cssClass) => el.classList.add(cssClass));
    }

    if (options.attributes) {
      const attributes = Object.keys(options.attributes);
      attributes.map((attr) => el.setAttribute(attr, options.attributes[attr]));
    }

    return el;
  }
}
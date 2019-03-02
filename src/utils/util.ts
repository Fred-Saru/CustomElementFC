export default class CustomElement {
  static generate(html: string, style: any) {
    if (style) {
      const styleTag = document.createElement('style');
      styleTag.innerHTML = style;
      html = styleTag.outerHTML + html;
    }

    return html;
  }
}
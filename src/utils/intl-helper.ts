
export default class InternationalHelper {
  static FallbackLocale = 'fr';

  static getPageLocale(): string {
    let locale = null;
    const page = document.querySelector('html');
    if (page) {
      locale = page.getAttribute('lang');
    }

    return locale || InternationalHelper.FallbackLocale;
  }

  static getDecimalSeparator(): string {
    const locale = InternationalHelper.getPageLocale();
    return locale === 'fr' ? ',' : '.';
  }

}
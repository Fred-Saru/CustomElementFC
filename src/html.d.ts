declare module '*.html' {
  const value: string;
  export default value;
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export = content;
}

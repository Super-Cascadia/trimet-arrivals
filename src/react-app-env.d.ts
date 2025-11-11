/// <reference types="react-scripts" />

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
  interface ElementClass {
    render?: any;
  }
}

declare module 'react-fontawesome' {
  const FontAwesome: any;
  export default FontAwesome;
}

declare module 'react-select' {
  const Select: any;
  export default Select;
}

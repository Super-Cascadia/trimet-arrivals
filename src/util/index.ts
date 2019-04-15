// tslint:disable
export const notImplemented = (e: any | null) => {
  e.preventDefault();
  e.stopPropagation();
  console.warn("not implemented");
};

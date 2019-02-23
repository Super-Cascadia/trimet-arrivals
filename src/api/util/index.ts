export function fixtureEnabled() {
  return (
    process.env.REACT_APP_USE_FIXTURE &&
    process.env.REACT_APP_USE_FIXTURE === "true"
  );
}

export function useDefaultPortlandLocation() {
  return (
    process.env.REACT_APP_USE_DEFAULT_PORTLAND_LOCATION &&
    process.env.REACT_APP_USE_DEFAULT_PORTLAND_LOCATION === "true"
  );
}

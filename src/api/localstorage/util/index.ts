export function fetchLocalStorageItemByKey(key: string) {
  return JSON.parse(localStorage.getItem(key)) || {};
}

export function updateStoredItemByKey(key: string, content) {
  localStorage.setItem(key, JSON.stringify(content));
}

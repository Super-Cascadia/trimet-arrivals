import { fetchLocalStorageItemByKey, updateStoredItemByKey } from "./util";
import { StopLocation } from "../trimet/interfaces/types";
import { storeLocationBookmark, removeStoredBookmark, fetchStoredBookmarks } from "./bookmarks.localstorage";
import { getStore } from "../../store/store";
import { CREATE_STOP_BOOKMARK, REMOVE_STOP_BOOKMARK } from "../../store/constants";

export const ROUTE_BOOKMARKS = "ROUTE_BOOKMARKS";

export interface RouteBookmark {
  routeId: number;
  stopId: number;
  direction: number;
  routeDesc?: string;
  stopDesc?: string;
  timestamp: number;
}

export interface StoredRouteBookmarks {
  [key: string]: RouteBookmark; // key format: "routeId-stopId-direction"
}

export function fetchStoredRouteBookmarks(): StoredRouteBookmarks {
  return fetchLocalStorageItemByKey(ROUTE_BOOKMARKS);
}

function updateRouteBookmarks(bookmarks: StoredRouteBookmarks) {
  updateStoredItemByKey(ROUTE_BOOKMARKS, bookmarks);
}

export function getRouteBookmarkKey(routeId: number, stopId: number, direction: number): string {
  return `${routeId}-${stopId}-${direction}`;
}

export function storeRouteBookmark(
  routeId: number,
  stopId: number,
  direction: number,
  routeDesc?: string,
  stopDesc?: string,
  stopLocation?: StopLocation
) {
  const existingBookmarks = fetchStoredRouteBookmarks();
  const key = getRouteBookmarkKey(routeId, stopId, direction);

  existingBookmarks[key] = {
    routeId,
    stopId,
    direction,
    routeDesc,
    stopDesc,
    timestamp: Date.now()
  };

  updateRouteBookmarks(existingBookmarks);
  
  // Also bookmark the stop in the main bookmarks system
  if (stopLocation) {
    storeLocationBookmark(stopLocation);
    
    // Update Redux state
    const store = getStore();
    if (store) {
      store.dispatch({
        type: CREATE_STOP_BOOKMARK,
        payload: { stopLocation }
      });
    }
  }
}

export function removeRouteBookmark(routeId: number, stopId: number, direction: number) {
  const bookmarks = fetchStoredRouteBookmarks();
  const key = getRouteBookmarkKey(routeId, stopId, direction);
  
  delete bookmarks[key];
  updateRouteBookmarks(bookmarks);
  
  // Check if any other routes at this stop are still bookmarked
  const hasOtherBookmarksAtStop = Object.values(bookmarks).some(
    bookmark => bookmark.stopId === stopId
  );
  
  // Only remove the stop bookmark if no routes at this stop are bookmarked
  if (!hasOtherBookmarksAtStop) {
    const stopBookmarks = fetchStoredBookmarks();
    if (stopBookmarks[stopId]) {
      removeStoredBookmark(stopId);
      
      // Update Redux state
      const store = getStore();
      if (store) {
        store.dispatch({
          type: REMOVE_STOP_BOOKMARK,
          payload: { locationId: stopId }
        });
      }
    }
  }
}

export function isRouteBookmarked(routeId: number, stopId: number, direction: number): boolean {
  const bookmarks = fetchStoredRouteBookmarks();
  const key = getRouteBookmarkKey(routeId, stopId, direction);
  return !!bookmarks[key];
}

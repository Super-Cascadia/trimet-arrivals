import { fetchLocalStorageItemByKey, updateStoredItemByKey } from "./util";
import { StopLocation } from "../trimet/interfaces/types";

export const BOOKMARK_GROUPS = "BOOKMARK_GROUPS_V2";
export const DEFAULT_GROUP_ID = "default";

export type BookmarkType = "route" | "stop";

export interface BookmarkItem {
  id: string; // unique identifier for this bookmark
  type: BookmarkType;
  stopId: number;
  stopDesc?: string;
  stopLat?: number;
  stopLng?: number;
  routeId?: number; // only for route bookmarks
  routeDesc?: string; // only for route bookmarks
  direction?: number; // only for route bookmarks
  directionDesc?: string; // only for route bookmarks
  destinationStopId?: number; // only for route bookmarks with destination
  destinationStopDesc?: string; // only for route bookmarks with destination
  timestamp: number;
}

export interface BookmarkGroup {
  id: string;
  name: string;
  order: number;
  items: BookmarkItem[];
}

export interface BookmarkGroups {
  [id: string]: BookmarkGroup;
}

// Generate unique bookmark ID
export function getBookmarkItemId(type: BookmarkType, stopId: number, routeId?: number, direction?: number): string {
  if (type === "route" && routeId !== undefined && direction !== undefined) {
    return `route-${routeId}-${stopId}-${direction}`;
  }
  return `stop-${stopId}`;
}

// Fetch all groups
export function fetchBookmarkGroups(): BookmarkGroups {
  const groups = fetchLocalStorageItemByKey(BOOKMARK_GROUPS);
  
  // Initialize with default group if empty
  if (!groups || Object.keys(groups).length === 0) {
    return {
      [DEFAULT_GROUP_ID]: {
        id: DEFAULT_GROUP_ID,
        name: "My Bookmarks",
        order: 0,
        items: []
      }
    };
  }
  
  return groups;
}

// Update groups in storage
function updateBookmarkGroups(groups: BookmarkGroups) {
  updateStoredItemByKey(BOOKMARK_GROUPS, groups);
  
  // Dispatch custom event for same-tab updates
  window.dispatchEvent(new Event('bookmarksUpdated'));
}

// Create a new group
export function createBookmarkGroup(name: string): string {
  const groups = fetchBookmarkGroups();
  const id = `group-${Date.now()}`;
  const maxOrder = Math.max(...Object.values(groups).map(g => g.order), -1);
  
  groups[id] = {
    id,
    name,
    order: maxOrder + 1,
    items: []
  };
  
  updateBookmarkGroups(groups);
  return id;
}

// Delete a group (moves items to default group)
export function deleteBookmarkGroup(groupId: string) {
  if (groupId === DEFAULT_GROUP_ID) {
    return; // Cannot delete default group
  }
  
  const groups = fetchBookmarkGroups();
  const groupToDelete = groups[groupId];
  
  if (groupToDelete && groupToDelete.items.length > 0) {
    // Move items to default group
    if (!groups[DEFAULT_GROUP_ID]) {
      groups[DEFAULT_GROUP_ID] = {
        id: DEFAULT_GROUP_ID,
        name: "My Bookmarks",
        order: 0,
        items: []
      };
    }
    groups[DEFAULT_GROUP_ID].items.push(...groupToDelete.items);
  }
  
  delete groups[groupId];
  updateBookmarkGroups(groups);
}

// Rename a group
export function renameBookmarkGroup(groupId: string, newName: string) {
  const groups = fetchBookmarkGroups();
  
  if (groups[groupId]) {
    groups[groupId].name = newName;
    updateBookmarkGroups(groups);
  }
}

// Add a stop bookmark
export function addStopBookmark(
  stopId: number,
  stopDesc: string,
  stopLat: number,
  stopLng: number,
  groupId: string = DEFAULT_GROUP_ID,
  stopLocation?: StopLocation
) {
  const groups = fetchBookmarkGroups();
  const id = getBookmarkItemId("stop", stopId);
  
  // Ensure group exists
  if (!groups[groupId]) {
    groupId = DEFAULT_GROUP_ID;
  }
  
  // Check if already bookmarked in any group
  for (const group of Object.values(groups)) {
    if (group.items.some(item => item.id === id)) {
      return; // Already bookmarked
    }
  }
  
  const bookmark: BookmarkItem = {
    id,
    type: "stop",
    stopId,
    stopDesc,
    stopLat,
    stopLng,
    timestamp: Date.now()
  };
  
  groups[groupId].items.push(bookmark);
  updateBookmarkGroups(groups);
}

// Add a route bookmark
export function addRouteBookmark(
  routeId: number,
  stopId: number,
  direction: number,
  routeDesc: string,
  stopDesc: string,
  directionDesc?: string,
  stopLat?: number,
  stopLng?: number,
  groupId: string = DEFAULT_GROUP_ID,
  stopLocation?: StopLocation,
  destinationStopId?: number,
  destinationStopDesc?: string
) {
  const groups = fetchBookmarkGroups();
  const id = getBookmarkItemId("route", stopId, routeId, direction);
  
  // Ensure group exists
  if (!groups[groupId]) {
    groupId = DEFAULT_GROUP_ID;
  }
  
  // Check if already bookmarked in any group
  for (const group of Object.values(groups)) {
    if (group.items.some(item => item.id === id)) {
      return; // Already bookmarked
    }
  }
  
  const bookmark: BookmarkItem = {
    id,
    type: "route",
    stopId,
    stopDesc,
    stopLat,
    stopLng,
    routeId,
    routeDesc,
    direction,
    directionDesc,
    destinationStopId,
    destinationStopDesc,
    timestamp: Date.now()
  };
  
  groups[groupId].items.push(bookmark);
  updateBookmarkGroups(groups);
}

// Remove a bookmark
export function removeBookmark(bookmarkId: string) {
  const groups = fetchBookmarkGroups();
  let bookmarkRemoved: BookmarkItem | null = null;
  
  for (const group of Object.values(groups)) {
    const index = group.items.findIndex(item => item.id === bookmarkId);
    if (index !== -1) {
      bookmarkRemoved = group.items[index];
      group.items.splice(index, 1);
      break;
    }
  }
  
  updateBookmarkGroups(groups);
}

// Move bookmark between groups
export function moveBookmarkToGroup(bookmarkId: string, targetGroupId: string) {
  const groups = fetchBookmarkGroups();
  let bookmark: BookmarkItem | null = null;
  
  // Find and remove bookmark from current group
  for (const group of Object.values(groups)) {
    const index = group.items.findIndex(item => item.id === bookmarkId);
    if (index !== -1) {
      bookmark = group.items.splice(index, 1)[0];
      break;
    }
  }
  
  // Add to target group
  if (bookmark && groups[targetGroupId]) {
    groups[targetGroupId].items.push(bookmark);
    updateBookmarkGroups(groups);
  }
}

// Check if a stop is bookmarked
export function isStopBookmarked(stopId: number): boolean {
  const groups = fetchBookmarkGroups();
  const id = getBookmarkItemId("stop", stopId);
  
  for (const group of Object.values(groups)) {
    if (group.items.some(item => item.id === id)) {
      return true;
    }
  }
  return false;
}

// Check if a route is bookmarked
export function isRouteBookmarkedInGroups(routeId: number, stopId: number, direction: number): boolean {
  const groups = fetchBookmarkGroups();
  const id = getBookmarkItemId("route", stopId, routeId, direction);
  
  for (const group of Object.values(groups)) {
    if (group.items.some(item => item.id === id)) {
      return true;
    }
  }
  return false;
}

// Get all bookmarks (flattened)
export function getAllBookmarks(): BookmarkItem[] {
  const groups = fetchBookmarkGroups();
  return Object.values(groups).flatMap(group => group.items);
}

// Get bookmarks by type
export function getBookmarksByType(type: BookmarkType): BookmarkItem[] {
  return getAllBookmarks().filter(item => item.type === type);
}

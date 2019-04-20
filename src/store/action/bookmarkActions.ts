import { StopLocation } from "../../api/trimet/types";
import {
  BOOKMARK_SECTION_NAME_UPDATE_REQUEST,
  BOOKMARK_SECTION_SELECT_REQUEST,
  BOOKMARK_STOP_REQUEST,
  CREATE_BOOKMARK_SECTION_REQUEST,
  REMOVE_BOOKMARK_SECTION_REQUEST,
  REMOVE_BOOKMARK_STOP_REQUEST
} from "../constants";

export const bookmarkStopRequest = (stopLocation: StopLocation) => ({
  payload: { stopLocation },
  type: BOOKMARK_STOP_REQUEST
});

export const removeStopBookmarkRequest = (locationId: number) => ({
  payload: { locationId },
  type: REMOVE_BOOKMARK_STOP_REQUEST
});

export const sectionNameUpdateRequest = (name: string) => ({
  payload: { name },
  type: BOOKMARK_SECTION_NAME_UPDATE_REQUEST
});

export const createBookmarkSectionRequest = () => ({
  type: CREATE_BOOKMARK_SECTION_REQUEST
});

export const removeBookmarkSectionRequest = (bookmarkSectionId: number) => ({
  payload: { bookmarkSectionId },
  type: REMOVE_BOOKMARK_SECTION_REQUEST
});

export const bookmarkSectionSelectRequest = (
  selectedBookmarkSection: number,
  stopLocation: StopLocation
) => ({
  payload: { selectedBookmarkSection, stopLocation },
  type: BOOKMARK_SECTION_SELECT_REQUEST
});

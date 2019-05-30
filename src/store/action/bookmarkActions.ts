import { StopLocation } from "../../api/trimet/interfaces/types";
import {
  BOOKMARK_STOP_REQUEST,
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

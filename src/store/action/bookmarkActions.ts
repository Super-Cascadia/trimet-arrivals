import { StopLocation } from "../../api/trimet/types";
import { BOOKMARK_STOP_REQUEST } from "../constants";

export const bookmarkStopRequest = (stopLocation: StopLocation) => ({
  payload: { stopLocation },
  type: BOOKMARK_STOP_REQUEST
});

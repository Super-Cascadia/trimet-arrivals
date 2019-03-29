import { CHANGE_VIEW_REQUEST } from "../constants";

export const changeViewRequest = (activeView: string) => ({
  payload: { activeView },
  type: CHANGE_VIEW_REQUEST
});

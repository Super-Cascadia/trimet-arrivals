import { CHANGE_VIEW_REQUEST, INITIAL_LOAD_REQUEST } from "../constants";

export const changeViewRequest = (activeView: string) => ({
  payload: { activeView },
  type: CHANGE_VIEW_REQUEST
});

export const onInitialLoadRequest = () => ({
  type: INITIAL_LOAD_REQUEST
});

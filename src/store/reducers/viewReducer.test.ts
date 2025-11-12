import { CHANGE_VIEW } from "../constants";
import viewReducer, { BOOKMARKS_VIEW, NEARBY_STOPS_VIEW } from "./viewReducer";

describe("bookmarkSectionReducer", () => {
  // describe("by default", () => {
  //   it("by default the active view is the nearby nearbyStops view", () => {
  //     const initialState = viewReducer(undefined, {});
  //     expect(initialState.activeView).toEqual(NEARBY_STOPS_VIEW);
  //   });
  // });
  // describe("when a bookmark is created", () => {
  //   it("adds a bookmark entry to the store", () => {
  //     const action = {
  //       payload: {
  //         activeView: BOOKMARKS_VIEW
  //       },
  //       type: CHANGE_VIEW
  //     };
  //     const state = viewReducer(undefined, action);
  //     expect(state.activeView).toEqual(BOOKMARKS_VIEW);
  //   });
  // });
});

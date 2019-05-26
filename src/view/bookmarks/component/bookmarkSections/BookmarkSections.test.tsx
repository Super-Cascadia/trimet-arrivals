import { mount, shallow } from "enzyme";
import React from "react";
import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { ProviderMock } from "../../../../test/util";
import BookmarkSections from "./BookmarkSections";

function mockStore() {
  const stopsInitialState = {
    loading: false,
    timeOfLastLoad: ""
  };

  const stopsReducer = (state = stopsInitialState) => {
    return state;
  };

  const baseState = {
    bookmarkSectionReducer: {
      bookmarkSections: {
        123: {}
      }
    },
    bookmarksReducer: {
      bookmarks: {}
    },
    stopsReducer: {
      stopLocations: {
        123: {}
      }
    }
  };

  return createStore(
    combineReducers({ stopsReducer }),
    baseState,
    applyMiddleware(thunk)
  );
}

describe("BookmarkSections", () => {
  describe("by default", () => {
    it("renders without errors", () => {
      expect(() =>
        shallow(<BookmarkSections bookmarkSections={undefined} />)
      ).not.toThrow();
    });

    it("shows a messsage telling a user to add more bookmarks", () => {
      const subject = shallow(
        <BookmarkSections bookmarkSections={undefined} />
      );
      const message = subject.find(".bookmark-section-message");

      expect(message).toExist();
    });
  });

  describe("when provided bookmarkSection props", () => {
    it("shows a list of BookmarkSectionContainers", () => {
      const bookmarkSections = { 123: {} };

      const subject = mount(
        <ProviderMock store={mockStore()}>
          <BookmarkSections bookmarkSections={bookmarkSections} />
        </ProviderMock>
      );
      const bookmarkSectionList = subject.find(".bookmark-section-list");

      expect(bookmarkSectionList).toExist();
      expect(bookmarkSectionList.find(".bookmark-section")).toExist();
    });
  });
});

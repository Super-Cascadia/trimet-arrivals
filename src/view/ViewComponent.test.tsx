import { mount, shallow } from "enzyme";
import * as React from "react";
import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import {
  BOOKMARKS_VIEW,
  NEARBY_STOPS_VIEW
} from "../store/reducers/viewReducer";
import { ProviderMock } from "../test/util";
import ViewComponent from "./ViewComponent";

describe("ViewComponent", () => {
  describe("by default", () => {
    it("renders without errors", () => {
      // tslint:disable-next-line:no-empty
      const onInitialLoad = () => {
        return;
      };

      expect(() =>
        shallow(
          <ViewComponent
            activeView={undefined}
            updateView={undefined}
            numberOfBookmarks={undefined}
            timeOfLastLoad={undefined}
            onInitialLoad={onInitialLoad}
          />
        )
      ).not.toThrow();
    });

    it("shows navigation", () => {
      const onInitialLoad = () => {
        return;
      };

      const subject = shallow(
        <ViewComponent
          activeView={undefined}
          updateView={undefined}
          numberOfBookmarks={undefined}
          timeOfLastLoad={undefined}
          onInitialLoad={onInitialLoad}
        />
      );

      const mainNav = subject.find("MainNavigation");

      expect(mainNav).toExist();
    });

    it("shows the Nearby Stops View", () => {
      function mockStore() {
        const initialState = {
          activeView: NEARBY_STOPS_VIEW
        };

        const viewReducer = (state = initialState) => {
          return state;
        };

        const baseState = {
          stopsReducer: {
            loading: false
          },
          viewReducer: {
            activeView: undefined
          }
        };

        return createStore(
          combineReducers({ viewReducer }),
          baseState,
          applyMiddleware(thunk)
        );
      }

      const onInitialLoad = () => {
        return;
      };

      const subject = mount(
        <ProviderMock store={mockStore()}>
          <ViewComponent
            activeView={undefined}
            updateView={undefined}
            numberOfBookmarks={undefined}
            timeOfLastLoad={undefined}
            onInitialLoad={onInitialLoad}
          />
        </ProviderMock>
      );

      const mainView = subject.find(".main-view");
      const nearbyStopsView = mainView.find("#nearby-stops-view-component");

      expect(nearbyStopsView).toExist();
    });
  });

  describe("the Nearby Stops View is selected", () => {
    it("shows the Nearby Stops View", () => {
      function mockStore() {
        const initialState = {
          activeView: NEARBY_STOPS_VIEW
        };

        const viewReducer = (state = initialState) => {
          return state;
        };

        const baseState = {
          stopsReducer: {
            loading: false
          },
          viewReducer: {
            activeView: NEARBY_STOPS_VIEW
          }
        };

        return createStore(
          combineReducers({ viewReducer }),
          baseState,
          applyMiddleware(thunk)
        );
      }

      const onInitialLoad = () => {
        return;
      };

      const subject = mount(
        <ProviderMock store={mockStore()}>
          <ViewComponent
            activeView={NEARBY_STOPS_VIEW}
            updateView={undefined}
            numberOfBookmarks={undefined}
            timeOfLastLoad={undefined}
            onInitialLoad={onInitialLoad}
          />
        </ProviderMock>
      );

      const mainView = subject.find(".main-view");
      const nearbyStopsView = mainView.find("#nearby-stops-view-component");

      expect(nearbyStopsView).toExist();
    });
  });

  describe("the Bookmarks View is selected", () => {
    it("shows the Bookmarks View", () => {
      function mockStore() {
        const viewReducer = (
          state = {
            activeView: BOOKMARKS_VIEW
          }
        ) => {
          return state;
        };

        const bookmarksReducer = (state = {}) => {
          return state;
        };

        const bookmarkSectionReducer = (state = {}) => {
          return state;
        };

        const baseState = {
          bookmarkSectionReducer: {
            bookmarkSectionInputName: ""
          },
          stopsReducer: {
            loading: false
          },
          viewReducer: {
            activeView: BOOKMARKS_VIEW
          }
        };

        return createStore(
          combineReducers({
            bookmarkSectionReducer,
            bookmarksReducer,
            viewReducer
          }),
          baseState,
          applyMiddleware(thunk)
        );
      }

      const onInitialLoad = () => {
        return;
      };

      const subject = mount(
        <ProviderMock store={mockStore()}>
          <ViewComponent
            activeView={BOOKMARKS_VIEW}
            updateView={undefined}
            numberOfBookmarks={undefined}
            timeOfLastLoad={undefined}
            onInitialLoad={onInitialLoad}
          />
        </ProviderMock>
      );

      const mainView = subject.find(".main-view");
      const nearbyStopsView = mainView.find("#bookmarks-view-container");

      expect(nearbyStopsView).toExist();
    });
  });
});

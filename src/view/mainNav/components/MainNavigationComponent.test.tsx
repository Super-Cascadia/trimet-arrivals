import { mount, shallow } from "enzyme";
import * as React from "react";
import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import {
  BOOKMARKS_VIEW,
  NEARBY_STOPS_VIEW
} from "../../../store/reducers/viewReducer";
import { ProviderMock } from "../../../test/util";

window.URL.createObjectURL = jest.fn();

import MainNavigationComponent from "./MainNavigationComponent";

const onInitialLoad = () => {
  return;
};

function createViewReducerStore(baseState) {
  const initialState = {
    activeView: NEARBY_STOPS_VIEW
  };

  const viewReducer = (state = initialState) => {
    return state;
  };

  return createStore(
    combineReducers({ viewReducer }),
    baseState,
    applyMiddleware(thunk)
  );
}

describe("MainNavigationComponent", () => {
  describe("by default", () => {
    it("renders without errors", () => {
      expect(() =>
        shallow(
          <MainNavigationComponent
            numberOfBookmarks={undefined}
            timeOfLastLoad={undefined}
            onInitialLoad={onInitialLoad}
          />
        )
      ).not.toThrow();
    });

    it("shows navigation", () => {
      const subject = shallow(
        <MainNavigationComponent
          numberOfBookmarks={undefined}
          timeOfLastLoad={undefined}
          onInitialLoad={onInitialLoad}
        />
      );

      const mainNav = subject.find("MainNavigationMenu");

      expect(mainNav).toExist();
    });

    it("shows the Nearby NearbyStops View", () => {
      function mockStore() {
        const baseState = {
          currentLocationReducer: {
            coordinates: undefined
          },
          nearbyReducer: {
            activeView: "SHOW_NEARBY_ROUTES"
          },
          stopsReducer: {
            loading: false
          },
          viewReducer: {
            activeView: undefined
          }
        };

        return createViewReducerStore(baseState);
      }

      const subject = mount(
        <ProviderMock store={mockStore()}>
          <MainNavigationComponent
            numberOfBookmarks={undefined}
            timeOfLastLoad={undefined}
            onInitialLoad={onInitialLoad}
          />
        </ProviderMock>
      );

      const mainView = subject.find(".main-view");
      const nearbyStopsView = mainView.find(
        "#nearby-nearbyStops-view-component"
      );

      expect(nearbyStopsView).toExist();
    });
  });

  describe("the Nearby NearbyStops View is selected", () => {
    it("shows the Nearby NearbyStops View", () => {
      function mockStore() {
        const baseState = {
          currentLocationReducer: {
            coordinates: undefined
          },
          nearbyReducer: {
            activeView: "SHOW_NEARBY_ROUTES"
          },
          stopsReducer: {
            loading: false
          },
          viewReducer: {
            activeView: NEARBY_STOPS_VIEW
          }
        };

        return createViewReducerStore(baseState);
      }

      const subject = mount(
        <ProviderMock store={mockStore()}>
          <MainNavigationComponent
            numberOfBookmarks={undefined}
            timeOfLastLoad={undefined}
            onInitialLoad={onInitialLoad}
          />
        </ProviderMock>
      );

      const mainView = subject.find(".main-view");
      const nearbyStopsView = mainView.find(
        "#nearby-nearbyStops-view-component"
      );

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
          currentLocationReducer: {
            coordinates: undefined
          },
          nearbyReducer: {
            activeView: "SHOW_NEARBY_ROUTES"
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

      const subject = mount(
        <ProviderMock store={mockStore()}>
          <MainNavigationComponent
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

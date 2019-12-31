import { mount, shallow } from "enzyme";
import React from "react";
import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { ProviderMock } from "../../../test/util";
import NearbyStopsViewContainer from "./NearbyStopsViewContainer";

jest.mock("mapbox-gl");

function mockStore() {
  const arrivalsInitialState = {
    arrivals: {},
    loading: {}
  };

  const arrivalsReducer = (state = arrivalsInitialState) => {
    return state;
  };

  const stopsInitialState = {
    loading: false,
    timeOfLastLoad: ""
  };

  const stopsReducer = (state = stopsInitialState) => {
    return state;
  };

  const baseState = {
    arrivalsReducer: {
      arrivals: {
        123: {}
      },
      loading: {
        123: false
      }
    },
    bookmarkSectionReducer: {
      bookmarkSections: {}
    },
    bookmarksReducer: {
      bookmarks: {}
    },
    currentLocationReducer: {
      coordinates: undefined
    },
    nearbyReducer: {
      activeView: "SHOW_NEARBY_ROUTES"
    },
    stopsReducer: {
      loading: false,
      stopLocations: {
        123: {
          locid: 123
        }
      },
      timeOfLastLoad: "some time"
    }
  };

  return createStore(
    combineReducers({ arrivalsReducer, stopsReducer }),
    baseState,
    applyMiddleware(thunk)
  );
}

describe("NearbyStopsViewContainer", () => {
  describe("by default", () => {
    it("renders without crashing", () => {
      expect(() =>
        shallow(
          <ProviderMock>
            <NearbyStopsViewContainer />
          </ProviderMock>
        )
      ).not.toThrow();
    });
  });

  describe("when provided a valid stopsReducer", () => {
    const subject = mount(
      <ProviderMock store={mockStore()}>
        <NearbyStopsViewContainer />
      </ProviderMock>
    );

    it("hands off props to the StopComponent", () => {
      const stopComponent = subject.find("NearbyStopsViewComponent");
      // @ts-ignore
      expect(stopComponent).toExist();
      // @ts-ignore
      expect(stopComponent.props().stopLocations).toEqual({
        123: { locid: 123 }
      });
      // @ts-ignore
      expect(stopComponent.props().loading).toBe(false);
    });
  });
});

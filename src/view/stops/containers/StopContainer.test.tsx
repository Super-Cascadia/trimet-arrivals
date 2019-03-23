import { mount, shallow } from "enzyme";
import React from "react";
import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { ProviderMock } from "../../../test/util";
import StopContainer from "./StopContainer";

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
    stopsReducer: {
      stopLocations: {
        123: {}
      }
    }
  };

  return createStore(
    combineReducers({ arrivalsReducer, stopsReducer }),
    baseState,
    applyMiddleware(thunk)
  );
}

describe("StopContainer", () => {
  describe("by default", () => {
    it("renders without crashing", () => {
      expect(() =>
        shallow(
          <ProviderMock>
            <StopContainer locationId={undefined} showArrivals={undefined} />
          </ProviderMock>
        )
      ).not.toThrow();
    });
  });

  describe("when provided a valid stopsReducer and arrivalsReducer", () => {
    const subject = mount(
      <ProviderMock store={mockStore()}>
        <StopContainer locationId={123} showArrivals={true} />
      </ProviderMock>
    );

    it("hands off props to the StopComponent", () => {
      const stopComponent = subject.find("StopComponent");

      expect(stopComponent).toExist();

      expect(stopComponent.props().stopLocation).toEqual({});
      expect(stopComponent.props().locationId).toBe(123);
      expect(stopComponent.props().loading).toBe(false);
      expect(stopComponent.props().showArrivals).toEqual(true);
    });
  });
});

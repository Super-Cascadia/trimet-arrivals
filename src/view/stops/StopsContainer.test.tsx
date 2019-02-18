import { mount, shallow } from "enzyme";
import React from "react";
import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { ProviderMock } from "../../test/util";
import StopsContainer from "./StopsContainer";

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

describe("StopsContainer", () => {
  describe("by default", () => {
    it("renders without crashing", () => {
      expect(() =>
        shallow(
          <ProviderMock>
            <StopsContainer />
          </ProviderMock>
        )
      ).not.toThrow();
    });
  });

  describe("when provided a valid stopsReducer", () => {
    const subject = mount(
      <ProviderMock store={mockStore()}>
        <StopsContainer />
      </ProviderMock>
    );

    it("hands off props to the StopComponent", () => {
      const stopComponent = subject.find("StopsComponent");
      // @ts-ignore
      expect(stopComponent).toExist();
      // @ts-ignore
      expect(stopComponent.props().stopLocations).toEqual({
        123: { locid: 123 }
      });
      // @ts-ignore
      expect(stopComponent.props().timeOfLastLoad).toEqual("some time");
      // @ts-ignore
      expect(stopComponent.props().loading).toBe(false);
    });
  });
});

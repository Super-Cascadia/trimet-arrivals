import { mount, shallow } from "enzyme";
import React from "react";
import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { Arrival, StopLocation } from "../../api/trimet/types";
import { ProviderMock } from "../../test/util";
import StopComponent from "./StopComponent";

function mockStore() {
  const initialState = {
    loading: false,
    timeOfLastLoad: ""
  };

  const arrivalsReducer = (state = initialState) => {
    return state;
  };

  const baseState = {
    arrivalsReducer: {
      loading: {
        123: false
      },
      arrivals: {
        123: {} as Arrival
      }
    }
  };

  return createStore(
    combineReducers({ arrivalsReducer }),
    baseState,
    applyMiddleware(thunk)
  );
}

describe("StopComponent", () => {
  describe("by default", () => {
    it("renders without crashing", () => {
      expect(() =>
        shallow(
          <StopComponent
            stopLocation={undefined}
            loadArrivalData={undefined}
            locationId={undefined}
            loading={undefined}
            showArrivals={undefined}
          />
        )
      ).not.toThrow();
    });

    it("shows a StopsTableHeader", () => {
      const subject = shallow(
        <StopComponent
          stopLocation={undefined}
          loadArrivalData={undefined}
          locationId={undefined}
          loading={undefined}
          showArrivals={undefined}
        />
      );

      expect(subject.find("StopsTableHeader")).toExist();
    });

    it("shows an ArrivalsContainer", () => {
      const subject = mount(
        <ProviderMock store={mockStore()}>
          <StopComponent
            stopLocation={undefined}
            loadArrivalData={undefined}
            locationId={undefined}
            loading={undefined}
            showArrivals={undefined}
          />
        </ProviderMock>
      );

      const stop = subject.find(".stop");

      expect(stop.childAt(1).name()).toBe("Connect(ArrivalsComponent)");
    });

    describe("when mounted", () => {
      const loadArrivalDataSpy = jasmine.createSpy("loadArrivalDataSpy");
      const stopLocation = {} as StopLocation;

      const subject = mount(
        <ProviderMock store={mockStore()}>
          <StopComponent
            stopLocation={stopLocation}
            loadArrivalData={loadArrivalDataSpy}
            locationId={123}
            loading={false}
            showArrivals={true}
          />
        </ProviderMock>
      );

      it("calls the load arrival data delegate", () => {
        expect(loadArrivalDataSpy).toHaveBeenCalled();
      });

      it("sets a refresh interval", () => {
        const stopComponent = subject.find("StopComponent");

        expect(stopComponent).toExist();
        expect(stopComponent.instance().refreshInterval).toBe(2);
      });

      xdescribe("and the refresh interval expires", () => {
        jest.useFakeTimers();

        it("calls loadArrivalData delegate again", () => {
          jest.runOnlyPendingTimers();
          expect(setInterval).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});

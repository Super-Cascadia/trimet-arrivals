import { mount, shallow } from "enzyme";
import React from "react";
import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { ProviderMock } from "../../../test/util";
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
      arrivals: {
        123: {}
      },
      loading: {
        123: false
      }
    },
    bookmarkSectionReducer: {
      bookmarkSections: []
    },
    bookmarksReducer: {
      bookmarks: {}
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

    it("does not show an ArrivalsContainer", () => {
      const subject = mount(
        <ProviderMock store={mockStore()}>
          <StopComponent
            stopLocation={undefined}
            loadArrivalData={undefined}
            locationId={undefined}
            loading={undefined}
            showArrivals={false}
          />
        </ProviderMock>
      );

      const stop = subject.find(".stop");

      expect(stop.childAt(1)).not.toExist();
    });

    describe("when mounted", () => {
      const loadArrivalDataSpy = jasmine.createSpy("loadArrivalDataSpy");
      const stopLocation = { locid: 123 };
      const onBookmarkClickSpy = jasmine.createSpy("onBookmarkClickSpy");

      const subject = mount(
        <ProviderMock store={mockStore()}>
          <StopComponent
            stopLocation={stopLocation}
            loadArrivalData={loadArrivalDataSpy}
            locationId={123}
            loading={false}
            showArrivals={true}
            stopIsBookmarked={false}
            onBookmarkClick={onBookmarkClickSpy}
          />
        </ProviderMock>
      );

      it("calls the load arrival data delegate", () => {
        expect(loadArrivalDataSpy).toHaveBeenCalled();
      });

      it("sets a refresh interval", () => {
        const stopComponent = subject.find("StopComponent");

        expect(stopComponent).toExist();
        expect(stopComponent.instance().refreshInterval).toBe(3);
      });

      xdescribe("and the refresh interval expires", () => {
        jest.useFakeTimers();

        it("calls loadArrivalData delegate again", () => {
          jest.runOnlyPendingTimers();
          expect(setInterval).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe("When showArrivals is enabled", () => {
      it("shows an ArrivalsContainer", () => {
        const loadArrivalDataSpy = jasmine.createSpy("loadArrivalDataSpy");

        const subject = mount(
          <ProviderMock store={mockStore()}>
            <StopComponent
              stopLocation={undefined}
              loadArrivalData={loadArrivalDataSpy}
              locationId={undefined}
              loading={undefined}
              showArrivals={true}
            />
          </ProviderMock>
        );

        const stop = subject.find(".stop");

        expect(stop.childAt(1)).toExist();
        expect(stop.childAt(1).name()).toBe("Connect(ArrivalsComponent)");
      });
    });
  });
});

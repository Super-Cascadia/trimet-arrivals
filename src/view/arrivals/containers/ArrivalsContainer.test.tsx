import { mount, shallow } from "enzyme";
import React from "react";
import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { ProviderMock } from "../../../test/util";
import ArrivalsContainer from "./ArrivalsContainer";

// function mockStore() {
//   const initialState = {
//     loading: {},
//     timeOfLastLoad: {}
//   };

//   const arrivalsReducer = (state = initialState) => {
//     return state;
//   };

//   const baseState = {
//     arrivalsReducer: {
//       arrivals: {
//         123: {}
//       },
//       loading: {
//         123: false
//       }
//     }
//   };

//   return createStore(
//     combineReducers({ arrivalsReducer }),
//     baseState,
//     applyMiddleware(thunk)
//   );
// }

describe("ArrivalsContainer", () => {
  // describe("by default", () => {
  //   it("renders without crashing", () => {
  //     expect(() =>
  //       shallow(
  //         <ProviderMock>
  //           <ArrivalsContainer
  //             locationId={undefined}
  //             showArrivals={undefined}
  //             loadArrivalData={undefined}
  //           />
  //         </ProviderMock>
  //       )
  //     ).not.toThrow();
  //   });
  // });
  // describe("when provided a valid arrivalsReducer", () => {
  //   const subject = mount(
  //     <ProviderMock store={mockStore()}>
  //       <ArrivalsContainer
  //         locationId={123}
  //         showArrivals={undefined}
  //         loadArrivalData={undefined}
  //       />
  //     </ProviderMock>
  //   );
  //   it("hands off props to the ArrivalsComponent", () => {
  //     const arrivalsComponent = subject.find("ArrivalsComponent");
  //     expect(arrivalsComponent).toExist();
  //     expect(arrivalsComponent.props().loading).toBe(false);
  //     expect(arrivalsComponent.props().locationId).toBe(123);
  //     expect(arrivalsComponent.props().arrivals).toEqual({});
  //   });
  // });
});

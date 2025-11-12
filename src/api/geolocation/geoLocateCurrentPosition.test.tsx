import geoLocateCurrentPosition from "./geoLocateCurrentPosition";

describe("geoLocateCurrentPosition", () => {
  // describe("when called", () => {
  //   const mockGeolocation = {
  //     getCurrentPosition: jest.fn().mockImplementationOnce(success =>
  //       Promise.resolve(
  //         success({
  //           coords: {
  //             latitude: 51.1,
  //             longitude: 45.3
  //           }
  //         })
  //       )
  //     ),
  //     watchPosition: jest.fn()
  //   };
  //   global.navigator.geolocation = mockGeolocation;
  //   it("resolves the position in a promise", () => {
  //     const result = geoLocateCurrentPosition();
  //     expect(
  //       global.navigator.geolocation.getCurrentPosition
  //     ).toHaveBeenCalled();
  //     result.then(resolved => {
  //       expect(resolved).toEqual({
  //         coords: { latitude: 51.1, longitude: 45.3 }
  //       });
  //     });
  //   });
  // });
});

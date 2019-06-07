import geoLocateCurrentPosition from "./geoLocateCurrentPosition";
import getCurrentPosition from "./getCurrentPosition";

jest.mock("./geoLocateCurrentPosition");

describe("getCurrentPosition", () => {
  afterEach(() => {
    process.env.REACT_APP_USE_DEFAULT_PORTLAND_LOCATION = undefined;
    process.env.REACT_APP_USE_FIXTURE = undefined;
  });

  describe("when the default portland location environment variable is enabled", () => {
    it("returns the default location coordinates", done => {
      process.env.REACT_APP_USE_DEFAULT_PORTLAND_LOCATION = "true";
      getCurrentPosition().then(location => {
        expect(location.coords).toEqual({
          latitude: 45.5122,
          longitude: -122.6587
        });
        done();
      });
    });
  });

  describe("when fixture data is enabled", () => {
    it("returns fixture data", done => {
      process.env.REACT_APP_USE_DEFAULT_PORTLAND_LOCATION = "false";
      process.env.REACT_APP_USE_FIXTURE = "true";

      getCurrentPosition().then(location => {
        expect(location.coords).toEqual({ latitude: 123, longitude: 456 });
        done();
      });
    });
  });

  describe("when no special settings are enabled", () => {
    it("calls the geolocation API to get the current position", done => {
      geoLocateCurrentPosition.mockReturnValue(
        Promise.resolve({
          coords: {
            latitude: 5678,
            longitude: 7838
          }
        })
      );

      getCurrentPosition().then(location => {
        expect(location.coords).toEqual({ latitude: 5678, longitude: 7838 });
        done();
      });
    });
  });
});

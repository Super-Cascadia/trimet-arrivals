import { getNearbyStops } from "./stops";
import { getTrimetData } from "./util";

jest.mock("./util", () => {
  return {
    getTrimetData() {
      return Promise.resolve({ foo: "bar" });
    }
  };
});

describe("stops", () => {
  const location = {
    coords: {
      latitude: 123,
      longitude: 123,
    }
  };

  getNearbyStops(location, 123);

  it("foo", function(done) {
    getTrimetData().then(result => {
      expect(result).toEqual({ foo: "bar" });
      done();
    });
  });
});

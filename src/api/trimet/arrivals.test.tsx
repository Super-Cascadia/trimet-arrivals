import { getArrivals } from "./arrivals";
import { ArrivalData } from "./types";

jest.mock("./util", () => {
  return {
    getTrimetData() {
      return Promise.resolve({
        arrival: [{}],
        location: [{}],
        queryTime: "123"
      });
    }
  };
});

describe("getArrivals", () => {
  afterEach(() => {
    process.env.REACT_APP_USE_FIXTURE = undefined;
  });

  describe("when fixture data is enabled", () => {
    it("retuns fixture data for arrivals", done => {
      process.env.REACT_APP_USE_FIXTURE = "true";

      getArrivals("123", 123).then((result: ArrivalData) => {
        expect(result.queryTime).toEqual("123");
        done();
      });
    });
  });

  describe("when fixture data is not enabled", () => {
    it("fetches trimet data for arrivals", done => {
      getArrivals("123", 123).then((result: ArrivalData) => {
        expect(result.location).toEqual([{}]);
        expect(result.arrival).toEqual([{}]);
        expect(result.queryTime).toEqual("123");
        done();
      });
    });
  });
});

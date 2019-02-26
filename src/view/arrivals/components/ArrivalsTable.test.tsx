import { mount, shallow } from "enzyme";
import React from "react";
import { Arrival, StopLocation } from "../../../api/trimet/types";
import ArrivalsTable from "./ArrivalsTable";

describe("ArrivalsTable", () => {
  describe("by default", () => {
    it("renders without crashing", () => {
      expect(() =>
        shallow(
          <ArrivalsTable
            arrivals={undefined}
            loading={undefined}
            now={undefined}
            stopLocation={undefined}
            onRouteIndicatorClick={undefined}
          />
        )
      ).not.toThrow();
    });

    it("renders nothing", () => {
      const subject = shallow(
        <ArrivalsTable
          arrivals={undefined}
          loading={undefined}
          now={undefined}
          stopLocation={undefined}
          onRouteIndicatorClick={undefined}
        />
      );

      expect(subject.find(".arrivals-table")).not.toExist();
    });
  });

  describe("when arrivals are defined", () => {
    it("shows an arrivals table", () => {
      const arrivals = [{}];
      const stopLocation: StopLocation = {
        route: [
          {
            desc: "hello",
            dir: [
              {
                desc: "123",
                dir: 123
              }
            ],
            route: 123,
            type: "foo"
          }
        ]
      };
      const subject = shallow(
        <ArrivalsTable
          arrivals={arrivals}
          loading={undefined}
          now={undefined}
          stopLocation={stopLocation}
          onRouteIndicatorClick={undefined}
        />
      );

      expect(subject.find(".arrivals-table")).toExist();
    });

    describe("the arrivals table", () => {
      describe("header", () => {
        const arrivals = [{}];
        const stopLocation: StopLocation = {
          route: [
            {
              desc: "hello",
              dir: [
                {
                  desc: "123",
                  dir: 123
                }
              ],
              route: 123,
              type: "foo"
            }
          ]
        };

        const subject = shallow(
          <ArrivalsTable
            arrivals={arrivals}
            loading={undefined}
            now={undefined}
            stopLocation={stopLocation}
            onRouteIndicatorClick={undefined}
          />
        );

        const arrivalsTable = subject.find(".arrivals-table");
        const header = arrivalsTable.find("thead");
        const headerRow = header.find("tr");

        it("has a header", () => {
          expect(header).toExist();
        });

        it("the header contains headings for columns for data about Arrival Time", () => {
          expect(headerRow.children().length).toBe(6);
          expect(headerRow.childAt(0).text()).toBe("");
          expect(headerRow.childAt(1).text()).toBe("Name");
          expect(headerRow.childAt(2).text()).toBe("Arrival");
          expect(headerRow.childAt(3).text()).toBe("On Time");
          expect(headerRow.childAt(4).text()).toBe("Estimated / Scheduled");
          expect(headerRow.childAt(5).text()).toBe("Distance");
        });
      });

      describe("table", () => {
        const arrivals = [
          {
            estimated: 5000,
            route: 1
          },
          {
            estimated: 2000,
            route: 2
          }
        ];
        const stopLocation: StopLocation = {
          route: [
            {
              desc: "hello",
              dir: [
                {
                  desc: "123",
                  dir: 123
                }
              ],
              route: 123,
              type: "foo"
            }
          ]
        };
        const subject = mount(
          <ArrivalsTable
            arrivals={arrivals}
            loading={undefined}
            now={undefined}
            stopLocation={stopLocation}
            onRouteIndicatorClick={undefined}
          />
        );

        const arrivalsTable = subject.find(".arrivals-table");
        const tableBody = arrivalsTable.find("tbody");
        const arrivalRows = tableBody.children();

        it("contains an ArrivalRow for each arrival", () => {
          expect(arrivalRows.length).toBe(2);
          expect(tableBody.childAt(0).name()).toBe("ArrivalRow");
          expect(tableBody.childAt(1).name()).toBe("ArrivalRow");
        });

        it("ArrivalRows are sorted by earliest estimated arrival time", () => {
          expect(tableBody.childAt(0).props().routeId).toBe(2);
          expect(tableBody.childAt(1).props().routeId).toBe(1);
        });
      });
    });

    describe("when loading", () => {
      const arrivals = [{}];
      const stopLocation: StopLocation = {
        route: [
          {
            desc: "hello",
            dir: [
              {
                desc: "123",
                dir: 123
              }
            ],
            route: 123,
            type: "foo"
          }
        ]
      };
      const subject = shallow(
        <ArrivalsTable
          arrivals={arrivals}
          loading={true}
          now={undefined}
          stopLocation={stopLocation}
          onRouteIndicatorClick={undefined}
        />
      );

      it("the arrivals table gets a class indicating this", () => {
        expect(subject.find(".arrivals-table").props().className).toBe(
          "arrivals-table arrivals-loading"
        );
      });
    });
  });
});

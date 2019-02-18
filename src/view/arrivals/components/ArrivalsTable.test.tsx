import { shallow } from "enzyme";
import React from "react";
import { Arrival } from "../../../api/trimet/types";
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
        />
      );

      expect(subject.find(".arrivals-table")).not.toExist();
    });
  });

  describe("when arrivals are defined", () => {
    it("shows an arrivals table", () => {
      const arrivals = [{} as Arrival];
      const subject = shallow(
        <ArrivalsTable
          arrivals={arrivals}
          loading={undefined}
          now={undefined}
        />
      );

      expect(subject.find(".arrivals-table")).toExist();
    });

    describe("the arrivals table", () => {
      describe("header", () => {
        const arrivals = [{} as Arrival];
        const subject = shallow(
          <ArrivalsTable
            arrivals={arrivals}
            loading={undefined}
            now={undefined}
          />
        );

        const arrivalsTable = subject.find(".arrivals-table");
        const header = arrivalsTable.find("thead");

        it("has a header", () => {
          expect(header).toExist();
        });

        it("the header contains headings for columns for data about Arrival Time", () => {
          expect(header.children().length).toBe(6);
          expect(header.childAt(0).text()).toBe("");
          expect(header.childAt(1).text()).toBe("Name");
          expect(header.childAt(2).text()).toBe("Arrival");
          expect(header.childAt(3).text()).toBe("On Time");
          expect(header.childAt(4).text()).toBe("Estimated / Scheduled");
          expect(header.childAt(5).text()).toBe("Distance");
        });
      });

      describe("table", () => {
        const arrivals = [
          {
            estimated: 5000,
            route: 1,
          } as Arrival,
          {
            estimated: 2000,
            route: 2,
          } as Arrival
        ];
        const subject = shallow(
          <ArrivalsTable
            arrivals={arrivals}
            loading={undefined}
            now={undefined}
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
          expect(tableBody.childAt(0).props().route).toBe(2);
          expect(tableBody.childAt(1).props().route).toBe(1);
        });
      });
    });

    describe("when loading", () => {
      const arrivals = [{} as Arrival];
      const subject = shallow(
        <ArrivalsTable arrivals={arrivals} loading={true} now={undefined} />
      );

      it("the arrivals table gets a class indicating this", () => {
        expect(subject.find(".arrivals-table").props().className).toBe(
          "arrivals-table arrivals-loading"
        );
      });
    });
  });
});

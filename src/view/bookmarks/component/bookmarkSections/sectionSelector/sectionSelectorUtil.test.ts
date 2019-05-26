import { customStyles, formatStopLocations } from "./sectionSelectorUtil";

describe("sectionSelectorUtil", () => {
  describe("formatStopLocations", () => {
    it("formats stop location data", () => {
      const stopLocations = [
        {
          desc: "A wonderful stop location",
          locid: 123
        }
      ];
      const result = formatStopLocations(stopLocations);

      expect(result[0]).toEqual({
        color: "#FF5630",
        label: "123: A wonderful stop location",
        value: 123
      });
    });
  });

  describe("customStyles", () => {
    describe("multiValue", () => {
      it("provides custom style info for ReactSelect", () => {
        const result = customStyles();

        const styles = {
          fontWeight: "bold"
        };
        const data = {
          data: {
            color: "#FF5630"
          }
        };

        expect(result.multiValue(styles, data)).toEqual({
          backgroundColor: "rgba(255,86,48,0.1)",
          fontWeight: "bold"
        });
      });
    });

    describe("multiValueLabel", () => {
      it("provides custom style info for ReactSelect", () => {
        const result = customStyles();

        const styles = {
          fontWeight: "bold"
        };
        const data = {
          data: {
            color: "#FF5630"
          }
        };

        expect(result.multiValueLabel(styles, data)).toEqual({
          color: "#FF5630",
          fontWeight: "bold"
        });
      });
    });

    describe("multiValueRemove", () => {
      it("provides custom style info for ReactSelect", () => {
        const result = customStyles();

        const styles = {
          fontWeight: "bold"
        };
        const data = {
          data: {
            color: "#FF5630"
          }
        };

        expect(result.multiValueRemove(styles, data)).toEqual({
          color: "#FF5630",
          fontWeight: "bold",
          hover: { backgroundColor: "#FF5630", color: "white" }
        });
      });
    });

    describe("option", () => {
      it("provides custom style info for ReactSelect", () => {
        const result = customStyles();

        const styles = {
          fontWeight: "bold"
        };
        const data = {
          data: {
            color: "#FF5630"
          }
        };

        expect(result.option(styles, data)).toEqual({
          backgroundColor: null,
          color: "#FF5630",
          cursor: "default",
          fontWeight: "bold"
        });
      });
    });
  });
});

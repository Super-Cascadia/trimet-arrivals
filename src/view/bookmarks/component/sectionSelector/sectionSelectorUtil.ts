import chroma from "chroma-js";
import { map } from "lodash";
import { StopLocation } from "../../../../api/trimet/types";

export function customStyles() {
  return {
    control: styles => ({ ...styles, backgroundColor: "white" }),
    multiValue: (styles, { data }) => {
      const color = chroma(data.color);

      return {
        ...styles,
        backgroundColor: color.alpha(0.1).css()
      };
    },
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: data.color
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: data.color,
      hover: {
        backgroundColor: data.color,
        color: "white"
      }
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isDisabled
          ? null
          : isSelected
          ? data.color
          : isFocused
          ? color.alpha(0.1).css()
          : null,
        color: isDisabled
          ? "#ccc"
          : isSelected
          ? chroma.contrast(color, "white") > 2
            ? "white"
            : "black"
          : data.color,
        cursor: isDisabled ? "not-allowed" : "default"
      };
    }
  };
}

export function formatStopLocations(bookmarks: StopLocation[]) {
  return map(bookmarks, stop => {
    return {
      color: "#FF5630",
      label: `${stop.locid}: ${stop.desc}`,
      value: stop.locid
    };
  });
}

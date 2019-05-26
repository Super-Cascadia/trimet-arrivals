import chroma from "chroma-js";
import { map } from "lodash";
import React from "react";
import Select from "react-select";
import { StopLocation } from "../../../../api/trimet/types";

function customStyles() {
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

function formatStopLocations(bookmarks: StopLocation[]) {
  return map(bookmarks, stop => {
    return {
      color: "#FF5630",
      label: `${stop.locid}: ${stop.desc}`,
      value: stop.locid
    };
  });
}

interface Props {
  bookmarksInSection: StopLocation[];
  allBookmarks: StopLocation[];
  onChange: () => void;
}

export default function BookmarksInSectionSelector({
  bookmarksInSection,
  allBookmarks,
  onChange
}: Props) {
  const defaultOptions = formatStopLocations(bookmarksInSection);
  const options = formatStopLocations(allBookmarks);

  return (
    <Select
      styles={customStyles()}
      options={options}
      isMulti={true}
      defaultValue={defaultOptions}
      onChange={onChange}
    />
  );
}

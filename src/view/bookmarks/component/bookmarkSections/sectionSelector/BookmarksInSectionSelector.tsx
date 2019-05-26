import React from "react";
import Select from "react-select";
import { StopLocation } from "../../../../../api/trimet/types";
import { customStyles, formatStopLocations } from "./sectionSelectorUtil";

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

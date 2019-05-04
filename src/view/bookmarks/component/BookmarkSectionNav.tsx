import chroma from "chroma-js";
import { map } from "lodash";
import React from "react";
import FontAwesome from "react-fontawesome";
import Select from "react-select";
import { StopLocation } from "../../../api/trimet/types";
import "./BookmarkSectionNav.css";
import { RemoveBookmarkSectionButton } from "./RemoveBookmarkSectionButton";

interface BookmarkSectionNavProps {
  name: string;
  bookmarksInSection: StopLocation[];
  removeBookmarkSection: () => void;
  onReactSelectBookmarkChange: () => void;
  allBookmarks: StopLocation[];
  editMode: boolean;
  toggleEditMode: () => void;
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

function EditModeToggleButton({ onClick }) {
  return (
    <button onClick={onClick} className="edit-toggle-button">
      <FontAwesome name="edit" className="" />
    </button>
  );
}

export const BookmarkSectionNav = ({
  bookmarksInSection,
  removeBookmarkSection,
  onReactSelectBookmarkChange,
  name,
  allBookmarks,
  editMode,
  toggleEditMode
}: BookmarkSectionNavProps) => {
  const defaultOptions = formatStopLocations(bookmarksInSection);
  const options = formatStopLocations(allBookmarks);
  return (
    <nav className="bookmark-section-nav-wrapper">
      <div className="bookmark-section-control-wrapper">
        <h3>{name}</h3>
        <EditModeToggleButton onClick={toggleEditMode} />
        {editMode && (
          <RemoveBookmarkSectionButton
            removeBookmarkSection={removeBookmarkSection}
          />
        )}
      </div>
      <div>
        {editMode && (
          <Select
            styles={customStyles()}
            options={options}
            isMulti={true}
            defaultValue={defaultOptions}
            onChange={onReactSelectBookmarkChange}
          />
        )}
      </div>
    </nav>
  );
};

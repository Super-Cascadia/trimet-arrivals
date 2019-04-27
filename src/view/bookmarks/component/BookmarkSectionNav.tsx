import { map } from "lodash";
import React from "react";
import Select from "react-select";
import { RemoveBookmarkSectionButton } from "./RemoveBookmarkSectionButton";

interface BookmarkSectionNavProps {
  name: string;
  bookmarksInSection: number[];
  removeBookmarkSection: () => void;
  onReactSelectBookmarkChange: () => void;
  allBookmarks: number[];
}

function formatOptions(allBookmarks) {
  return map(allBookmarks, stopId => {
    return { label: stopId, value: stopId };
  });
}

export const BookmarkSectionNav = ({
  bookmarksInSection,
  removeBookmarkSection,
  onReactSelectBookmarkChange,
  name,
  allBookmarks
}: BookmarkSectionNavProps) => {
  const defaultOptions = formatOptions(bookmarksInSection);
  const options = formatOptions(allBookmarks);

  return (
    <nav>
      <h3>{name}</h3>
      <RemoveBookmarkSectionButton
        removeBookmarkSection={removeBookmarkSection}
      />
      <Select
        options={options}
        isMulti={true}
        defaultValue={defaultOptions}
        onChange={onReactSelectBookmarkChange}
      />
    </nav>
  );
};

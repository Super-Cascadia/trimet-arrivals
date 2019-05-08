import React from "react";
import { StopLocation } from "../../../api/trimet/types";
import BookmarkSectionNameControl from "./BookmarkSectionNameControl";
import "./BookmarkSectionNav.css";
import BookmarksInSectionSelector from "./BookmarksInSectionSelector";

interface BookmarkSectionNavProps {
  name: string;
  bookmarksInSection: StopLocation[];
  removeBookmarkSection: () => void;
  onReactSelectBookmarkChange: () => void;
  allBookmarks: StopLocation[];
  editMode: boolean;
  toggleEditMode: () => void;
  updateBookmarkSectionName: (bookmarkSectionName: string) => void;
}

export const BookmarkSectionNav = ({
  bookmarksInSection,
  removeBookmarkSection,
  onReactSelectBookmarkChange,
  name,
  allBookmarks,
  editMode,
  updateBookmarkSectionName,
  toggleEditMode
}: BookmarkSectionNavProps) => {
  return (
    <nav className="bookmark-section-nav-wrapper">
      <BookmarkSectionNameControl
        editMode={editMode}
        name={name}
        removeBookmarkSection={removeBookmarkSection}
        toggleEditMode={toggleEditMode}
        updateBookmarkSectionName={updateBookmarkSectionName}
      />
      <div>
        {editMode && (
          <BookmarksInSectionSelector
            onReactSelectBookmarkChange={onReactSelectBookmarkChange}
            allBookmarks={allBookmarks}
            bookmarksInSection={bookmarksInSection}
          />
        )}
      </div>
    </nav>
  );
};

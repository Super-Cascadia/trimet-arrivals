import React from "react";
import BookmarksInSectionSelectorContainer from "../../container/BookmarksInSectionSelectorContainer";
import "./BookmarkSectionNav.css";
import BookmarkSectionNameControl from "./sectionName/BookmarkSectionNameControl";

interface BookmarkSectionNavProps {
  name: string;
  removeBookmarkSection: () => void;
  editMode: boolean;
  toggleEditMode: () => void;
  updateBookmarkSectionName: (bookmarkSectionName: string) => void;
  bookmarkSectionId: number;
}

export const BookmarkSectionNav = ({
  removeBookmarkSection,
  name,
  editMode,
  updateBookmarkSectionName,
  toggleEditMode,
  bookmarkSectionId
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
          <BookmarksInSectionSelectorContainer
            bookmarkSectionId={bookmarkSectionId}
          />
        )}
      </div>
    </nav>
  );
};

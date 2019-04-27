import React from "react";
import FontAwesome from "react-fontawesome";

interface RemoveBookmarkSectionButtonProps {
  removeBookmarkSection: () => void;
}

export const RemoveBookmarkSectionButton = ({
  removeBookmarkSection
}: RemoveBookmarkSectionButtonProps) => {
  return (
    <div className="bookmark-section-remove-button ">
      <button
        className="close-button"
        onClick={removeBookmarkSection}
        title="Remove Bookmark Section"
      >
        <FontAwesome name="times-circle" />
      </button>
    </div>
  );
};

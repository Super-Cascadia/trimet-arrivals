import React from "react";
import FontAwesome from "react-fontawesome";

interface RemoveBookmarkSectionButtonProps {
  removeBookmarkSection: () => void;
}

export const RemoveBookmarkSectionButton = ({
  removeBookmarkSection
}: RemoveBookmarkSectionButtonProps) => {
  return (
    <button
      className="close-button group-menu-item"
      onClick={removeBookmarkSection}
      title="Remove Bookmark Section"
    >
      <FontAwesome name="times-circle" />
    </button>
  );
};

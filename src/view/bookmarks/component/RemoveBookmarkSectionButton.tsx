import React from "react";
import FontAwesome from "react-fontawesome";

interface RemoveBookmarkSectionButtonProps {
  removeBookmarkSection: () => void;
}

function confirmDeletion(removeBookmarkSection) {
  if (window.confirm("Are you sure you want to remove this section?")) {
    removeBookmarkSection();
  }
}

export const RemoveBookmarkSectionButton = ({
  removeBookmarkSection
}: RemoveBookmarkSectionButtonProps) => {
  return (
    <button
      className="close-button group-menu-item"
      onClick={confirmDeletion.bind(this, removeBookmarkSection)}
      title="Remove Bookmark Section"
    >
      <FontAwesome name="times-circle" />
    </button>
  );
};

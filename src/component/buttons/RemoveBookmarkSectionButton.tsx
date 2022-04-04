import React from "react";
import { Button } from "react-bootstrap";
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
    <Button
      onClick={confirmDeletion.bind(this, removeBookmarkSection)}
      title="Remove Bookmark Section"
    >
      <FontAwesome name="times-circle" />
    </Button>
  );
};

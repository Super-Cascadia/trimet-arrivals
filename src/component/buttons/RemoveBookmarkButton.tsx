import React from "react";
import FontAwesome from "react-fontawesome";

interface Props {
  stopId: number;
  removeBookmarkFromSection: (stopId: number) => void;
}

export const RemoveBookmarkButton = ({
  stopId,
  removeBookmarkFromSection
}: Props) => {
  const onClick = removeBookmarkFromSection
    ? removeBookmarkFromSection.bind(this, stopId)
    : undefined;

  return (
    <button
      onClick={onClick}
      className="close-button"
      title="Remove bookmark from Bookmark Section"
    >
      <FontAwesome name="times-circle" />
    </button>
  );
};

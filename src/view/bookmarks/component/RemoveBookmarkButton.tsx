import React from "react";
import FontAwesome from "react-fontawesome";

export const RemoveBookmarkButton = ({ stopId, removeBookmarkFromSection }) => {
  return (
    <button
      onClick={removeBookmarkFromSection.bind(this, stopId)}
      className="close-button"
      title="Remove bookmark from Bookmark Section"
    >
      <FontAwesome name="times-circle" />
    </button>
  );
};

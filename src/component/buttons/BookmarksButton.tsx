import React from "react";
import FontAwesome from "react-fontawesome";
import { StopLocation } from "../../api/trimet/types";
import "./BookmarksButton.css";

function bookmarkIcon(stopIsBookmarked: boolean) {
  if (stopIsBookmarked) {
    const style = {
      color: "red"
    };

    return <FontAwesome name="bookmark" color="red" style={style} />;
  }

  return <FontAwesome name="bookmark" />;
}

interface Props {
  stopLocation: StopLocation;
  onBookmarkClick: (
    stopLocation: StopLocation,
    stopIsBookmarked: boolean
  ) => void;
  stopIsBookmarked: boolean;
}

export default function BookmarkButton({
  onBookmarkClick,
  stopLocation,
  stopIsBookmarked
}: Props) {
  return (
    <div className="bookmark-button-container">
      <button
        onClick={onBookmarkClick.bind(this, stopLocation, stopIsBookmarked)}
        className="bookmark-button"
      >
        {bookmarkIcon(stopIsBookmarked)}
      </button>
    </div>
  );
}

import React from "react";
import FontAwesome from "react-fontawesome";
import { StopLocation } from "../../api/trimet/types";
import "./BookmarksButton.css";
import BookmarkSectionSelector from "./BookmarkSectionSelector";

function bookmarkIcon(stopIsBookmarked: boolean) {
  if (stopIsBookmarked) {
    const style = {
      color: "red"
    };

    return (
      <FontAwesome
        className="bookmarked"
        name="bookmark"
        color="red"
        style={style}
      />
    );
  }

  return <FontAwesome className="not-bookmarked" name="bookmark" />;
}

interface Props {
  stopLocation: StopLocation;
  onBookmarkClick: (
    stopLocation: StopLocation,
    stopIsBookmarked: boolean
  ) => void;
  stopIsBookmarked: boolean;
}

const noop = () => {
  return;
};

export default function BookmarkButton({
  onBookmarkClick = noop,
  stopLocation,
  stopIsBookmarked = false
}: Props) {
  return (
    <div className="bookmark-button-container">
      <button
        onClick={onBookmarkClick.bind(this, stopLocation, stopIsBookmarked)}
        className="bookmark-button"
      >
        {bookmarkIcon(stopIsBookmarked)}
      </button>
      <BookmarkSectionSelector />
    </div>
  );
}

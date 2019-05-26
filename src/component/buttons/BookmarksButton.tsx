import React from "react";
import FontAwesome from "react-fontawesome";
import { StopLocation } from "../../api/trimet/types";
import { BookmarkSectionsProps } from "../../store/reducers/bookmarkSectionReducer";
import "./BookmarksButton.css";

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
  bookmarkSections: BookmarkSectionsProps;
  onBookmarkSectionSelect: (
    selectedBookmarkSection: number,
    stopLocation: StopLocation
  ) => void;
}

export default function BookmarkButton({
  onBookmarkClick,
  stopLocation,
  stopIsBookmarked = false
}: Props) {
  const onClick =
    onBookmarkClick &&
    onBookmarkClick.bind(this, stopLocation, stopIsBookmarked);
  return (
    <div className="bookmark-button-container">
      <button onClick={onClick} className="bookmark-button">
        {bookmarkIcon(stopIsBookmarked)}
      </button>
    </div>
  );
}

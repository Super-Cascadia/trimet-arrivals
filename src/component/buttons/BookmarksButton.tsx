import React from "react";
import { Button } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { StopLocation } from "../../api/trimet/interfaces/types";
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

export type BookmarkClick = (
  stopLocation: StopLocation,
  stopIsBookmarked: boolean
) => void;

export type BookmarkSectionClick = (
  selectedBookmarkSection: number,
  stopLocation: StopLocation
) => void;

interface Props {
  stopLocation: StopLocation;
  onBookmarkClick: BookmarkClick;
  stopIsBookmarked: boolean;
  bookmarkSections: BookmarkSectionsProps;
  onBookmarkSectionSelect: BookmarkSectionClick;
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
    <Button onClick={onClick} className="bookmark-button">
      {bookmarkIcon(stopIsBookmarked)}
    </Button>
  );
}

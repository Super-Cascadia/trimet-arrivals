import React from "react";
import { Button } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { StopLocation } from "../../api/trimet/interfaces/types";
import "./BookmarkButton.css";

interface BookmarkIconParams {
  stopIsBookmarked: boolean;
}

function BookmarkIcon({ stopIsBookmarked }: BookmarkIconParams) {
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

interface Props {
  stopLocation: StopLocation;
  onBookmarkClick: BookmarkClick;
  stopIsBookmarked: boolean;
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
      <BookmarkIcon stopIsBookmarked={stopIsBookmarked} />
    </Button>
  );
}

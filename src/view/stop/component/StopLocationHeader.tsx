import React from "react";
import { Button } from "react-bootstrap";
import { StopLocation } from "../../../api/trimet/interfaces/types";
import { TrimetLocation } from "../../../store/reducers/data/arrivalsDataReducer";
import { OnBookmarkClick } from "./StopLocationView";

interface StopLocationHeaderProps {
  location: TrimetLocation;
  stopIsBookmarked: boolean;
  onBookmarkClick: OnBookmarkClick;
}

function getButton(
  location: TrimetLocation,
  stopIsBookmarked: boolean,
  onBookmarkClick: OnBookmarkClick
) {
  function onClick() {
    onBookmarkClick(location, stopIsBookmarked);
  }

  return (
    <Button
      type="button"
      className="mb-2 mb-md-0"
      variant="outline-secondary"
      active={stopIsBookmarked}
      onClick={onClick}
    >
      {stopIsBookmarked ? "Remove Bookmark" : "Add Bookmark"}
    </Button>
  );
}

function StopLocationHeader({
  location,
  onBookmarkClick,
  stopIsBookmarked
}: StopLocationHeaderProps) {
  return (
    <>
      <header className="d-flex justify-content-between flex-wrap flex-md-nowrap pt-3 pb-2 mb-3">
        <h2 className="display-6">{location.desc}</h2>
        {getButton(location, stopIsBookmarked, onBookmarkClick)}
      </header>
      <hr />
    </>
  );
}

export default StopLocationHeader;

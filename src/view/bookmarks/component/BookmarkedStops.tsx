import { isEmpty, map } from "lodash";
import React from "react";
import { Card } from "react-bootstrap";
import { StopLocation } from "../../../api/trimet/interfaces/types";
import StopContainer from "../../nearbyStops/containers/StopContainer";

interface Props {
  bookmarks: StopLocation[];
}

function getBookmarks(bookmarks: StopLocation[]) {
  return map(bookmarks, (stopLocation: StopLocation) => {
    const locationId = stopLocation.locid
      ? stopLocation.locid
      : stopLocation.id;

    return (
      <div className="bookmark-stop-wrapper" key={locationId}>
        <StopContainer locationId={locationId} showArrivals={false} />
      </div>
    );
  });
}

function BookmarkedStops({ bookmarks }: Props) {
  if (isEmpty(bookmarks)) {
    return (
      <Card>
        <Card.Header>Uncategorized Bookmarks</Card.Header>
        <Card.Body>Bookmark a stop and see it here.</Card.Body>
      </Card>
    );
  }

  return (
    <div>
      <h2 className="h4">Stops</h2>
      {getBookmarks(bookmarks)}
    </div>
  );
}

export default BookmarkedStops;

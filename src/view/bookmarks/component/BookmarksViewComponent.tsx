import { isEmpty, map } from "lodash";
import React from "react";
import { Card, Container } from "react-bootstrap";
import { StopLocation } from "../../../api/trimet/interfaces/types";
import StopContainer from "../../nearbyStops/containers/StopContainer";
import BookmarkSectionsContainer from "../container/BookmarkSectionsContainer";
import "./BookmarksViewComponent.css";

interface Props {
  bookmarks: StopLocation[];
}

function getBookmarkedStops(bookmarks: StopLocation[]) {
  if (isEmpty(bookmarks)) {
    return (
      <Card>
        <Card.Header>Uncategorized Bookmarks</Card.Header>
        <Card.Body>Bookmark a stop and see it here.</Card.Body>
      </Card>
    );
  }

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

export default function BookmarksViewComponent(props: Props) {
  const { bookmarks } = props;

  return (
    <Container id="bookmarks-view-container">
      <br />
      <BookmarkSectionsContainer />
      {getBookmarkedStops(bookmarks)}
    </Container>
  );
}

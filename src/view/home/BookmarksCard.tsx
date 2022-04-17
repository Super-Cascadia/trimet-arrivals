import { map } from "lodash";
import React from "react";
import { Badge, Card, ListGroup } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { LinkContainer } from "react-router-bootstrap";
import { StoredBookmarks } from "../../api/localstorage/bookmarks.localstorage";
import { StopLocation } from "../../api/trimet/interfaces/types";

function getBookmarkedStops(bookmarks: StoredBookmarks) {
  return map(bookmarks, (bookmark: StopLocation, index) => {
    return (
      <ListGroup.Item key={index}>
        <LinkContainer to={`/stop/${index}`}>
          <a>{bookmark.desc}</a>
          {/*<Badge bg="primary">{index}</Badge>*/}
        </LinkContainer>
      </ListGroup.Item>
    );
  });
}

interface Props {
  bookmarks: StoredBookmarks;
}

function BookmarksCard({ bookmarks }: Props) {
  return (
    <Card>
      <Card.Header as="h5">
        <FontAwesome name="bell" />
        Bookmarked Stops
      </Card.Header>
      <Card.Body>Your favourite stops.</Card.Body>
      <ListGroup variant="flush">{getBookmarkedStops(bookmarks)}</ListGroup>
      <Card.Body>
        <LinkContainer to={`/bookmarks`}>
          <Card.Link>Manage Bookmarks</Card.Link>
        </LinkContainer>
      </Card.Body>
    </Card>
  );
}

export default BookmarksCard;

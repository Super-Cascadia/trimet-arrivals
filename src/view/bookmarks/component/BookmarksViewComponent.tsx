import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { StopLocation } from "../../../api/trimet/interfaces/types";
import BookmarkSectionsContainer from "../container/BookmarkSectionsContainer";
import BookmarkedStops from "./BookmarkedStops";
import "./BookmarksViewComponent.css";

interface Props {
  bookmarks: StopLocation[];
}

export default function BookmarksViewComponent(props: Props) {
  const { bookmarks } = props;

  return (
    <Container id="bookmarks-view-container">
      <br />
      <Row>
        <Col>
          <BookmarkedStops bookmarks={bookmarks} />
        </Col>
        <Col>
          <BookmarkSectionsContainer />
        </Col>
      </Row>
    </Container>
  );
}

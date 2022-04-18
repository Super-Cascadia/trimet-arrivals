import { isEmpty, map } from "lodash";
import React, { useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { LinkContainer } from "react-router-bootstrap";
import { StoredBookmarks } from "../../api/localstorage/bookmarks.localstorage";
import {
  StopData,
  StopLocation,
  TrimetRoute
} from "../../api/trimet/interfaces/types";
import { getNearbyStops } from "../../api/trimet/stops";
import RouteIndicator from "../../component/route/RouteIndicator";

interface BookmarkProps {
  index: string;
  bookmark: StopLocation;
}

interface BookmarkItemProps {
  index: string;
  bookmark: StopLocation;
  stopData: StopData;
}

function BookmarkItemRoutes({
  stopLocations
}: {
  stopLocations: StopLocation[];
}) {
  return (
    <div>
      {stopLocations.map((stopLocation: StopLocation) => {
        return (
          <div key={stopLocation.id}>
            {stopLocation.route.map((route: TrimetRoute) => {
              return <RouteIndicator key={route.route} routeId={route.route} />;
            })}
          </div>
        );
      })}
    </div>
  );
}

function BookmarkItem({ index, bookmark, stopData }: BookmarkItemProps) {
  return (
    <ListGroup.Item key={index}>
      <LinkContainer to={`/stop/${index}`}>
        <span>
          <a>{bookmark.desc}</a>
          {stopData && <BookmarkItemRoutes stopLocations={stopData.location} />}
        </span>
      </LinkContainer>
    </ListGroup.Item>
  );
}

function Bookmark({ index, bookmark }: BookmarkProps) {
  const [stopInfo, setStopInfo] = useState(undefined);

  useEffect(() => {
    const location = {
      coords: {
        latitude: bookmark.lat,
        longitude: bookmark.lng
      }
    };
    getNearbyStops(location, 50).then((result: StopData) => {
      setStopInfo(result);
    });
  }, []);

  return <BookmarkItem index={index} bookmark={bookmark} stopData={stopInfo} />;
}

function getBookmarkedStops(bookmarks: StoredBookmarks) {
  return map(bookmarks, (bookmark: StopLocation, index) => {
    return <Bookmark index={index} bookmark={bookmark} />;
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

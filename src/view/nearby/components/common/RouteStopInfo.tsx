import React, { useState, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  OverlayTrigger,
  Stack,
  Tooltip
} from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { StopLocation } from "../../../../api/trimet/interfaces/types";
import {
  isRouteBookmarkedInGroups,
  addRouteBookmark,
  removeBookmark,
  getBookmarkItemId
} from "../../../../api/localstorage/bookmarkGroups.localstorage";

const BookmarkTooltip = props => (
  <Tooltip id="button-tooltip" {...props}>
    Bookmark this route
  </Tooltip>
);

const GoToolTip = props => (
  <Tooltip id="button-tooltip" {...props}>
    Go from this stop
  </Tooltip>
);

interface StopInfoParams {
  shortSign: string;
  stopLocation: StopLocation;
  routeId?: number;
  direction?: number;
  routeDesc?: string;
  directionDesc?: string;
}

function RouteStopInfo({ shortSign, stopLocation, routeId, direction, routeDesc, directionDesc }: StopInfoParams) {
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  useEffect(() => {
    if (routeId && stopLocation?.id && direction !== undefined) {
      setIsBookmarked(isRouteBookmarkedInGroups(routeId, stopLocation.id, direction));
    }
  }, [routeId, stopLocation?.id, direction]);
  
  const handleBookmarkToggle = () => {
    if (!routeId || !stopLocation?.id || direction === undefined) return;
    
    if (isBookmarked) {
      const bookmarkId = getBookmarkItemId("route", stopLocation.id, routeId, direction);
      removeBookmark(bookmarkId);
      setIsBookmarked(false);
      toast.info(`Removed Route ${routeId} from bookmarks`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } else {
      addRouteBookmark(
        routeId,
        stopLocation.id,
        direction,
        routeDesc || `Route ${routeId}`,
        stopLocation?.desc || `Stop ${stopLocation.id}`,
        directionDesc,
        stopLocation?.lat,
        stopLocation?.lng,
        undefined,
        stopLocation
      );
      setIsBookmarked(true);
      toast.success(`Bookmarked Route ${routeId}!`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    }
  };

  function handleGoClick() {
    const url = `/nearby/directions?route=54&direction=1&from=1&to=2`;
    navigate(url);
  }

  return (
    <Card>
      <Card.Body>
        {/* <Card.Title>
          <FontAwesome name="arrow-circle-right" />
          {shortSign}
        </Card.Title> */}
        <Card.Text>
          <small className="text-muted">
            <span>
              <strong>From: </strong>
            </span>
            <Link to={`/nearby/stops/${stopLocation.id}`}>
              {stopLocation.desc} ({stopLocation.id})
            </Link>
          </small>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default RouteStopInfo;

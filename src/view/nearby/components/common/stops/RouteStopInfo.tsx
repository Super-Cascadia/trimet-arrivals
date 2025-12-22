import React, { useState, useEffect } from "react";
import {
  ButtonGroup,
  Card,
  OverlayTrigger,
  Stack,
  Tooltip,
  ListGroup,
  Form
} from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { StopLocation } from "../../../../../api/trimet/interfaces/types";
import { RouteDirectionStop } from "../../../../../api/trimet/interfaces/routes";
import {
  isRouteBookmarkedInGroups,
  addRouteBookmark,
  removeBookmark,
  getBookmarkItemId
} from "../../../../../api/localstorage/bookmarkGroups.localstorage";
import { RouteStopSelector } from "./RouteStopSelector";
import "./StopsOnRoute.scss";

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

/**
 * Props for the RouteStopInfo component
 */
interface StopInfoParams {
  /** The short sign text for the route */
  shortSign: string;
  /** The stop location information */
  stopLocation: StopLocation;
  /** The route ID (optional) */
  routeId?: number;
  /** The direction of the route (optional) */
  direction?: number;
  /** Description of the route (optional) */
  routeDesc?: string;
  /** Description of the direction (optional) */
  directionDesc?: string;
  /** Array of all stops on the route (optional) */
  allStopsOnRoute?: RouteDirectionStop[];
  /** Index of the current stop in the allStopsOnRoute array (optional) */
  currentStopIndex?: number;
  /** Callback function when a departure stop is selected (optional) */
  onDepartureStopSelect?: (stopId: number) => void;
  /** Destination stop ID (optional) */
  destinationStopId?: number;
  /** Destination stop description (optional) */
  destinationStopDesc?: string;
}

/**
 * Component that displays route and stop information with bookmarking and stop selection capabilities.
 * 
 * @param props - The component props
 * @param props.shortSign - The short sign text for the route
 * @param props.stopLocation - The stop location information
 * @param props.routeId - The route ID (optional)
 * @param props.direction - The direction of the route (optional)
 * @param props.routeDesc - Description of the route (optional)
 * @param props.directionDesc - Description of the direction (optional)
 * @param props.allStopsOnRoute - Array of all stops on the route (optional)
 * @param props.currentStopIndex - Index of the current stop in the allStopsOnRoute array (optional)
 * @param props.onDepartureStopSelect - Callback function when a departure stop is selected (optional)
 * @returns A Card component displaying route and stop information
 */
function RouteStopInfo({ shortSign, stopLocation, routeId, direction, routeDesc, directionDesc, allStopsOnRoute, currentStopIndex, onDepartureStopSelect, destinationStopId, destinationStopDesc }: StopInfoParams) {
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
        stopLocation,
        destinationStopId,
        destinationStopDesc
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

  const handleSelectStop = (stopId: number, stopIndex: number) => {
    if (onDepartureStopSelect) {
      onDepartureStopSelect(stopId);
    }
  };

  // Convert StopLocation to RouteDirectionStop format for the selector
  const currentStopAsRouteStop: RouteDirectionStop | null = stopLocation ? {
    locid: stopLocation.id,
    desc: stopLocation.desc,
    lat: stopLocation.lat,
    lng: stopLocation.lng,
    dir: String(direction ?? 0),
    seq: currentStopIndex ?? 0,
    tp: false
  } : null;

  const canSelectStops = onDepartureStopSelect && allStopsOnRoute && currentStopIndex !== undefined;

  // Create the bookmark action button
  const bookmarkButton = routeId !== undefined && direction !== undefined && (
    <OverlayTrigger placement="left" overlay={BookmarkTooltip}>
      <button
        className="btn btn-sm btn-outline-secondary bookmark-button"
        onClick={handleBookmarkToggle}
        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      >
        <FontAwesome name={isBookmarked ? "bookmark" : "bookmark-o"} />
      </button>
    </OverlayTrigger>
  );

  return canSelectStops && allStopsOnRoute.length > 0 && currentStopAsRouteStop ? (
    <RouteStopSelector
      headerTitle="From"
      selectedStop={currentStopAsRouteStop}
      allStopsOnRoute={allStopsOnRoute}
      currentStopIndex={currentStopIndex}
      onStopSelect={handleSelectStop}
      headerActions={bookmarkButton}
    />
  ) : (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span>From</span>
        {bookmarkButton}
      </Card.Header>
      <Card.Body>
        {stopLocation && (
          <Card.Text>{stopLocation.desc} (Stop {stopLocation.id})</Card.Text>
        )}
      </Card.Body>
    </Card>
  );
}

export default RouteStopInfo;

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
import { ExpandCollapseListItem } from "../ui/ExpandCollapseListItem";
import { StopOnRoute } from "./StopOnRoute";
import { SelectAgainButton } from "../ui/SelectAgainButton";

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
function RouteStopInfo({ shortSign, stopLocation, routeId, direction, routeDesc, directionDesc, allStopsOnRoute, currentStopIndex, onDepartureStopSelect }: StopInfoParams) {
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [showEarlier, setShowEarlier] = useState(false);
  const [showFuture, setShowFuture] = useState(false);
  
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

  const handleSelectStop = (stopId: number) => {
    if (onDepartureStopSelect) {
      onDepartureStopSelect(stopId);
    }
    setIsSelecting(false);
    setShowEarlier(false);
    setShowFuture(false);
  };

  const handleSelectAgain = () => {
    setIsSelecting(true);
    setShowEarlier(false);
    setShowFuture(false);
  };

  const handleShowEarlier = () => {
    setShowEarlier(!showEarlier);
    setShowFuture(false);
  };

  const handleShowFuture = () => {
    setShowFuture(!showFuture);
    setShowEarlier(false);
  };

  const previousStops = allStopsOnRoute && currentStopIndex !== undefined && currentStopIndex > 0
    ? allStopsOnRoute.slice(0, currentStopIndex)
    : [];
    
  const futureStops = allStopsOnRoute && currentStopIndex !== undefined && currentStopIndex < allStopsOnRoute.length - 1
    ? allStopsOnRoute.slice(currentStopIndex + 1)
    : [];

  const hasEarlierStops = previousStops.length > 0;
  const hasFutureStops = futureStops.length > 0;
  const canSelectStops = onDepartureStopSelect && allStopsOnRoute && currentStopIndex !== undefined;

  let stopsToShow: RouteDirectionStop[];
  if (!canSelectStops) {
    stopsToShow = [];
  } else if (isSelecting) {
    stopsToShow = allStopsOnRoute;
  } else if (showEarlier) {
    stopsToShow = allStopsOnRoute.slice(0, currentStopIndex + 1);
  } else if (showFuture) {
    stopsToShow = allStopsOnRoute.slice(currentStopIndex);
  } else {
    stopsToShow = allStopsOnRoute && currentStopIndex !== undefined 
      ? [allStopsOnRoute[currentStopIndex]] 
      : [];
  }

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span>From</span>
        {canSelectStops && !isSelecting && (hasEarlierStops || hasFutureStops) && (
          <SelectAgainButton onClick={handleSelectAgain} />
        )}
      </Card.Header>
      
      <ListGroup className="list-group-flush">
        {canSelectStops && hasEarlierStops && !showEarlier && !isSelecting && (
          <ExpandCollapseListItem onClick={handleShowEarlier} icon="chevron-up">
            {previousStops.length} earlier stop{previousStops.length === 1 ? '' : 's'}
          </ExpandCollapseListItem>
        )}
        
        {stopsToShow.map((stop: RouteDirectionStop, index: number) => {
          const actualIndex = allStopsOnRoute.indexOf(stop);
          const isCurrentStop = actualIndex === currentStopIndex;
          const canSelect = isSelecting || showEarlier || showFuture;
          
          return (
            <StopOnRoute
              key={stop.locid}
              routeDirectionStop={stop}
              isSelected={isCurrentStop}
              onSelect={canSelect ? () => handleSelectStop(stop.locid) : undefined}
            />
          );
        })}
        
        {canSelectStops && showEarlier && (
          <ExpandCollapseListItem onClick={handleShowEarlier} icon="chevron-up">
            show less
          </ExpandCollapseListItem>
        )}

        {canSelectStops && hasFutureStops && !showFuture && !isSelecting && (
          <ExpandCollapseListItem onClick={handleShowFuture} icon="chevron-down">
            {futureStops.length} future stop{futureStops.length === 1 ? '' : 's'}
          </ExpandCollapseListItem>
        )}

        {canSelectStops && showFuture && (
          <ExpandCollapseListItem onClick={handleShowFuture} icon="chevron-down">
            show less
          </ExpandCollapseListItem>
        )}
      </ListGroup>
    </Card>
  );
}

export default RouteStopInfo;

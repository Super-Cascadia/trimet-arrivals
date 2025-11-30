import React, { useState, useEffect } from "react";
import {
  Button,
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
import { StopLocation } from "../../../../api/trimet/interfaces/types";
import { RouteDirectionStop } from "../../../../api/trimet/interfaces/routes";
import {
  isRouteBookmarkedInGroups,
  addRouteBookmark,
  removeBookmark,
  getBookmarkItemId
} from "../../../../api/localstorage/bookmarkGroups.localstorage";
import { ExpandCollapseListItem } from "./ExpandCollapseListItem";

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
  allStopsOnRoute?: RouteDirectionStop[];
  currentStopIndex?: number;
  onDepartureStopSelect?: (stopId: number) => void;
}

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
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={handleSelectAgain}
          >
            <FontAwesome name="repeat" className="me-1" />
            Select Again
          </Button>
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
            <ListGroup.Item
              key={stop.locid}
              className="d-flex justify-content-between align-items-center"
              style={{ cursor: canSelect ? 'pointer' : 'default' }}
              onClick={() => canSelect && handleSelectStop(stop.locid)}
            >
              <div className="d-flex align-items-center gap-2 flex-grow-1">
                {canSelectStops && (
                  <Form.Check
                    type="radio"
                    checked={isCurrentStop}
                    onChange={() => {}}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (canSelect) handleSelectStop(stop.locid);
                    }}
                    disabled={!canSelect}
                    style={{ cursor: canSelect ? 'pointer' : 'default' }}
                  />
                )}
                <div>
                  <span>{stop.desc}</span>
                  <small className="text-muted"> ({stop.locid})</small>
                </div>
              </div>
            </ListGroup.Item>
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

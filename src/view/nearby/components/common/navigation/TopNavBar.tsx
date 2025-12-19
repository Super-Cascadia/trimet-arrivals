import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import FontAwesome from "react-fontawesome";
import { toast } from "react-toastify";
import {
  isRouteBookmarkedInGroups,
  addRouteBookmark,
  removeBookmark,
  getBookmarkItemId
} from "../../../../../api/localstorage/bookmarkGroups.localstorage";
import "./TopNavBar.scss";

const BookmarkTooltip = props => (
  <Tooltip id="button-tooltip" {...props}>
    Bookmark this route
  </Tooltip>
);

export interface TopNavBarParams {
  id: string;
  shortSign?: string;
  handleRefresh?: () => void;
  routeId?: number;
  direction?: number;
  stopId?: number;
  routeDesc?: string;
  stopDesc?: string;
  directionDesc?: string;
  stopLat?: number;
  stopLng?: number;
}

export function TopNavBar({ id, shortSign, handleRefresh, routeId, direction, stopId, routeDesc, stopDesc, directionDesc, stopLat, stopLng }: TopNavBarParams) {
  const title = shortSign ? `${id} to ${shortSign}` : id;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  useEffect(() => {
    if (routeId && stopId && direction !== undefined) {
      setIsBookmarked(isRouteBookmarkedInGroups(routeId, stopId, direction));
    }
  }, [routeId, stopId, direction]);
  
  const onRefreshClick = async () => {
    if (!handleRefresh || isRefreshing) return;
    setIsRefreshing(true);
    await handleRefresh();
    setIsRefreshing(false);
  };
  
  const handleBookmarkToggle = () => {
    if (!routeId || !stopId || direction === undefined) return;
    
    if (isBookmarked) {
      const bookmarkId = getBookmarkItemId("route", stopId, routeId, direction);
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
        stopId,
        direction,
        routeDesc || `Route ${routeId}`,
        stopDesc || `Stop ${stopId}`,
        directionDesc,
        stopLat,
        stopLng,
        undefined,
        { id: stopId, desc: stopDesc, lat: stopLat, lng: stopLng } as any
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
  
  return (
    <Navbar bg="secondary" variant="dark" className="w-100">
      <Container fluid className="px-3">
        <Nav className="flex-grow-1">
          <h3 className="navbar-title">{title}</h3>
        </Nav>
        <Nav>
          {routeId && stopId && direction !== undefined && (
            <OverlayTrigger
              placement="bottom"
              delay={{ show: 250, hide: 400 }}
              overlay={BookmarkTooltip}
            >
              <a 
                className={`nav-link ${isBookmarked ? 'bookmarked' : ''}`}
                onClick={handleBookmarkToggle}
              >
                <FontAwesome name={isBookmarked ? 'bookmark' : 'bookmark-o'} />
              </a>
            </OverlayTrigger>
          )}
          {handleRefresh && (
            <a 
              className={`nav-link refresh-link ${isRefreshing ? 'disabled' : ''}`} 
              onClick={onRefreshClick}
            >
              <FontAwesome name="refresh" spin={isRefreshing} />
            </a>
          )}
          <LinkContainer to="/nearby/simple-routes">
            <a className="nav-link">
              <FontAwesome name="times" />
            </a>
          </LinkContainer>
        </Nav>
      </Container>
    </Navbar>
  );
}

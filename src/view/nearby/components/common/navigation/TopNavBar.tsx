import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar, Button, OverlayTrigger, Tooltip, Badge } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import FontAwesome from "react-fontawesome";
import { toast } from "react-toastify";
import {
  isRouteBookmarkedInGroups,
  addRouteBookmark,
  removeBookmark,
  getBookmarkItemId,
  isBookmarkDefault
} from "../../../../../api/localstorage/bookmarkGroups.localstorage";
import "./TopNavBar.scss";

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
  destinationStopId?: number;
  destinationStopDesc?: string;
}

export function TopNavBar({ id, shortSign, handleRefresh, routeId, direction, stopId, routeDesc, stopDesc, directionDesc, stopLat, stopLng, destinationStopId, destinationStopDesc }: TopNavBarParams) {
  const title = shortSign ? `${id} to ${shortSign}` : id;
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [defaultType, setDefaultType] = useState<"home" | "work" | null>(null);
  
  useEffect(() => {
    if (routeId && stopId && direction !== undefined) {
      const bookmarked = isRouteBookmarkedInGroups(routeId, stopId, direction);
      setIsBookmarked(bookmarked);
      
      if (bookmarked) {
        const bookmarkId = getBookmarkItemId("route", stopId, routeId, direction);
        setDefaultType(isBookmarkDefault(bookmarkId));
      } else {
        setDefaultType(null);
      }
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
      // Navigate to bookmarks page instead of removing
      navigate('/bookmarks');
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
        { id: stopId, desc: stopDesc, lat: stopLat, lng: stopLng } as any,
        destinationStopId,
        destinationStopDesc
      );
      setIsBookmarked(true);
      setDefaultType(null);
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
  
  const getBookmarkTooltip = () => {
    if (!isBookmarked) {
      return "Bookmark this route";
    }
    if (defaultType === "home") {
      return "Home route - Click to manage bookmarks";
    }
    if (defaultType === "work") {
      return "Work route - Click to manage bookmarks";
    }
    return "Bookmarked - Click to manage bookmarks";
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
              overlay={<Tooltip id="button-tooltip">{getBookmarkTooltip()}</Tooltip>}
            >
              <a 
                className={`nav-link ${isBookmarked ? 'bookmarked' : ''}`}
                onClick={handleBookmarkToggle}
              >
                {defaultType ? (
                  <Badge bg={defaultType === "home" ? "primary" : "success"} className="bookmark-badge">
                    <FontAwesome name={defaultType === "home" ? "home" : "briefcase"} />
                  </Badge>
                ) : (
                  <FontAwesome name={isBookmarked ? 'bookmark' : 'bookmark-o'} />
                )}
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

import React from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FontAwesome from "react-fontawesome";
import {
  BookmarkItem,
  DefaultBookmarkType,
  clearDefaultBookmark
} from "../../../api/localstorage/bookmarkGroups.localstorage";
import "./DefaultBookmarkCard.scss";

interface Props {
  type: DefaultBookmarkType;
  bookmark: BookmarkItem | null;
  onUpdate: () => void;
}

export default function DefaultBookmarkCard({ type, bookmark, onUpdate }: Props) {
  const navigate = useNavigate();
  
  // Determine display properties based on type
  const getTypeConfig = () => {
    switch(type) {
      case "home_commute":
        return { icon: "home", title: "Home Commute", color: "primary" };
      case "work_commute":
        return { icon: "briefcase", title: "Work Commute", color: "success" };
      case "home_location":
        return { icon: "home", title: "Home Location", color: "info" };
      case "work_location":
        return { icon: "briefcase", title: "Work Location", color: "warning" };
      default:
        return { icon: "bookmark", title: type, color: "secondary" };
    }
  };
  
  const { icon, title, color } = getTypeConfig();
  const isCommute = type === "home_commute" || type === "work_commute";
  const isLocation = type === "home_location" || type === "work_location";

  const handleClear = () => {
    clearDefaultBookmark(type);
    onUpdate();
  };

  const handleClick = () => {
    if (!bookmark) return;
    
    if (isCommute && bookmark.routeId && bookmark.direction !== undefined) {
      // Navigate to route view
      let url = `/nearby/simple-routes/${bookmark.routeId}?stop=${bookmark.stopId}&direction=${bookmark.direction}`;
      if (bookmark.destinationStopId) {
        url += `&destination=${bookmark.destinationStopId}`;
      }
      navigate(url);
    } else if (isLocation) {
      // Navigate to stop view
      navigate(`/stop/${bookmark.stopId}`);
    }
  };

  return (
    <Card className={`default-bookmark-card border-${color}`}>
      <Card.Header className={`bg-${color} text-white d-flex justify-content-between align-items-center`}>
        <div>
          <FontAwesome name={icon} className="me-2" />
          <strong>{title}</strong>
        </div>
        {bookmark && (
          <Button
            variant="link"
            size="sm"
            className="text-white p-0"
            onClick={handleClear}
            title={`Clear ${type} bookmark`}
          >
            <FontAwesome name="times" />
          </Button>
        )}
      </Card.Header>
      <Card.Body>
        {bookmark ? (
          <div
            className="default-bookmark-content"
            onClick={handleClick}
            style={{ cursor: "pointer" }}
          >
            {isCommute ? (
              <>
                <div className="fw-bold mb-2">
                  <FontAwesome name="bus" className="me-2 text-primary" />
                  Route {bookmark.routeId} - {bookmark.routeDesc}
                </div>
                <div className="text-muted small">
                  {bookmark.directionDesc && (
                    <>
                      <FontAwesome name="arrow-right" className="me-1" />
                      {bookmark.directionDesc}
                      <br />
                    </>
                  )}
                  <FontAwesome name="map-marker" className="me-1" />
                  at {bookmark.stopDesc} ({bookmark.stopId})
                </div>
              </>
            ) : (
              <>
                <div className="fw-bold mb-2">
                  <FontAwesome name="map-marker" className="me-2 text-primary" />
                  {bookmark.stopDesc}
                </div>
                <div className="text-muted small">
                  Stop ID: {bookmark.stopId}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="text-center text-muted py-3 default-bookmark-empty">
            <FontAwesome name={`${icon}`} size="2x" className="mb-2 opacity-50" />
            <p className="mb-0">No {title.toLowerCase()} set</p>
            <small className="text-muted">
              Use the bookmark menu to set a {isCommute ? "route" : "stop"} as your {title.toLowerCase()}
            </small>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

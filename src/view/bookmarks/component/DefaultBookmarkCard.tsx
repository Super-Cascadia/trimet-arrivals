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
  
  const icon = type === "home" ? "home" : "briefcase";
  const title = type === "home" ? "Home" : "Work";
  const color = type === "home" ? "primary" : "success";

  const handleClear = () => {
    clearDefaultBookmark(type);
    onUpdate();
  };

  const handleRouteClick = () => {
    if (bookmark && bookmark.routeId && bookmark.direction !== undefined) {
      let url = `/nearby/simple-routes/${bookmark.routeId}?stop=${bookmark.stopId}&direction=${bookmark.direction}`;
      if (bookmark.destinationStopId) {
        url += `&destination=${bookmark.destinationStopId}`;
      }
      navigate(url);
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
            onClick={handleRouteClick}
            style={{ cursor: "pointer" }}
          >
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
          </div>
        ) : (
          <div className="text-center text-muted py-3 default-bookmark-empty">
            <FontAwesome name={`${icon}`} size="2x" className="mb-2 opacity-50" />
            <p className="mb-0">No {type} route set</p>
            <small className="text-muted">
              Use the bookmark menu to set a route as your {type} default
            </small>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

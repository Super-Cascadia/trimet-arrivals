import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { StopLocation } from "../../../api/trimet/interfaces/types";
import StopLocationIndicator from "../../../component/stop/StopLocationIndicator";
import "./BookmarksPreview.scss";

interface Props {
  bookmarks: StopLocation[];
}

function BookmarksPreview({ bookmarks }: Props) {
  const items = bookmarks.filter((stop) => (stop.locid ?? stop.id) !== undefined).slice(0, 4);

  return (
    <Card className="home-section-card">
      <Card.Body>
        <div className="home-section-header">
          <div>
            <Card.Title>Bookmarks</Card.Title>
            <Card.Text className="section-subtitle">
              Quick links to your saved stops
            </Card.Text>
          </div>
          <Link to="/bookmarks" className="section-link">View all</Link>
        </div>
        {items.length === 0 ? (
          <div className="section-empty">No bookmarks yet.</div>
        ) : (
          <div className="bookmarks-grid">
            {items.map((stop) => {
              const id = stop.locid ?? stop.id;
              if (id === undefined) return null;
              return (
                <Link key={id} to={`/stop/${id}`} className="bookmark-card">
                  <div className="bookmark-header">
                    <StopLocationIndicator locationId={Number(id)} size="small" />
                    <span className="bookmark-id">{id}</span>
                  </div>
                  <div className="bookmark-desc">{stop.desc}</div>
                </Link>
              );
            })}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default BookmarksPreview;

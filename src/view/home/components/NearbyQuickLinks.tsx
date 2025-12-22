import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./NearbyQuickLinks.scss";

function NearbyQuickLinks() {
  return (
    <Card className="home-section-card">
      <Card.Body>
        <div className="home-section-header">
          <div>
            <Card.Title>Nearby</Card.Title>
            <Card.Text className="section-subtitle">
              Find stops and routes around you
            </Card.Text>
          </div>
          <Link to="/nearby" className="section-link">Open nearby</Link>
        </div>
        <div className="nearby-links">
          <Link to="/nearby/stops" className="nearby-link">
            <span className="nearby-title">Nearby stops</span>
            <span className="nearby-sub">See stops around you</span>
          </Link>
          <Link to="/nearby/routes" className="nearby-link">
            <span className="nearby-title">Nearby routes</span>
            <span className="nearby-sub">Lines serving your area</span>
          </Link>
          <Link to="/nearby/directions" className="nearby-link">
            <span className="nearby-title">Directions</span>
            <span className="nearby-sub">Plan a trip near you</span>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
}

export default NearbyQuickLinks;

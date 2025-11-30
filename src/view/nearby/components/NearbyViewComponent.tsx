import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Outlet } from "react-router";
import NearbyMapV2 from "./NearbyMapV2";
import "./NearbyViewComponent.scss";
import { useNearbyMapLogic } from "../hooks/useNearbyMapLogic";

export default function NearbyViewComponent() {
  const {
    context,
    mapRef,
    mapContainerRef,
    zoom,
    activeLocation,
    showMap,
    isOnDetailPage,
    isUsingDroppedMarker,
    droppedMarkerLocation,
    handleResetToGeoLocation,
    handlePlaceMarker,
    lng,
    lat
  } = useNearbyMapLogic();

  return (
    <Container fluid={true}>
      <Row>
        <Col md={3}><Outlet context={context} /></Col>
        <Col md={9} className="d-flex flex-column" style={{ height: "calc(100vh - 70px)" }}>
          {showMap && (
            <>
              {!isOnDetailPage() && (
                <>
                  {isUsingDroppedMarker && droppedMarkerLocation ? (
                    <div className="alert alert-info d-flex justify-content-between align-items-center mb-2" role="alert">
                      <div>
                        <div>
                          <strong>📍 Searching from dropped marker</strong> - Drag the marker to change location
                        </div>
                        <small className="text-muted">
                          {droppedMarkerLocation.lat.toFixed(6)}, {droppedMarkerLocation.lng.toFixed(6)}
                        </small>
                      </div>
                      <button 
                        className="btn btn-sm btn-primary" 
                        onClick={handleResetToGeoLocation}
                      >
                        Reset to My Location
                      </button>
                    </div>
                  ) : (
                    <div className="alert alert-secondary d-flex justify-content-between align-items-center mb-2" role="alert">
                      <div>
                        <div>
                          <strong>🗺️ Searching from your location</strong>
                        </div>
                        <small className="text-muted">
                          Longitude: {lng?.toFixed(6)} | Latitude: {lat?.toFixed(6)} | Zoom: {zoom?.toFixed(2)}
                        </small>
                      </div>
                      <button 
                        className="btn btn-sm btn-outline-primary" 
                        onClick={handlePlaceMarker}
                      >
                        📍 Place Marker Here
                      </button>
                    </div>
                  )}
                </>
              )}
              <NearbyMapV2
                initializeMap={context.initializeMap}
                zoom={zoom}
                mapRef={mapRef}
                mapContainerRef={mapContainerRef}
                currentLocation={activeLocation}
              />
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

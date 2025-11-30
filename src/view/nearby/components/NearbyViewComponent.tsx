import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Outlet } from "react-router";
import NearbyMapV2 from "./NearbyMapV2";
import "./NearbyViewComponent.scss";
import { useNearbyMapLogic } from "../hooks/useNearbyMapLogic";
import { LocationStatusAlert } from "./LocationStatusAlert";

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
                <LocationStatusAlert
                  isUsingDroppedMarker={isUsingDroppedMarker}
                  droppedMarkerLocation={droppedMarkerLocation}
                  handleResetToGeoLocation={handleResetToGeoLocation}
                  handlePlaceMarker={handlePlaceMarker}
                  lng={lng}
                  lat={lat}
                  zoom={zoom}
                />
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

import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Outlet } from "react-router";
import NearbyMapV2 from "./NearbyMapV2";
// @ts-ignore
import "../common/styles/NearbyViewComponent.scss";
import { useNearbyMapLogic } from "../../hooks/useNearbyMapLogic";

/**
 * Main view component for the nearby stops feature.
 * Displays a map with nearby transit stops and provides location-based functionality.
 * 
 * @returns A container with a two-column layout: outlet for details (left) and map with location controls (right)
 */
export default function NearbyViewComponent() {
  const {
    context,
    mapRef,
    mapContainerRef,
    zoom,
    activeLocation,
    showMap,
    isOnDetailPage
  } = useNearbyMapLogic();

  return (
    <Container fluid={true}>
      <Row>
        <Col md={3}><Outlet context={context} /></Col>
        <Col md={9} className="d-flex flex-column" style={{ height: "calc(100vh - 70px)" }}>
          {showMap && (
            <>
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

// @ts-ignore
// tslint:disable-next-line:no-implicit-dependencies
import { Map } from "!mapbox-gl";
import { Dictionary } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Outlet } from "react-router";
import { useNavigate } from "react-router-dom";
import geoLocateCurrentPosition from "../../../api/geolocation/geoLocateCurrentPosition";
import {
  Location,
  StopData,
  TrimetRoute
} from "../../../api/trimet/interfaces/types";
import { getNearbyStops } from "../../../api/trimet/stops";
import {
  getNearbyRouteIds,
  getStopLocations,
  processRoutes
} from "../util/dataUtils";
import { setMapZoom } from "../util/mapbox/mapZoom";
import NearbyMapV2 from "./NearbyMapV2";
import "./NearbyViewComponent.scss";

const DEFAULT_RADIUS = 1000;

export interface NearbyViewComponentOutletContextProps {
  currentLocation: number[];
  nearbyRoutes: Dictionary<TrimetRoute[]>;
  nearbyStops: StopData;
  radiusSize: number;
  handleRadiusSelectionChange: (e: any) => void;
}

export default function NearbyViewComponent() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef<Map>(null);
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(16);
  const [radiusSize, setRadiusSize] = useState<number>(DEFAULT_RADIUS);
  const [nearbyStops, setNearbyStopData] = useState<StopData>(undefined);
  const [nearbyRoutes, setNearbyRoutesData] = useState<
    Dictionary<TrimetRoute[]>
  >(undefined);
  const [userLocation, setUserLocation] = useState<Location>(undefined);

  useEffect(() => {
    async function fetchData() {
      // console.info("effect: fetchData");

      if (userLocation) {
        getNearbyStops(userLocation, radiusSize).then((stopData: StopData) => {
          const routes = processRoutes(stopData);

          setNearbyStopData(stopData);
          setNearbyRoutesData(routes);
        });
      } else {
        geoLocateCurrentPosition().then((location: Location) => {
          setUserLocation(location);
          getNearbyStops(location, radiusSize).then((stopData: StopData) => {
            setNearbyStopData(stopData);
            const routes = processRoutes(stopData);
            setNearbyRoutesData(routes);
          });
        });
      }
    }

    fetchData();
  }, [radiusSize]);

  // Radius Size Change
  useEffect(() => {
    if (!mapRef.current) {
      return;
    }
    console.log("radius size change", radiusSize);
    setMapZoom(mapRef, radiusSize, setZoom);
  }, [radiusSize]);

  function handleRadiusSelectionChange(e) {
    setRadiusSize(e.target.value);
  }

  function handleStopMarkerClick(data: any) {
    navigate(`/nearby/stops/${data.properties.locid}`);
  }

  const currentLocation = [
    userLocation?.coords?.longitude,
    userLocation?.coords?.latitude
  ];
  const nearbyRouteIds = nearbyRoutes && getNearbyRouteIds(nearbyRoutes);
  const stopLocations = nearbyStops && getStopLocations(nearbyStops);
  const showMap = currentLocation && nearbyRouteIds && stopLocations;

  const context: NearbyViewComponentOutletContextProps = {
    currentLocation,
    nearbyRoutes,
    nearbyStops,
    radiusSize,
    handleRadiusSelectionChange
  };

  return (
    <Container fluid={true}>
      <Row>
        <Col md={3}>
          <Outlet context={context} />
        </Col>
        <Col md={9}>
          {showMap && (
            <NearbyMapV2
              zoom={zoom}
              mapRef={mapRef}
              mapContainerRef={mapContainerRef}
              handleStopmarkerClick={handleStopMarkerClick}
              radiusSize={radiusSize}
              currentLocation={currentLocation}
              nearbyRouteIds={nearbyRouteIds}
              stopLocations={stopLocations}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}

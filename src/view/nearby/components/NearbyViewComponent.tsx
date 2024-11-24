// @ts-ignore
// tslint:disable-next-line:no-implicit-dependencies
import { Map } from "!mapbox-gl";
import { Dictionary, isEqual } from "lodash";
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
import { initializeCurrentLocationMarker } from "../util/mapbox/currentLocation";
import { initializeMap } from '../util/mapbox/initializeMap';
import { setRoutes as setRoutesOnMap } from "../util/mapbox/routeLines";
import {
  removeCurrentLocationMarkers as removeCurrentLocationMarkFromMap,
  removeRouteLayers as removeRoutesFromMap,
  removeStopLocationLayers as removeStopsFromMap,
  setNearbyStops as setNearbyStopsOnMap
} from "../util/mapbox/stopLocationMarker.util";
import {
  setCurrentLocationMarker
} from "../util/mapbox/currentLocation";

const DEFAULT_RADIUS = 1000;

export interface NearbyViewComponentOutletContextProps {
  currentLocation: number[];
  nearbyRoutes: Dictionary<TrimetRoute[]>;
  nearbyStops: StopData;
  radiusSize: number;
  handleRadiusSelectionChange: (e: any) => void;
  initializeMap: () => void;
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
  const [stopLocationIdsState, setStopLocationIdsState] = useState([]);

  const currentLocation = [
    userLocation?.coords?.longitude,
    userLocation?.coords?.latitude
  ];

  const lng = currentLocation[0];
  const lat = currentLocation[1];

  const nearbyRouteIds = nearbyRoutes && getNearbyRouteIds(nearbyRoutes);
  const stopLocations = nearbyStops && getStopLocations(nearbyStops);
  const showMap = currentLocation && nearbyRouteIds && stopLocations;

  function fetchInitialData(location) {
    return getNearbyStops(location, radiusSize).then((stopData: StopData) => {
      const routes = processRoutes(stopData);
      setNearbyStopData(stopData);
      setNearbyRoutesData(routes);
    });
  }

  // Initial Load
  useEffect(() => {
    if (userLocation) {
      fetchInitialData(userLocation);
    } else {
      geoLocateCurrentPosition().then((location: Location) => {
        setUserLocation(location);
        fetchInitialData(location);
      });
    }
  }, []);

  // Radius Size Change
  useEffect(() => {
    if (!mapRef.current) {
      return;
    }
    console.log("radius size change", radiusSize);
    setMapZoom(mapRef, radiusSize, setZoom);

    getNearbyStops(userLocation, radiusSize).then((stopData: StopData) => {
      const routes = processRoutes(stopData);
      const nearbyRouteIds = getNearbyRouteIds(routes);
      const stopLocations = getStopLocations(stopData);

      removeStopsFromMap(mapRef.current);
      removeCurrentLocationMarkFromMap(mapRef.current);
      removeRoutesFromMap(mapRef.current, Object.keys(nearbyRouteIds));

      setNearbyStopData(stopData);
      setNearbyRoutesData(routes);
      setNearbyStopsOnMap(mapRef.current, stopLocations, handleStopMarkerClick);
      setStopLocationIdsState(Object.keys(stopLocations));
      setCurrentLocationMarker(mapRef.current, lng, lat, radiusSize);
    });
  }, [radiusSize]);

  function initializeMapboxMap() {  
    console.log("initialize map", lng, lat, zoom);
    mapRef.current = initializeMap(lng, lat, mapContainerRef, zoom);
    initializeCurrentLocationMarker(mapRef.current, lng, lat, radiusSize);

    mapRef.current.on("load", () => {
      console.info("effect: initialize map markers and routes");
      setNearbyStopsOnMap(mapRef.current, stopLocations, handleStopMarkerClick);
      setStopLocationIdsState(Object.keys(stopLocations));
      setRoutesOnMap(mapRef.current, nearbyRouteIds);
    });
  }

  function handleRadiusSelectionChange(e) {
    setRadiusSize(e.target.value);
  }

  function handleStopMarkerClick(data: any) {
    navigate(`/nearby/stops/${data.properties.locid}`);
  }

  const context: NearbyViewComponentOutletContextProps = {
    currentLocation,
    nearbyRoutes,
    nearbyStops,
    radiusSize,
    handleRadiusSelectionChange,
    initializeMap: initializeMapboxMap
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
              initializeMap={initializeMapboxMap}
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

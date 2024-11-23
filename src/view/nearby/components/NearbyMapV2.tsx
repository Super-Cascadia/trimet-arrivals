// @ts-ignore
// tslint:disable-next-line:no-implicit-dependencies
import { Map } from "!mapbox-gl";
import { isEqual } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { StopLocationsDictionary } from "../../../store/reducers/util/formatStopLocations";
import { NearbyRoutesDictionary } from "../../../store/reducers/view/nearbyRoutesViewReducer";
import {
  initializeCurrentLocationMarker,
  setCurrentLocationMarker
} from "../util/mapbox/currentLocation";
import { initializeMap } from "../util/mapbox/initializeMap";
import { setMapZoom } from "../util/mapbox/mapZoom";
import { setRoutes } from "../util/mapbox/routeLines";
import {
  removeCurrentLocationMarkers,
  removeRouteLayers,
  removeStopLocationLayers,
  setNearbyStops
} from "../util/mapbox/stopLocationMarker.util";

export type LatLngCoords = number[];

const style = {
  height: 800,
  position: "relative",
  width: "100%"
};

function getMapLongitude(map) {
  return map.current.getCenter().lng.toFixed(4);
}

function getMapLatitude(map) {
  return map.current.getCenter().lat.toFixed(4);
}

interface Props {
  radiusSize: number;
  currentLocation: LatLngCoords;
  stopLocations: StopLocationsDictionary;
  nearbyRouteIds: NearbyRoutesDictionary;
  handleStopmarkerClick: (data: any) => void;
}

function NearbyMapV2({
  currentLocation,
  stopLocations,
  nearbyRouteIds,
  radiusSize,
  handleStopmarkerClick
}: Props) {
  const mapContainer = useRef(null);
  const map = useRef<Map>(null);
  const [lng, setLng] = useState(currentLocation[0]);
  const [lat, setLat] = useState(currentLocation[1]);
  const [zoom, setZoom] = useState(16);
  const [stopLocationIdsState, setStopLocationIdsState] = useState(
    Object.keys(stopLocations)
  );
  const [routeIdsState, setRouteIdsState] = useState(
    Object.keys(nearbyRouteIds)
  );
  const [routeLayers, setRouteLayers] = useState([]);

  const stopLocationIdProps = Object.keys(stopLocations);
  const routeIdProps = Object.keys(nearbyRouteIds);
  const stopLocationIdsAreSame = isEqual(
    stopLocationIdProps,
    stopLocationIdsState
  );
  const routeIdsAreSame = isEqual(routeIdProps, routeIdsState);

  // Initialize Map
  useEffect(() => {
    // initialize map only once
    console.log("initialize map", lng, lat, zoom);
    map.current = initializeMap(lng, lat, mapContainer, zoom);
    initializeCurrentLocationMarker(map.current, lng, lat, radiusSize);
  }, []);

  // Update currentLocation
  useEffect(() => {
    if (!map.current) {
      return;
    }
    map.current.on("load", () => {
      console.info("effect: set current location marker");
    });
  }, [currentLocation]);

  // Initialize map routes and markers
  useEffect(() => {
    if (!map.current) {
      return;
    }

    map.current.on("load", () => {
      console.info("effect: initialize map markers and routes");
      setNearbyStops(map.current, stopLocations, handleStopmarkerClick);
      setStopLocationIdsState(Object.keys(stopLocations));
      setRoutes(map.current, nearbyRouteIds);
    });
  }, []);

  // Update Map Markers
  useEffect(() => {
    if (!map.current) {
      return;
    }

    if (stopLocationIdsAreSame === false) {
      console.info("effect: update map markers", stopLocations);

      removeStopLocationLayers(map.current);
      removeCurrentLocationMarkers(map.current);
      setNearbyStops(map.current, stopLocations, handleStopmarkerClick);
      setStopLocationIdsState(Object.keys(stopLocations));
      setCurrentLocationMarker(map.current, lng, lat, radiusSize);
    }
  }, [radiusSize, stopLocations]);

  // Update Map Routes
  useEffect(() => {
    if (!map.current) {
      return;
    }

    if (routeIdsAreSame === false) {
      console.info("effect: update map routes", nearbyRouteIds);
      removeRouteLayers(map.current, routeLayers);
      setRouteLayers([]);
    }
  }, [radiusSize, nearbyRouteIds]);

  // Radius Size Change
  useEffect(() => {
    if (!map.current) {
      return;
    }

    console.log("radius size change", radiusSize);

    setMapZoom(map, radiusSize, setZoom);
  }, [radiusSize]);

  // @ts-ignore
  const mapBoxMap = <div style={style} ref={mapContainer} />;

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      {mapBoxMap}
    </div>
  );
}

export default NearbyMapV2;

// @ts-ignore
// tslint:disable-next-line:no-implicit-dependencies
import { Map } from "!mapbox-gl";
import { isEqual } from "lodash";
import React, { useEffect, useState } from "react";
import { StopLocationsDictionary } from "../../../store/reducers/util/formatStopLocations";
import { NearbyRoutesDictionary } from "../../../store/reducers/view/nearbyRoutesViewReducer";
import {
  initializeCurrentLocationMarker,
  setCurrentLocationMarker
} from "../util/mapbox/currentLocation";
import { initializeMap } from "../util/mapbox/initializeMap";
import { setMapZoom } from "../util/mapbox/mapZoom";
import { setRoutes as setRoutesOnMap } from "../util/mapbox/routeLines";
import {
  removeCurrentLocationMarkers as removeCurrentLocationMarkFromMap,
  removeRouteLayers as removeRoutesFromMap,
  removeStopLocationLayers as removeStopsFromMap,
  setNearbyStops as setNearbyStopsOnMap
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
  zoom: number;
  mapRef: any;
  mapContainerRef: any;
  radiusSize: number;
  currentLocation: LatLngCoords;
  stopLocations: StopLocationsDictionary;
  nearbyRouteIds: NearbyRoutesDictionary;
  handleStopmarkerClick: (data: any) => void;
}

function NearbyMapV2({
  zoom,
  currentLocation,
  stopLocations,
  nearbyRouteIds,
  radiusSize,
  handleStopmarkerClick,
  mapContainerRef,
  mapRef
}: Props) {
  const lng = currentLocation[0];
  const lat = currentLocation[1];

  const [stopLocationIdsState, setStopLocationIdsState] = useState(
    Object.keys(stopLocations)
  );
  const [routeIdsState, setRouteIdsState] = useState(
    Object.keys(nearbyRouteIds)
  );
  const [routesState, setRoutesState] = useState([]);

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
    mapRef.current = initializeMap(lng, lat, mapContainerRef, zoom);
    initializeCurrentLocationMarker(mapRef.current, lng, lat, radiusSize);

    mapRef.current.on("load", () => {
      console.info("effect: initialize map markers and routes");
      setNearbyStopsOnMap(mapRef.current, stopLocations, handleStopmarkerClick);
      setStopLocationIdsState(Object.keys(stopLocations));
      setRoutesOnMap(mapRef.current, nearbyRouteIds);
    });
  }, []);

  // Update Map Markers
  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    if (stopLocationIdsAreSame === false) {
      console.info("effect: update map markers", stopLocations);

      removeStopsFromMap(mapRef.current);
      removeCurrentLocationMarkFromMap(mapRef.current);
      setNearbyStopsOnMap(mapRef.current, stopLocations, handleStopmarkerClick);
      setStopLocationIdsState(Object.keys(stopLocations));
      setCurrentLocationMarker(mapRef.current, lng, lat, radiusSize);
    }
  }, [radiusSize, stopLocations]);

  // Update Map Routes
  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    if (routeIdsAreSame === false) {
      console.info("effect: update map routes", nearbyRouteIds);
      removeRoutesFromMap(mapRef.current, routesState);
      setRoutesState([]);
    }
  }, [radiusSize, nearbyRouteIds]);

  // @ts-ignore
  const mapBoxMap = <div style={style} ref={mapContainerRef} />;

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

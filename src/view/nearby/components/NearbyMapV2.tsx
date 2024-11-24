// @ts-ignore
// tslint:disable-next-line:no-implicit-dependencies
import { isEqual } from "lodash";
import React, { useEffect, useState } from "react";
import { StopLocationsDictionary } from "../../../store/reducers/util/formatStopLocations";
import { NearbyRoutesDictionary } from "../../../store/reducers/view/nearbyRoutesViewReducer";
import {
  setCurrentLocationMarker
} from "../util/mapbox/currentLocation";
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
  initializeMap: () => void;
}

function NearbyMapV2({
  zoom,
  currentLocation,
  stopLocations,
  nearbyRouteIds,
  radiusSize,
  handleStopmarkerClick,
  initializeMap,
  mapContainerRef,
  mapRef
}: Props) {
  const lng = currentLocation[0];
  const lat = currentLocation[1];

  // Initialize Map
  useEffect(() => {
    initializeMap();
  }, []);

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

// @ts-ignore
// tslint:disable-next-line:no-implicit-dependencies
import mapboxgl, { Map } from "!mapbox-gl";
import { forEach, isEmpty, isEqual, uniq } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { StopLocationsDictionary } from "../../../store/reducers/util/formatStopLocations";
import { NearbyRoutesDictionary } from "../../../store/reducers/view/nearbyRoutesViewReducer";
import { setCurrentLocationMarker } from "../util/currentLocationMarker.util";
import { setRoutes } from "../util/mapboxUtils";
import { setNearbyStopMarkers } from "../util/stopLocationMarker.util";

export type LatLngCoords = number[];

interface Props {
  radiusSize: number;
  currentLocation: LatLngCoords;
  stopLocations: StopLocationsDictionary;
  nearbyRouteIds: NearbyRoutesDictionary;
}

const style = {
  height: 800,
  position: "relative",
  width: "100%"
};

function removeMarkers(mapMarkers: any[]) {
  // console.log("removing markers", mapMarkers);
  forEach(mapMarkers, marker => {
    marker.remove();
  });
}

function removeRouteLayers(map, routeLayers: any[]) {
  // console.log("removing route layers", routeLayers);
  forEach(uniq(routeLayers), layerId => {
    map.removeLayer(layerId);
    map.removeSource(layerId);
  });
}

function getMapLongitude(map) {
  return map.current.getCenter().lng.toFixed(4);
}

function getMapLatitude(map) {
  return map.current.getCenter().lat.toFixed(4);
}

function initializeMap(
  lng: number,
  lat: number,
  mapContainer: React.MutableRefObject<null>,
  zoom: number
): Map {
  return new mapboxgl.Map({
    center: [lng, lat],
    container: mapContainer.current,
    style: "mapbox://styles/mapbox/streets-v11",
    zoom
  });
}

function NearbyMapV2({
  currentLocation,
  stopLocations,
  nearbyRouteIds,
  radiusSize
}: Props) {
  const mapContainer = useRef(null);
  const map = useRef(null);
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
  const [mapMarkers, setMapMarkers] = useState([]);

  const stopLocationIdProps = Object.keys(stopLocations);
  const routeIdProps = Object.keys(nearbyRouteIds);
  const stopLocationIdsAreSame = isEqual(
    stopLocationIdProps,
    stopLocationIdsState
  );
  const routeIdsAreSame = isEqual(routeIdProps, routeIdsState);

  // console.log("radiusSize", radiusSize);
  //
  // console.log("---Stops---");
  // console.log("stops: props", stopLocationIdProps);
  // console.log("stops: state", stopLocationIdsState);
  // console.log("stops: same", stopLocationIdsAreSame);
  // console.log("mapMarkers", mapMarkers);
  //
  // console.log("---Routes---");
  // console.log("route: Props", routeIdProps);
  // console.log("route: State", routeIdsState);
  // console.log("routes: same", routeIdsAreSame);
  // console.log("routeLayers", routeLayers);

  // Initialize Map
  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiamFtZXNvbm55ZWhvbHQiLCJhIjoiY2p3NWoyamV0MTk1dDQ0cGNmdGZkenViMiJ9.TqDD3r62vlPzVgPnYjocsg";

    // initialize map only once
    map.current = initializeMap(lng, lat, mapContainer, zoom);
  }, []);

  // initialize currentLocation
  useEffect(() => {
    if (!map.current) {
      return;
    } // wait for map to initialize
    map.current.on("load", () => {
      // console.info("effect: set current location marker");
      setCurrentLocationMarker(map.current, currentLocation);
    });
  }, [currentLocation]);

  // Initialize map routes and markers
  useEffect(() => {
    if (!map.current) {
      return;
    } // wait for map to initialize
    map.current.on("load", () => {
      // console.info("effect: initialize map markers and routes");
      const markers = setNearbyStopMarkers(map.current, stopLocations);
      setMapMarkers(markers);
      setStopLocationIdsState(Object.keys(stopLocations));
      setRoutes(map.current, nearbyRouteIds).then(routeMapLayers => {
        setRouteLayers(routeMapLayers);
      });
    });
  }, []);

  // Update Map Markers
  useEffect(() => {
    if (!map.current) {
      return;
    }

    if (stopLocationIdsAreSame === false) {
      // console.info("effect: update map markers", stopLocations);
      removeMarkers(mapMarkers);
      const markers = setNearbyStopMarkers(map.current, stopLocations);
      setStopLocationIdsState(Object.keys(stopLocations));
      setMapMarkers(markers);
    }
  }, [radiusSize, stopLocations]);

  // Update Map Routes
  useEffect(() => {
    if (!map.current) {
      return;
    }

    if (routeIdsAreSame === false) {
      // console.info("effect: update map routes", nearbyRouteIds);

      removeRouteLayers(map.current, routeLayers);
      setRouteLayers([]);
      setRoutes(map.current, nearbyRouteIds).then(routeMapLayers => {
        setRouteIdsState(Object.keys(nearbyRouteIds));
        setRouteLayers(routeMapLayers);
      });
    }
  }, [radiusSize, nearbyRouteIds]);

  // Initialize Move effects on markers
  useEffect(() => {
    if (!map.current) {
      return;
    }
    // console.info("effect: initialize marker movement animation ");

    map.current.on("move", () => {
      setLng(getMapLongitude(map));
      setLat(getMapLatitude(map));
      setZoom(map.current.getZoom().toFixed(2));
    });
  }, []);

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

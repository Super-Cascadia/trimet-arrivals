import { Map } from "mapbox-gl";
import { Dictionary, map, set, size } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Outlet, useOutletContext } from "react-router";
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
import { initializeCurrentLocationMarker, setCurrentLocationMarker } from "../util/mapbox/currentLocation";
import { initializeMap } from '../util/mapbox/initializeMap';
import { removeRoutes, setRoutes as setRoutesOnMap } from "../util/mapbox/routeLines";
import {
  removeCurrentLocationMarkers,
  removeStopLocationLayers,
  setNearbyStops,
  updateStopMarkerColor
} from "../util/mapbox/stopLocationMarker.util";
import { NearbyRoutesDictionary } from "../../../store/reducers/view/nearbyRoutesViewReducer";
import NearbySimpleRoutes from "./NearbySimpleRoutes";
import NearbySimpleRouteArrivals from "./NearbySimpleRouteArrivals";
import { NearbyStopsDetail } from "./NearbyStopsDetail";
import { ArrivalLocation } from "../../../api/trimet/interfaces/arrivals";
import NearbyStops from "./NearbyStops";
import NearbyRoutes from "./NearbyRoutes";

const DEFAULT_RADIUS = 1000;

export interface NearbyViewComponentOutletContextProps {
  currentLocation: number[];
  nearbyRoutes: Dictionary<TrimetRoute[]>;
  nearbyStops: StopData;
  radiusSize: number;
  handleRadiusSelectionChange: (e: any) => void;
  initializeMap: () => void;
  handleRouteArrivalsOpened: (id: string, direction: string, stop: string, stopLocation: ArrivalLocation) => void;
  handleStopOpened: (stopLocation: ArrivalLocation) => void;
  handleSimpleRoutesOpened: () => void;
}

export function NearbyStopDetailComponent() {
  const { currentLocation, handleStopOpened } = useOutletContext<NearbyViewComponentOutletContextProps>();
  return <NearbyStopsDetail currentLocation={currentLocation} handleStopOpened={handleStopOpened} />;
}

export function NearbyStopsComponent() {
  const {
    currentLocation,
    nearbyRoutes,
    nearbyStops,
    radiusSize,
    handleRadiusSelectionChange,
   } = useOutletContext<NearbyViewComponentOutletContextProps>();

  const stopCount = nearbyStops?.location?.length;
  const routeCount = size(nearbyRoutes);

  return (
    <div>
      <br />
      <NearbyStops
        currentLocation={currentLocation}
        radiusSize={radiusSize}
        nearbyStops={nearbyStops}
        stopCount={stopCount}
        routeCount={routeCount}
        handleRadiusSelectionChange={handleRadiusSelectionChange}
      />
    </div>
  );
}

export function NearbySimpleRoutesComp() {
  const {
    currentLocation,
    nearbyRoutes,
    nearbyStops,
    radiusSize,
    handleRadiusSelectionChange,
    handleSimpleRoutesOpened
   } = useOutletContext<NearbyViewComponentOutletContextProps>();

  const stopCount = nearbyStops?.location?.length;
  const routeCount = size(nearbyRoutes);

  return (
    <div>
      <br />
      <NearbySimpleRoutes
        nearbyStops={nearbyStops}
        nearbyRoutes={nearbyRoutes}
        radiusSize={radiusSize}
        handleRadiusSelectionChange={handleRadiusSelectionChange}
        handleSimpleRoutesOpened={handleSimpleRoutesOpened}
        routeCount={routeCount}
        stopCount={stopCount}
      />
    </div>
  );
}

export function NearbySimpleRouteArrivalsComp() {
  const {
    handleRouteArrivalsOpened
   } = useOutletContext<NearbyViewComponentOutletContextProps>();

   return <NearbySimpleRouteArrivals handleRouteArrivalsOpened={handleRouteArrivalsOpened} />;
}

export function NearbyRoutesComponent() {
  const {
    currentLocation,
    nearbyRoutes,
    nearbyStops,
    radiusSize,
    handleRadiusSelectionChange
   } = useOutletContext<NearbyViewComponentOutletContextProps>();

  const stopCount = nearbyStops?.location?.length;
  const routeCount = size(nearbyRoutes);

  return (
    <NearbyRoutes
      radiusSize={radiusSize}
      nearbyRoutes={nearbyRoutes}
      stopCount={stopCount}
      routeCount={routeCount}
      handleRadiusSelectionChange={handleRadiusSelectionChange}
    />
  );
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
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [displayedRouteIds, setDisplayedRouteIds] = useState<string[]>([]);

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

      removeStopLocationLayers(mapRef.current);
      removeCurrentLocationMarkers(mapRef.current);
      removeRoutes(mapRef.current, Object.keys(nearbyRouteIds));

      setNearbyStopData(stopData);
      setNearbyRoutesData(routes);
      setNearbyStops(mapRef.current, stopLocations, Object.keys(nearbyRouteIds), handleStopMarkerClick);
      setCurrentLocationMarker(mapRef.current, lng, lat, radiusSize);
    });
  }, [radiusSize]);

  function initializeMapboxMap() {  
    console.log("initialize map", lng, lat, zoom);
    mapRef.current = initializeMap(lng, lat, mapContainerRef, zoom);
    mapRef.current = initializeCurrentLocationMarker(mapRef.current, lng, lat, radiusSize);

    mapRef.current.on("load", () => {
      console.info("effect: initialize map markers and routes");
      // mapRef.current = setNearbyStops(mapRef.current, stopLocations, Object.keys(nearbyRouteIds), handleStopMarkerClick);
      setIsMapLoaded(true);
      // setRoutesOnMap(mapRef.current, nearbyRouteIds);
    });
  }

  function handleRadiusSelectionChange(e) {
    console.log('handle radius selection change', e.target.value);
    setRadiusSize(e.target.value);
  }

  function handleStopMarkerClick(data: any) {
    console.log('handle stop marker click', data);
    navigate(`/nearby/stops/${data.properties.locid}`);
  }

  function flyToCenter(lng: number, lat: number) {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [lng, lat],
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
      });
    }
  }

  async function handleRouteArrivalsOpened(routeId: string, direction: string, stop: string, stopLocation: ArrivalLocation) {
    console.log("route arrivals opened", routeId, direction); 
    const selectedRouteDictionary = {
      [parseInt(routeId, 10)]: {
        directions: [parseInt(direction, 10)]
      }
    } as NearbyRoutesDictionary;
    const routeIds = await setRoutesOnMap(mapRef.current, selectedRouteDictionary);
    setDisplayedRouteIds(routeIds);
    flyToCenter(stopLocation.lng, stopLocation.lat);
    updateStopMarkerColor(mapRef.current, stop, "#ff0000");
  }

  function handleStopOpened(stopLocation: ArrivalLocation) {
    flyToCenter(stopLocation.lng, stopLocation.lat);
    updateStopMarkerColor(mapRef.current, `${stopLocation.id}`, "#ff0000");
  }

  function handleSimpleRoutesOpened() {
    console.info("simple routes opened");
    mapRef.current = removeStopLocationLayers(mapRef.current);
    mapRef.current = setNearbyStops(mapRef.current, stopLocations, Object.keys(nearbyRouteIds), handleStopMarkerClick);
    mapRef.current = removeRoutes(mapRef.current, displayedRouteIds);
    flyToCenter(lng, lat);
    setDisplayedRouteIds([]);
  }

  const context: NearbyViewComponentOutletContextProps = {
    currentLocation,
    nearbyRoutes,
    nearbyStops,
    radiusSize,
    handleRadiusSelectionChange,
    initializeMap: initializeMapboxMap,
    handleRouteArrivalsOpened,
    handleStopOpened,
    handleSimpleRoutesOpened,
  };

  return (
    <Container fluid={true}>
      <Row>
        <Col md={3}>
          {isMapLoaded && <Outlet context={context} />}
        </Col>
        <Col md={9}>
          {showMap && (
            <NearbyMapV2
              initializeMap={initializeMapboxMap}
              zoom={zoom}
              mapRef={mapRef}
              mapContainerRef={mapContainerRef}
              currentLocation={currentLocation}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}

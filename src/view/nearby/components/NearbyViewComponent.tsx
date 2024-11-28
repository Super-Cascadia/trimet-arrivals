import { Map } from "mapbox-gl";
import { Dictionary, size } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Outlet, useOutletContext, useParams } from "react-router";
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
import { setRoutes as setRoutesOnMap } from "../util/mapbox/routeLines";
import {
  removeCurrentLocationMarkers,
  removeRouteLayers,
  removeStopLocationLayers,
  setNearbyStops,
  updateStopMarkerColor
} from "../util/mapbox/stopLocationMarker.util";
import { NearbyRoutesDictionary } from "../../../store/reducers/view/nearbyRoutesViewReducer";
import NearbySimpleRoutes from "./NearbySimpleRoutes";
import NearbySimpleRouteArrivals from "./NearbySimpleRouteArrivals";
import { NearbyStopsDetail } from "./NearbyStopsDetail";
import { ArrivalLocation } from "../../../api/trimet/interfaces/arrivals";

const DEFAULT_RADIUS = 1000;

export function NearbyStopDetailComponent() {
  const { currentLocation } = useOutletContext<NearbyViewComponentOutletContextProps>();
  return <NearbyStopsDetail currentLocation={currentLocation} />;
}

export interface NearbyViewComponentOutletContextProps {
  currentLocation: number[];
  nearbyRoutes: Dictionary<TrimetRoute[]>;
  nearbyStops: StopData;
  radiusSize: number;
  handleRadiusSelectionChange: (e: any) => void;
  initializeMap: () => void;
  handleRouteArrivalsOpened: (id: string, direction: string, stop: string, stopLocation: ArrivalLocation) => void;
}

export function NearbySimpleRoutesComp() {
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
    <div>
      <br />
      <NearbySimpleRoutes
        nearbyStops={nearbyStops}
        nearbyRoutes={nearbyRoutes}
        radiusSize={radiusSize}
        handleRadiusSelectionChange={handleRadiusSelectionChange}
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
      removeRouteLayers(mapRef.current, Object.keys(nearbyRouteIds));

      setNearbyStopData(stopData);
      setNearbyRoutesData(routes);
      setNearbyStops(mapRef.current, stopLocations, Object.keys(nearbyRouteIds), handleStopMarkerClick);
      setCurrentLocationMarker(mapRef.current, lng, lat, radiusSize);
    });
  }, [radiusSize]);

  function initializeMapboxMap() {  
    console.log("initialize map", lng, lat, zoom);
    mapRef.current = initializeMap(lng, lat, mapContainerRef, zoom);
    initializeCurrentLocationMarker(mapRef.current, lng, lat, radiusSize);

    mapRef.current.on("load", () => {
      console.info("effect: initialize map markers and routes");
      setNearbyStops(mapRef.current, stopLocations, Object.keys(nearbyRouteIds), handleStopMarkerClick);
      // setRoutesOnMap(mapRef.current, nearbyRouteIds);
    });
  }

  function handleRadiusSelectionChange(e) {
    setRadiusSize(e.target.value);
  }

  function handleStopMarkerClick(data: any) {
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

  function handleRouteArrivalsOpened(routeId: string, direction: string, stop: string, stopLocation: ArrivalLocation) {
    console.log("route arrivals opened", routeId, direction); 
    const selectedRouteDictionary = {
      [parseInt(routeId, 10)]: {
        directions: [parseInt(direction, 10)]
      }
    } as NearbyRoutesDictionary;
    setRoutesOnMap(mapRef.current, selectedRouteDictionary);
    flyToCenter(stopLocation.lng, stopLocation.lat);
    updateStopMarkerColor(mapRef.current, stop, "#ff0000");
  }

  const context: NearbyViewComponentOutletContextProps = {
    currentLocation,
    nearbyRoutes,
    nearbyStops,
    radiusSize,
    handleRadiusSelectionChange,
    initializeMap: initializeMapboxMap,
    handleRouteArrivalsOpened
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

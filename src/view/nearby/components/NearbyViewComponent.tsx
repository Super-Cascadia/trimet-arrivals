import {
  Dictionary,
  flatten,
  groupBy,
  map,
  mapKeys,
  mapValues,
  size
} from "lodash";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import geoLocateCurrentPosition from "../../../api/geolocation/geoLocateCurrentPosition";
import {
  Direction,
  Location,
  StopData,
  StopLocation,
  TrimetRoute
} from "../../../api/trimet/interfaces/types";
import { getNearbyStops } from "../../../api/trimet/stops";
import NearbySubRoutes from "../../../routes/NearbySubRoutes";
import { StopLocationsDictionary } from "../../../store/reducers/util/formatStopLocations";
import { NearbyRoutesDictionary } from "../../../store/reducers/view/nearbyRoutesViewReducer";
import NearbyMap from "./NearbyMap";
import NearbySubNav from "./NearbySubNav";
import "./NearbyViewComponent.scss";

function processRoutes(stopData: StopData): Dictionary<TrimetRoute[]> {
  const routes = stopData.location.map((location: StopLocation) => {
    return location.route.map((route: TrimetRoute) => route);
  });
  const mappedKeys = mapKeys(
    flatten(routes),
    (item: TrimetRoute) => `${item.route}-${item.dir[0].dir}`
  );

  return groupBy(mappedKeys, (key: TrimetRoute) => key.route);
}

function getNearbyRouteIds(
  nearbyRoutes: Dictionary<TrimetRoute[]>
): NearbyRoutesDictionary {
  return mapValues(nearbyRoutes, (routes: TrimetRoute[]) => {
    const directions = map(routes, (route: TrimetRoute) => {
      return map(route.dir, (dir: Direction) => {
        return dir.dir;
      });
    });

    return {
      directions: flatten(directions)
    };
  });
}

function getStopLocations(nearbyStops: StopData): StopLocationsDictionary {
  return mapKeys(nearbyStops.location, (location: StopLocation) => {
    return location.locid;
  });
}

export default function NearbyViewComponent() {
  const [nearbyStops, setNearbyStopData] = useState<StopData>(undefined);
  const [nearbyRoutes, setNearbyRoutesData] = useState<
    Dictionary<TrimetRoute[]>
  >(undefined);
  const [userLocation, setUserLocation] = useState<Location>(undefined);

  useEffect(() => {
    geoLocateCurrentPosition().then((location: Location) => {
      setUserLocation(location);
      getNearbyStops(location, 1000).then((stopData: StopData) => {
        setNearbyStopData(stopData);
        const routes = processRoutes(stopData);
        setNearbyRoutesData(routes);
      });
    });
  }, []);

  const stopCount = nearbyStops?.location?.length;
  const routeCount = size(nearbyRoutes);
  const currentLocation = [
    userLocation?.coords?.longitude,
    userLocation?.coords?.latitude
  ];
  const nearbyRouteIds = nearbyRoutes && getNearbyRouteIds(nearbyRoutes);
  const stopLocations = nearbyStops && getStopLocations(nearbyStops);
  const showMap = currentLocation && nearbyRouteIds && stopLocations;

  return (
    <Container fluid={true}>
      <Row>
        <Col md={3}>
          {/*<br />*/}
          <NearbySubNav routeCount={routeCount} stopCount={stopCount} />
          <div className="scrollarea">
            <NearbySubRoutes
              nearbyStops={nearbyStops}
              nearbyRoutes={nearbyRoutes}
            />
          </div>
        </Col>
        <Col md={9}>
          {showMap && (
            <NearbyMap
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

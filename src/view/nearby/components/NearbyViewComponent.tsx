import {
  Dictionary,
  flatten,
  groupBy,
  map,
  mapKeys,
  mapValues,
  size
} from "lodash";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Col, Container, Form, FormGroup, Row } from "react-bootstrap";
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
import NearbyMapV2 from "./NearbyMapV2";
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
  const radius = 1000;
  const [radiusSize, setRadiusSize] = useState<number>(radius);
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

          // console.log("effect: fetchData: stopData", stopData);
          // console.log("effect: fetchData: routes", routes);

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

  function handleRadiusSelectionChange(e) {
    // console.log("set radius", e.target.value);
    setRadiusSize(e.target.value);
  }

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
          <FormGroup>
            <Form.Select
              aria-label="Default select example"
              value={radiusSize}
              onChange={handleRadiusSelectionChange}
            >
              <option>Select</option>
              <option value="250">250</option>
              <option value="500">500</option>
              <option value="750">750</option>
              <option value="1000">1000</option>
              <option value="1500">1500</option>
              <option value="2000">2000</option>
              <option value="2500">2500</option>
              <option value="5000">5000</option>
            </Form.Select>
          </FormGroup>
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
            <NearbyMapV2
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

import { Dictionary, flatten, groupBy, mapKeys, size } from "lodash";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import geoLocateCurrentPosition from "../../../api/geolocation/geoLocateCurrentPosition";
import {
  Location,
  StopData,
  StopLocation,
  TrimetRoute
} from "../../../api/trimet/interfaces/types";
import { getNearbyStops } from "../../../api/trimet/stops";
import NearbySubRoutes from "../../../routes/NearbySubRoutes";
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

  return (
    <Container fluid={true}>
      <Row className="nearby-stops">
        <div>
          <Col md={3}>
            <br />
            <NearbySubNav routeCount={routeCount} stopCount={stopCount} />
            <NearbySubRoutes
              nearbyStops={nearbyStops}
              nearbyRoutes={nearbyRoutes}
            />
          </Col>
          <Col md={9}>{/*<NearbyMapContainer/>*/}</Col>
        </div>
      </Row>
    </Container>
  );
}

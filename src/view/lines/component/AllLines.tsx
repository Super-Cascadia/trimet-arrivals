import { filter, includes, isEmpty, map } from "lodash";
import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import {
  RouteDataResultSet,
  TrimetRoute
} from "../../../api/trimet/interfaces/routes";
import { getAllRoutes } from "../../../api/trimet/routeConfig";
import RouteListItem from "../../../component/route/RouteListItem";
import {
  createRoutesDictionary,
  RouteDataDictionary
} from "../../../store/reducers/data/routeDataReducer";
import Loading from "../../loading/Loading";

const WES = 203;
const AREIAL_TRAM = 208;
const STREET_CAR_ONE = 193;
const STREET_CAR_TWO = 194;
const STREET_CAR_THREE = 195;
enum ROUTE_TYPE {
  BUS = "B",
  RAIL = "R"
}

export function getBusLines(routes: RouteDataDictionary): TrimetRoute[] {
  return filter(routes, route => route.type === ROUTE_TYPE.BUS);
}

export function getMaxLines(routes: RouteDataDictionary): TrimetRoute[] {
  return filter(routes, route => {
    return (
      route.type === ROUTE_TYPE.RAIL &&
      !includes(
        [WES, AREIAL_TRAM, STREET_CAR_ONE, STREET_CAR_TWO, STREET_CAR_THREE],
        route.id
      )
    );
  });
}

export function getStreetCarLines(routes: RouteDataDictionary): TrimetRoute[] {
  return filter(routes, route => {
    return (
      route.type === ROUTE_TYPE.RAIL &&
      includes([STREET_CAR_ONE, STREET_CAR_TWO, STREET_CAR_THREE], route.id)
    );
  });
}

export function getAerialTram(routes: RouteDataDictionary): TrimetRoute[] {
  return filter(routes, route => {
    return route.type === ROUTE_TYPE.RAIL && includes([AREIAL_TRAM], route.id);
  });
}

export function getWesCommuterRail(routes: RouteDataDictionary): TrimetRoute[] {
  return filter(routes, route => {
    return route.type === ROUTE_TYPE.RAIL && includes([WES], route.id);
  });
}

export function getRoutes(routes: TrimetRoute[]) {
  return map(routes, (route: TrimetRoute) => {
    return <RouteListItem route={route} />;
  });
}

export function AllLines() {
  const [routes, setRoutes] = useState({});

  useEffect(() => {
    getAllRoutes().then((data: RouteDataResultSet) => {
      const routesDictionary = createRoutesDictionary(data.route);
      setRoutes(routesDictionary);
    });
  }, []);

  if (isEmpty(routes)) {
    return <Loading />;
  }

  const busLines = getBusLines(routes);
  const maxLines = getMaxLines(routes);
  const streetCarLines = getStreetCarLines(routes);
  const wesCommuterRail = getWesCommuterRail(routes);

  return (
    <Container fluid={true}>
      <div className="line-detail-view-wrapper">
        <h2>Max Light Rail</h2>
        <Row xs={1} md={4} className="g-4">
          {getRoutes(maxLines)}
        </Row>
        <br />
        <h2>Portland Street Car</h2>
        <Row xs={1} md={4} className="g-4">
          {getRoutes(streetCarLines)}
        </Row>
        <br />
        <h2>WES Commuter Rail</h2>
        <Row xs={1} md={4} className="g-4">
          {getRoutes(wesCommuterRail)}
        </Row>
        <br />
        <h2>Bus</h2>
        <Row xs={1} md={4} className="g-4">
          {getRoutes(busLines)}
        </Row>
      </div>
    </Container>
  );
}

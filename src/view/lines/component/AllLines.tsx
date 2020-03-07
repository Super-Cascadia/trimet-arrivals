import { filter, includes, map } from "lodash";
import React from "react";
import { TrimetRoute } from "../../../api/trimet/interfaces/routes";
import RouteListItem from "../../../component/route/RouteListItem";
import { RouteDataDictionary } from "../../../store/reducers/data/routeDataReducer";

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

export function AllLines({ routes }: { routes: RouteDataDictionary }) {
  const busLines = getBusLines(routes);
  const maxLines = getMaxLines(routes);
  const streetCarLines = getStreetCarLines(routes);
  const aerialTram = getAerialTram(routes);
  const wesCommuterRail = getWesCommuterRail(routes);

  return (
    <div>
      <h2>Max Light Rail</h2>
      {getRoutes(maxLines)}
      <h2>Portland Street Car</h2>
      {getRoutes(streetCarLines)}
      <h2>OHSU Aerial Tram</h2>
      {getRoutes(aerialTram)}
      <h2>WES Commuter Rail</h2>
      {getRoutes(wesCommuterRail)}
      <h2>Bus</h2>
      {getRoutes(busLines)}
    </div>
  );
}

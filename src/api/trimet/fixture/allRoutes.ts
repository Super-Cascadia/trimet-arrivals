import {
  BLUE_LINE_NUMBER,
  GREEN_LINE_NUMBER,
  ORANGE_LINE_NUMBER,
  RED_LINE_NUMBER,
  STREETCAR_A_LOOP,
  STREETCAR_B_LOOP,
  STREETCAR_S_LINE,
  YELLOW_LINE_NUMBER
} from "../constants";
import { Route, RouteDataResultSet } from "../interfaces/routes";

export function allRoutesFixtureData(): Promise<RouteDataResultSet> {
  const routeStopDirections = [];

  const route1 = {
    desc: "Route 1",
    dir: routeStopDirections,
    id: 1,
    route: 1,
    routeColor: "string",
    routeSortOrder: 123,
    type: "B"
  };

  const route2 = {
    desc: "Route 2",
    dir: routeStopDirections,
    id: 2,
    route: 2,
    routeColor: "string",
    routeSortOrder: 123,
    type: "B"
  };

  const route3 = {
    desc: "Route 3",
    dir: routeStopDirections,
    id: 3,
    route: 3,
    routeColor: "string",
    routeSortOrder: 123,
    type: "B"
  };

  const route4 = {
    desc: "Route 4",
    dir: routeStopDirections,
    id: 3,
    route: 3,
    routeColor: "string",
    routeSortOrder: 123,
    type: "B"
  };

  const blueLine = {
    desc: "Route 4",
    dir: routeStopDirections,
    id: BLUE_LINE_NUMBER,
    route: BLUE_LINE_NUMBER,
    routeColor: "string",
    routeSortOrder: 123,
    type: "T"
  };

  const redLine = {
    desc: "Route 4",
    dir: routeStopDirections,
    id: RED_LINE_NUMBER,
    route: RED_LINE_NUMBER,
    routeColor: "string",
    routeSortOrder: 123,
    type: "T"
  };

  const greenLine = {
    desc: "Route 4",
    dir: routeStopDirections,
    id: GREEN_LINE_NUMBER,
    route: GREEN_LINE_NUMBER,
    routeColor: "string",
    routeSortOrder: 123,
    type: "T"
  };

  const yellowLine = {
    desc: "Route 4",
    dir: routeStopDirections,
    id: YELLOW_LINE_NUMBER,
    route: YELLOW_LINE_NUMBER,
    routeColor: "string",
    routeSortOrder: 123,
    type: "T"
  };

  const orangeLine = {
    desc: "Route 4",
    dir: routeStopDirections,
    id: ORANGE_LINE_NUMBER,
    route: ORANGE_LINE_NUMBER,
    routeColor: "string",
    routeSortOrder: 123,
    type: "T"
  };

  const streetCarSLine = {
    desc: "Route 4",
    dir: routeStopDirections,
    id: STREETCAR_S_LINE,
    route: STREETCAR_S_LINE,
    routeColor: "string",
    routeSortOrder: 123,
    type: "S"
  };

  const streetCarBLoop = {
    desc: "Route 4",
    dir: routeStopDirections,
    id: STREETCAR_B_LOOP,
    route: STREETCAR_B_LOOP,
    routeColor: "string",
    routeSortOrder: 123,
    type: "S"
  };

  const streetCarALoop = {
    desc: "Route 4",
    dir: routeStopDirections,
    id: STREETCAR_A_LOOP,
    route: STREETCAR_A_LOOP,
    routeColor: "string",
    routeSortOrder: 123,
    type: "S"
  };

  const routes = [
    route1,
    route2,
    route3,
    route4,
    blueLine,
    redLine,
    greenLine,
    yellowLine,
    orangeLine,
    streetCarSLine,
    streetCarBLoop,
    streetCarALoop
  ] as Route[];

  const routeData = {
    route: routes
  };

  return Promise.resolve(routeData);
}

export interface RouteDirectionStop {
  lng: number;
  tp: boolean;
  dir: string;
  locid: number;
  seq: number;
  lat: number;
  desc: string;
}

export interface RouteStopDirection {
  stop: RouteDirectionStop[];
  dir: number;
  desc: string;
}

export interface Route {
  routeColor: string;
  route: number;
  id: number;
  type: string;
  dir: RouteStopDirection[];
  desc: string;
  routeSortOrder: number;
}

export interface RouteDataResultSet {
  route: Route[];
}

export interface RouteData {
  resultSet: RouteDataResultSet;
}

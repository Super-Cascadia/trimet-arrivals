interface RouteDirectionStop {
  lng: number;
  tp: boolean;
  dir: string;
  locid: number;
  seq: number;
  lat: number;
  desc: string;
}

interface RouteStopDirection {
  stop: RouteDirectionStop[];
  dir: number;
  desc: string;
}

interface Route {
  routeColor: string;
  route: number;
  id: number;
  type: string;
  dir: RouteStopDirection[];
  desc: string;
  routeSortOrder: number;
}

export interface RouteData {
  resultSet: {
    route: Route[];
  };
}

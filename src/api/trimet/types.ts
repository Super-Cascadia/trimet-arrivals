export interface ResponseBody {
    resultSet: StopData;
}

export interface TrimetResponse {
    body: ResponseBody;
}
  
export interface Location {
    coords: Coords;
}
  
export interface Coords {
    latitude: number;
    longitude: number;
}

export interface Direction {
    desc: string;
    dir: number;
}

export interface Route {
    desc: string;
    route: number;
    type: string;
    dir: Direction[];
}

export interface StopLocation {
    desc: string;
    dir: string;
    lat: number;
    lng: number;
    locid: number;
    route: Route[];
}

export interface StopData {
    queryTime: string;
    location: StopLocation[];
}
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

export interface TrimetRoute {
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
  locid?: number;
  id?: number;
  route?: TrimetRoute[];
}

export interface StopData {
  queryTime: string;
  location: StopLocation[];
}

export interface Trip {
  desc: string;
  destDist: number;
  dir: number;
  id: string;
  newTrip: boolean;
  pattern: number;
  progress: number;
  route: number;
}

export type TrimetResponseData = StopData | ArrivalData;

export interface ResponseBody {
  resultSet: StopData | ArrivalData;
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

export interface BlockPosition {
  at: number;
  direction: number;
  heading: number;
  id: number;
  lastLocID: number;
  lastStopSeq: number;
  lat: number;
  lng: number;
  newTrip: boolean;
  nextLocID: number;
  nextStopSeq: number;
  routeNumber: number;
  signMessage: string;
  signMesageLong: string;
  tripID: string;
  vehicleID: number;
  trip: Trip[];
}

export interface Arrival {
  id: string;
  locid: number;
  dir: number;
  feet: number;
  route: number;
  scheduled: number;
  status: string;
  tripID: string;
  vehicleID: string;
  blockID: number;
  departed: boolean;
  detoured: boolean;
  fullSign: string;
  newTrip: boolean;
  piece: string;
  dropOffOnly: boolean;
  blockPosition: BlockPosition;
  estimated: number;
  shortSign: string;
}

export interface ArrivalLocation {
  id: number;
}

export interface ArrivalData {
  arrival: Arrival[];
  location: ArrivalLocation[];
  queryTime: string;
}

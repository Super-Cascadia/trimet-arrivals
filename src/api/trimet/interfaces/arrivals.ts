import { Trip } from "./types";

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
  lng: number;
  passengerCode: string;
  id: number;
  dir: string;
  lat: number;
  desc: string;
}

export interface Detour {
  feet: number;
  blockId: number;
  route: number;
}

export interface ArrivalData {
  detour: Detour[];
  arrival: Arrival[];
  location: ArrivalLocation[];
  queryTime: string;
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

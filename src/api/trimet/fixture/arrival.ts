import { Arrival, BlockPosition } from "../interfaces/arrivals";
import { trip1 } from "./trip";

const blockPosition: BlockPosition = {
  at: 123,
  direction: 123,
  heading: 123,
  id: 123,
  lastLocID: 123,
  lastStopSeq: 123,
  lat: 123,
  lng: 123,
  newTrip: true,
  nextLocID: 123,
  nextStopSeq: 123,
  routeNumber: 123,
  signMessage: "123",
  signMessageLong: "123",
  trip: [trip1],
  tripID: "string",
  vehicleID: 123
};

// @ts-ignore
export const arrival1: Arrival = {
  blockID: 123,
  blockPosition,
  departed: true,
  detoured: true,
  dir: 123,
  dropOffOnly: false,
  estimated: 123,
  feet: 123,
  fullSign: "123",
  id: "123",
  locid: 123,
  newTrip: false,
  piece: "123123",
  route: 123,
  scheduled: 123,
  shortSign: "123",
  status: "123",
  tripID: "123",
  vehicleID: "123"
};

// @ts-ignore
export const arrival2: Arrival = {
  blockID: 123,
  blockPosition,
  departed: true,
  detoured: true,
  dir: 123,
  dropOffOnly: false,
  estimated: 123,
  feet: 123,
  fullSign: "123",
  id: "456",
  locid: 123,
  newTrip: false,
  piece: "123123",
  route: 123,
  scheduled: 123,
  shortSign: "456",
  status: "123",
  tripID: "123",
  vehicleID: "123"
};

// @ts-ignore
export const arrival3: Arrival = {
  blockID: 123,
  blockPosition,
  departed: true,
  detoured: true,
  dir: 123,
  dropOffOnly: false,
  estimated: 123,
  feet: 123,
  fullSign: "123",
  id: "789",
  locid: 123,
  newTrip: false,
  piece: "123123",
  route: 123,
  scheduled: 123,
  shortSign: "789",
  status: "123",
  tripID: "123",
  vehicleID: "123"
};

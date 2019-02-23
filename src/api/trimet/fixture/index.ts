import {
  Arrival,
  ArrivalData,
  ArrivalLocation,
  BlockPosition,
  Direction,
  Route,
  StopData,
  StopLocation,
  Trip
} from "../types";

export function arrivalsFixtureData(): Promise<ArrivalData> {
  const trip1: Trip = {
    desc: "string",
    destDist: 123,
    dir: 123,
    id: "string",
    newTrip: false,
    pattern: 123,
    progress: 123,
    route: 123
  };

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
    signMesageLong: "123",
    signMessage: "123",
    trip: [trip1],
    tripID: "string",
    vehicleID: 123
  };

  const arrival1: Arrival = {
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

  const location1: ArrivalLocation = {
    id: 123
  };

  const arrivalData: ArrivalData = {
    arrival: [arrival1, arrival1, arrival1],
    location: [location1],
    queryTime: "123"
  };

  return Promise.resolve(arrivalData);
}

export function stopFixtureData(): Promise<StopData> {
  const direction1: Direction = {
    desc: "foo",
    dir: 123
  };

  const route1: Route = {
    desc: "string",
    dir: [direction1],
    route: 123,
    type: "string"
  };

  const stopLocation1: StopLocation = {
    desc: "string",
    dir: "string",
    lat: 123,
    lng: 123,
    locid: 123,
    route: [route1]
  };

  const stopData: StopData = {
    location: [stopLocation1],
    queryTime: "123"
  };

  return Promise.resolve(stopData);
}

import { ArrivalData, ArrivalLocation } from "../interfaces/arrivals";
import {
  Direction,
  StopData,
  StopLocation,
  TrimetRoute
} from "../interfaces/types";
import { arrival1, arrival2, arrival3 } from "./arrival";

export function arrivalsFixtureData(): Promise<ArrivalData> {
  const location1: ArrivalLocation = {
    desc: "Description",
    dir: "direction",
    id: 123,
    lat: 0,
    lng: 0,

    passengerCode: "E"
  };
  const location2: ArrivalLocation = {
    desc: "Description",
    dir: "direction",
    id: 456,
    lat: 0,
    lng: 0,
    passengerCode: "E"
  };
  const location3: ArrivalLocation = {
    desc: "Description",
    dir: "direction",
    id: 789,
    lat: 0,
    lng: 0,
    passengerCode: "E"
  };

  const arrivalData: ArrivalData = {
    arrival: [arrival1, arrival2, arrival3],
    detour: [],
    location: [location1, location2, location3],
    queryTime: "123"
  };

  return Promise.resolve(arrivalData);
}

export function stopFixtureData(): Promise<StopData> {
  const direction1: Direction = {
    desc: "foo",
    dir: 465
  };

  const route1: TrimetRoute = {
    desc: "string",
    dir: [direction1],
    route: 9101,
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

  const stopLocation2: StopLocation = {
    desc: "string",
    dir: "string",
    lat: 123,
    lng: 123,
    locid: 456,
    route: [route1]
  };

  const stopLocation3: StopLocation = {
    desc: "string",
    dir: "string",
    lat: 123,
    lng: 123,
    locid: 789,
    route: [route1]
  };

  const stopData: StopData = {
    location: [stopLocation1, stopLocation2, stopLocation3],
    queryTime: "123"
  };

  return Promise.resolve(stopData);
}

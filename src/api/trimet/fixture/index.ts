import {
  ArrivalData,
  ArrivalLocation,
  Direction,
  StopData,
  StopLocation,
  TrimetRoute
} from "../interfaces/types";
import { arrival1, arrival2, arrival3 } from "./arrival";

export function arrivalsFixtureData(): Promise<ArrivalData> {
  const location1: ArrivalLocation = { id: 123 };

  const location2: ArrivalLocation = { id: 456 };

  const location3: ArrivalLocation = { id: 789 };

  const arrivalData: ArrivalData = {
    arrival: [arrival1, arrival2, arrival3],
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

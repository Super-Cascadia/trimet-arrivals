import {
  ArrivalData,
  ArrivalLocation,
  Direction,
  Route,
  StopData,
  StopLocation
} from "../types";
import { arrival1, arrival2, arrival3 } from "./arrival";

export function arrivalsFixtureData(): Promise<ArrivalData> {
  const location1: ArrivalLocation = {
    id: 123
  };

  const arrivalData: ArrivalData = {
    arrival: [arrival1, arrival2, arrival3],
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

import { get } from "superagent";
import { ArrivalData, StopData, TrimetResponse } from "./types";

export function getTrimetData(
  requestURI: string
): Promise<StopData & ArrivalData> {
  return new Promise((resolve: Function, reject: Function) => {
    get(requestURI).end((err: {}, res: TrimetResponse) => {
      resolve(res.body.resultSet);
    });
  });
}

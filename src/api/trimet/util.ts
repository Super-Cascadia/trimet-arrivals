import { get } from "superagent";
import { TrimetResponse } from "./types";

export function getTrimetData(
  requestURI: string
) {
  return new Promise((resolve) => {
    get(requestURI).end((err: {}, res: TrimetResponse) => {
      resolve(res.body.resultSet);
    });
  });
}

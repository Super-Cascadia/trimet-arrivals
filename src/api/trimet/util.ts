import { get } from "superagent";

export function getTrimetData<T>(requestURI: string): Promise<T> {
  return new Promise(resolve => {
    get(requestURI).end((err: {}, res) => {
      resolve(res.body.resultSet);
    });
  });
}

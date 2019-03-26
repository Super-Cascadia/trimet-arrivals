export function getTrimetData<T>(requestURI: string): Promise<T> {
  return fetch(requestURI)
    .then(res => {
      return res.json();
    })
    .then(json => {
      return json.resultSet;
    });
}

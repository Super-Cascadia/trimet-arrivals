export async function getTrimetData<T>(requestURI: string): Promise<T> {
  return fetch(requestURI)
    .then(res => res.json())
    .then(json => json.resultSet);
}

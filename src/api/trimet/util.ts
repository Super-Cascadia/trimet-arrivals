export async function getTrimetData<T>(requestURI: string): Promise<T> {
  return fetch(requestURI)
    .then(res => {
      if (!res.ok) {
        throw new Error(`Network response not ok (${res.status} ${res.statusText}) for ${requestURI}`);
      }
      return res.json();
    })
    .then(json => json.resultSet)
    .catch(err => {
      // Ensure we always reject with an Error object
      if (err instanceof Error) {
        throw err;
      }
      throw new Error(String(err));
    });
}


/**
 * Fetches data from the TriMet API and returns the resultSet.
 * 
 * @template T - The expected type of the resultSet data
 * @param {string} requestURI - The URI to fetch data from
 * @returns {Promise<T>} A promise that resolves to the resultSet from the API response
 * @throws {Error} If the network response is not ok or if the fetch operation fails
 */
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

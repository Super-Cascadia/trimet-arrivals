import { StopData, Location } from './types';
import { API, BASE_URL } from './constants';
import { getTrimetData } from './util';

const STOPS_BASE_URL = `${BASE_URL}V1/stops/`;  

function getURL(lat: number, long: number, radiusInFeet: number): string {
  const latLng = `${lat},${long}`;
  const feet = `feet/${radiusInFeet}`;

  return `${STOPS_BASE_URL}json/true/showRoutes/true/showRouteDirs/true/ll/${latLng}/${feet}/${API}`;  
}

function getNearbyStops(location: Location, radiusInFeet: number): Promise<StopData> {
    const { coords } = location;
    const { latitude, longitude } = coords;
    const request = getURL(latitude, longitude, radiusInFeet);

    return getTrimetData(request);
}

export {
    getNearbyStops
};

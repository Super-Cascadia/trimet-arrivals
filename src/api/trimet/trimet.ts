import { get } from 'superagent';
import { TrimetResponse, StopData, Location } from './types';

const BASE_URL = 'https://developer.trimet.org/ws/V1/';  
const STOPS = `${BASE_URL}stops/`;  
const API = 'appID/B1566B8AE694D0B955B73666A';

function getURL(lat: number, long: number, radiusInFeet: number): string {
  const latLng = `${lat},${long}`;
  const feet = `feet/${radiusInFeet}`;

  return `${STOPS}json/true/showRoutes/true/showRouteDirs/true/ll/${latLng}/${feet}/${API}`;  
}

function getNearbyStops(location: Location, radiusInFeet: number): Promise<StopData> {
    return new Promise((resolve: Function, reject: Function) => {
        const { coords } = location;
        const { latitude, longitude } = coords;
        const request = getURL(latitude, longitude, radiusInFeet);  
        
        get(request)
            .end((err: {}, res: TrimetResponse) => {
                resolve(res.body.resultSet);
            });
    });
}

export {
    getNearbyStops
};

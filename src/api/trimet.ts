import { get } from 'superagent';

const BASE_URL = 'https://developer.trimet.org/ws/V1/';  
const STOPS = `${BASE_URL}stops/`;  
const API = 'appID/B1566B8AE694D0B955B73666A';

function getURL(lat: number, long: number): string {
  const latLng = `${lat},${long}`;
  const feet = `feet/500`;

  return `${STOPS}json/true/showRoutes/true/showRouteDirs/true/ll/${latLng}/${feet}/${API}`;  
}

function getNearbyStops(location: Location): Promise<StopData> {
    return new Promise((resolve, reject) => {
        const { coords } = location;
        const { latitude, longitude } = coords;
        const request = getURL(latitude, longitude);  
        
        get(request)
            .end((err, res) => {
                resolve(res.body.resultSet);
            });
    });
}
  
export {
    getNearbyStops
};

export interface Location {
    coords: Coords;
}
  
export interface Coords {
    latitude: number;
    longitude: number;
}

export interface Direction {
    desc: string;
    dir: number;
}

export interface Route {
    desc: string;
    route: number;
    type: string;
    dir: Direction[];
}

export interface StopLocation {
    desc: string;
    dir: string;
    lat: number;
    lng: number;
    locid: number;
    route: Route[];
}

export interface StopData {
    queryTime: string;
    location: StopLocation[];
}
import { API, BASE_URL } from './constants';
import { getTrimetData } from './util';
import { ArrivalData } from './types';

const ARRIVALS_BASE_URL = `${BASE_URL}V2/arrivals/`;  

function getURL(locIDs: string, minutes: number): string {
  return `${ARRIVALS_BASE_URL}json/true/locIDs/${locIDs}/showPosition/true/minutes/${minutes}/${API}`;  
}

function getArrivals(locIDs: string, minutes: number): Promise<ArrivalData> {
    const request = getURL(locIDs, minutes);

    return getTrimetData(request);
}

export {
    getArrivals
};

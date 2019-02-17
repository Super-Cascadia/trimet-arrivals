import { Location } from '../trimet/types';

export function getCurrentPosition() {
    return new Promise((resolve: Function, reject: Function) => {
        navigator.geolocation.getCurrentPosition((location: Location) => {
            resolve(location);
        });
    });
}
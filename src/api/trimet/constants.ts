export const BASE_URL = "https://developer.trimet.org/ws/";
export const API_ID = "B1566B8AE694D0B955B73666A";
export const API = `appID/${API_ID}`;

export const RED_LINE_NUMBER = 90;
export const BLUE_LINE_NUMBER = 100;

export const ROUTE_DISPLAY = {
  90: "Red",
  100: "Blue"
} as Routes;

interface Routes {
  [routeNumber: number]: string;
}

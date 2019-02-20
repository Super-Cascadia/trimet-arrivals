export const BASE_URL = "https://developer.trimet.org/ws/";
export const API_ID = "B1566B8AE694D0B955B73666A";
export const API = `appID/${API_ID}`;

export const RED_LINE_NUMBER = 90;
export const BLUE_LINE_NUMBER = 100;
export const GREEN_LINE_NUMBER = 200;
export const YELLOW_LINE_NUMBER = 190;
export const ORANGE_LINE_NUMBER = 290;

export const ROUTE_DISPLAY: Routes = {
  [RED_LINE_NUMBER]: "Red",
  [BLUE_LINE_NUMBER]: "Blue",
  [GREEN_LINE_NUMBER]: "Green",
  [YELLOW_LINE_NUMBER]: "Yellow",
  [ORANGE_LINE_NUMBER]: "Orange"
};

interface Routes {
  [routeNumber: number]: string;
}

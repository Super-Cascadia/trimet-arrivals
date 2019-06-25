export const BASE_URL = "https://developer.trimet.org/ws/";
export const API_ID = "B1566B8AE694D0B955B73666A";
export const API = `appID/${API_ID}`;

export const RED_LINE_NUMBER = 90;
export const BLUE_LINE_NUMBER = 100;
export const GREEN_LINE_NUMBER = 200;
export const YELLOW_LINE_NUMBER = 190;
export const ORANGE_LINE_NUMBER = 290;
export const STREETCAR_S_LINE = 196;
export const STREETCAR_B_LOOP = 195;
export const STREETCAR_A_LOOP = 194;
export const STREETCAR_CL_LINE_SHUTTLE = 294;

export const ROUTE_DISPLAY: Routes = {
  [RED_LINE_NUMBER]: "Red",
  [BLUE_LINE_NUMBER]: "Blue",
  [GREEN_LINE_NUMBER]: "Green",
  [YELLOW_LINE_NUMBER]: "Yellow",
  [ORANGE_LINE_NUMBER]: "Orange",
  [STREETCAR_A_LOOP]: "A Loop",
  [STREETCAR_B_LOOP]: "B Loop",
  [STREETCAR_S_LINE]: "NS Line",
  [STREETCAR_CL_LINE_SHUTTLE]: "CL Line"
};

interface Routes {
  [routeNumber: number]: string;
}

export const getRouteColor = (routeId: string) => {
  switch (parseInt(routeId, 10)) {
    case RED_LINE_NUMBER:
      return "red";
    case BLUE_LINE_NUMBER:
      return "blue";
    case GREEN_LINE_NUMBER:
      return "green";
    case YELLOW_LINE_NUMBER:
      return "yellow";
    case ORANGE_LINE_NUMBER:
      return "orange";
    case STREETCAR_B_LOOP:
      return "#cc3e8b";
    case STREETCAR_S_LINE:
      return "#99C354";
    case STREETCAR_CL_LINE_SHUTTLE || STREETCAR_A_LOOP:
      return "#3D8FAE";
    default:
      return "#1e4d88";
  }
};

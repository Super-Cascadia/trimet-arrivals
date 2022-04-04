import { TrimetRoute } from "./routes";

export interface Location {
  desc: string;
  dir: string;
  id: number;
  lat: number;
  lng: number;
  no_service_flag: boolean;
  passengerCode: string;
}

export interface Alert {
  route: TrimetRoute[];
  info_link_url: string;
  end: number;
  system_wide_flag: boolean;
  id: number;
  header_text: string;
  begin: number;
  desc: string;
  location?: Location[];
}

export interface AlertsData {
  alert: Alert[];
  queryTime: string;
}

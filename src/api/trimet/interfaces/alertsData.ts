import { TrimetRoute } from "./routes";

export interface Alert {
  route: TrimetRoute[];
  info_link_url: string;
  end: number;
  system_wide_flag: boolean;
  id: number;
  header_text: string;
  begin: number;
  desc: string;
  location?: Location;
}

export interface AlertsData {
  alert: Alert[];
  queryTime: string;
}

import { Route } from "./routes";

export interface Alert {
  route: Route[];
  info_link_url: string;
  end: number;
  system_wide_flag: boolean;
  id: number;
  header_text: string;
  begin: number;
  desc: string;
}

export interface AlertsData {
  alert: Alert[];
  queryTime: string;
}

import React from "react";

import { LinesViewSubRoutes } from "../../../routes/LinesSubRoutes";
import "./LinesViewComponent.scss";
import ServiceNavigation from "./ServiceNavigation";

export default function LinesViewComponent() {
  return (
    <div id="lines-view">
      <br />
      <ServiceNavigation />
      <LinesViewSubRoutes />
    </div>
  );
}

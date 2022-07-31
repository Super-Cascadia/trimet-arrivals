import React from "react";

import { Outlet } from "react-router";
import "./LinesViewComponent.scss";
import ServiceNavigation from "./ServiceNavigation";

export default function LinesViewComponent() {
  return (
    <div id="lines-view">
      <br />
      <ServiceNavigation />
      <Outlet />
    </div>
  );
}

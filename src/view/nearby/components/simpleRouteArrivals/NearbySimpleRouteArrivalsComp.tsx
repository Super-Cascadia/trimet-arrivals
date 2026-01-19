import React from "react";
import { useOutletContext } from "react-router";
import NearbySimpleRouteArrivals from "./NearbySimpleRouteArrivals";
import { NearbyViewComponentOutletContextProps } from "../../context/NearbyViewContext";

export function NearbySimpleRouteArrivalsComp() {
  const { handleRouteArrivalsOpened } = useOutletContext<
    NearbyViewComponentOutletContextProps
  >();

  return (
    <NearbySimpleRouteArrivals
      handleRouteArrivalsOpened={handleRouteArrivalsOpened}
    />
  );
}

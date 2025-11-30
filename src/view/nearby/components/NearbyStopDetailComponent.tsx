import React from "react";
import { useOutletContext } from "react-router";
import { NearbyStopsDetail } from "./NearbyStopsDetail";
import { NearbyViewComponentOutletContextProps } from "../context/NearbyViewContext";

export function NearbyStopDetailComponent() {
  const { currentLocation, handleStopOpened } = useOutletContext<
    NearbyViewComponentOutletContextProps
  >();
  return (
    <NearbyStopsDetail
      currentLocation={currentLocation}
      handleStopOpened={handleStopOpened}
    />
  );
}

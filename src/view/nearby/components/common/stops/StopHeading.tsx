import React from "react";
import { StopLocation } from "../../../../../api/trimet/interfaces/types";
import StopLocationIndicator from "../../../../../component/stop/StopLocationIndicator";
import { DistanceDisplay } from "../arrivals/DistanceDisplay";

import { StopDescription } from "./StopDescription";

interface StopHeadingProps {
  stopLocation: StopLocation;
  currentLocation: number[];
  distanceDescription: string;
}

/**
 * Displays a heading for a transit stop with location indicator, description, and distance information.
 * 
 * @param props - The component props
 * @param props.stopLocation - The stop location data including ID, description, and direction
 * @param props.currentLocation - The user's current location coordinates [longitude, latitude]
 * @param props.distanceDescription - A formatted string describing the distance to the stop
 * @returns A heading element containing stop information and distance display
 */
export function StopHeading({
  stopLocation,
  currentLocation,
  distanceDescription
}: StopHeadingProps) {
  return (
    <h2 className="stop-heading">
      <StopLocationIndicator
        locationId={stopLocation.locid}
        nearbyStops={true}
      />
      <div className="stop-info">
        <StopDescription stopLocation={stopLocation} />
        {/* Distance directly below stop name */}
        <div className="stop-distance">
          <DistanceDisplay 
            distanceString={distanceDescription} 
            currentLocation={currentLocation} 
            stopLocation={stopLocation} 
          />
        </div>
      </div>
    </h2>
  );
}

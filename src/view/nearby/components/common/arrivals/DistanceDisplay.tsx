import React from "react";
import { StopLocation } from "../../../../../api/trimet/interfaces/types";
import "./SimpleArrivalListItem.scss"; // Reusing existing styles for now, or create a new one if needed

interface DistanceDisplayProps {
  distanceString?: string;
  currentLocation?: number[];
  stopLocation?: StopLocation;
}

function getDirectionArrow(currentLocation: number[], stopLocation: StopLocation): string {
  if (!currentLocation || !stopLocation) return "";
  
  // Calculate bearing from current location to stop
  const lat1 = currentLocation[1] * Math.PI / 180;
  const lat2 = stopLocation.lat * Math.PI / 180;
  const dLon = (stopLocation.lng - currentLocation[0]) * Math.PI / 180;
  
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  const bearing = Math.atan2(y, x) * 180 / Math.PI;
  
  // Normalize to 0-360
  const normalizedBearing = (bearing + 360) % 360;
  
  // Convert to 8-direction arrow (N, NE, E, SE, S, SW, W, NW)
  const directions = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'];
  const index = Math.round(normalizedBearing / 45) % 8;
  
  return directions[index];
}

export function DistanceDisplay({ distanceString, currentLocation, stopLocation }: DistanceDisplayProps) {
  if (!distanceString) return null;

  const directionArrow = currentLocation && stopLocation 
    ? getDirectionArrow(currentLocation, stopLocation) 
    : "";

  return (
    <div>
      {directionArrow && <span className="direction-arrow">{directionArrow} </span>}
      {distanceString}
    </div>
  );
}

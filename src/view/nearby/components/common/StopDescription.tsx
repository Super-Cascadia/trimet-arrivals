import React from "react";
import { StopLocation } from "../../../../api/trimet/interfaces/types";

interface StopDescriptionProps {
  stopLocation: StopLocation;
}

/**
 * Displays the description and direction of a transit stop.
 * 
 * @param props - The component props
 * @param props.stopLocation - The stop location data including description and direction
 * @returns A div element containing the stop description and optional direction
 */
export function StopDescription({ stopLocation }: StopDescriptionProps) {
  return (
    <div>
      {stopLocation.desc}
      {stopLocation.dir && (
        <span className="text-muted" style={{ marginLeft: '8px', fontSize: '0.9em' }}>
          ({stopLocation.dir})
        </span>
      )}
    </div>
  );
}

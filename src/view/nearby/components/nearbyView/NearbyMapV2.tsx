import React, { useEffect } from "react";
import "./NearbyMapV2.scss";

export type LatLngCoords = number[];

// styles moved to NearbyMapV2.scss

interface Props {
  zoom: number;
  mapRef: any;
  mapContainerRef: any;
  currentLocation: LatLngCoords;
  initializeMap: () => void;
}

function NearbyMapV2({
  zoom,
  currentLocation,
  initializeMap,
  mapContainerRef
}: Props) {
  const lng = currentLocation[0];
  const lat = currentLocation[1];

  // Initialize Map
  useEffect(() => {
    initializeMap();
  }, []);

  // @ts-ignore
  const mapBoxMap = <div className="nearby-map-box" ref={mapContainerRef} />;

  return (
    <div className="nearby-map-container">
      {mapBoxMap}
    </div>
  );
}

export default NearbyMapV2;

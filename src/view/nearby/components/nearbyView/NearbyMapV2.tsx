import React, { useEffect } from "react";

export type LatLngCoords = number[];

const style = {
  height: "100%",
  position: "absolute",
  top: 0,
  bottom: 0,
  width: "100%"
};

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
  const mapBoxMap = <div style={style} ref={mapContainerRef} />;

  return (
    <div style={{ flex: 1, position: "relative", minHeight: "300px" }}>
      {mapBoxMap}
    </div>
  );
}

export default NearbyMapV2;

import React, { useEffect } from "react";

export type LatLngCoords = number[];

const style = {
  height: `calc(100vh - 100px)`,
  position: "relative",
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
  mapContainerRef,
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
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      {mapBoxMap}
    </div>
  );
}

export default NearbyMapV2;

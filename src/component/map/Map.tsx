import mapboxgl from "mapbox-gl";
import React, { Component } from "react";
import { setCurrentLocationMarker } from "../../view/nearby/util/currentLocationMarker.util";
import { mountMapCenteredOnLocation } from "../../view/nearby/util/mapboxUtils";

mapboxgl.accessToken =
  "pk.eyJ1IjoiamFtZXNvbm55ZWhvbHQiLCJhIjoiY2p3NWoyamV0MTk1dDQ0cGNmdGZkenViMiJ9.TqDD3r62vlPzVgPnYjocsg";

export type LatLngCoords = number[];

interface Props {
  currentLocation: LatLngCoords;
}

class Map extends Component<Props> {
  private mapContainer: HTMLDivElement;
  private map: mapboxgl.Map;

  public componentDidMount() {
    const { currentLocation } = this.props;
    this.initializeMap(currentLocation);
  }

  public componentWillUnmount() {
    this.map.remove();
  }

  public render() {
    const style = {
      height: 400,
      position: "relative",
      width: "100%"
    };
    // @ts-ignore
    const map = <div style={style} ref={el => (this.mapContainer = el)} />;

    return (
      <div>
        {map}
        <br />
        <br />
      </div>
    );
  }

  private initializeMap(currentLocation: LatLngCoords) {
    this.map = mountMapCenteredOnLocation(this.mapContainer, currentLocation);
    this.map.on("load", () => {
      setCurrentLocationMarker(this.map, currentLocation);
    });
  }
}

export default Map;

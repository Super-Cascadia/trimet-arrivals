import mapboxgl from "mapbox-gl";
import React, { Component } from "react";
import data from "../../data/1/1_0.json";
import { StopLocationsDictionary } from "../../store/reducers/stopsReducer";
import {
  mountMapCenteredOnLocation,
  setCurrentLocationMarker,
  setNearbyStopMarkers
} from "./util/mapboxUtils";

mapboxgl.accessToken =
  "pk.eyJ1IjoiamFtZXNvbm55ZWhvbHQiLCJhIjoiY2p3NWoyamV0MTk1dDQ0cGNmdGZkenViMiJ9.TqDD3r62vlPzVgPnYjocsg";

export type LatLngCoords = number[];

interface Props {
  currentLocation: LatLngCoords;
  stopLocations: StopLocationsDictionary;
}

export default class NearbyStopsMap extends Component<Props> {
  private mapContainer: HTMLDivElement;
  private map: mapboxgl.Map;

  public componentDidMount() {
    this.initializeMap(this.props.currentLocation, this.props.stopLocations);
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
    return <div style={style} ref={el => (this.mapContainer = el)} />;
  }

  private initializeMap(
    currentLocation: LatLngCoords,
    stopLocations: StopLocationsDictionary
  ) {
    // tslint:disable
    console.log(data);
    // tslint:enable

    this.map = mountMapCenteredOnLocation(this.mapContainer, currentLocation);

    this.map.on("load", () => {
      setNearbyStopMarkers(this.map, stopLocations);
      setCurrentLocationMarker(this.map, currentLocation);
    });
  }
}

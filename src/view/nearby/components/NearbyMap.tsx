import mapboxgl from "mapbox-gl";
import React, { Component } from "react";
import { StopLocationsDictionary } from "../../../store/reducers/util/formatStopLocations";
import { NearbyRoutesDictionary } from "../../../store/reducers/view/nearbyRoutesViewReducer";
import { setCurrentLocationMarker } from "../util/currentLocationMarker.util";
import {
  mountMapCenteredOnLocation,
  setNearbyStopMarkers,
  setRoutes
} from "../util/mapboxUtils";
export type LatLngCoords = number[];

interface Props {
  currentLocation: LatLngCoords;
  stopLocations: StopLocationsDictionary;
  nearbyRouteIds: NearbyRoutesDictionary;
}

export default class NearbyMap extends Component<Props> {
  private mapContainer: HTMLDivElement;
  private map: mapboxgl.Map;

  public componentDidMount() {
    const { currentLocation, stopLocations, nearbyRouteIds } = this.props;
    if (currentLocation && stopLocations && nearbyRouteIds) {
      this.initializeMap(currentLocation, stopLocations, nearbyRouteIds);
    }
  }

  public componentWillUnmount() {
    if (this.map) {
      this.map.remove();
    }
  }

  public render() {
    const style = {
      height: 800,
      position: "relative",
      width: "100%"
    };
    // @ts-ignore
    return <div style={style} ref={el => (this.mapContainer = el)} />;
  }

  private initializeMap(
    currentLocation: LatLngCoords,
    stopLocations: StopLocationsDictionary,
    nearbyRouteIds: NearbyRoutesDictionary
  ) {
    this.map = mountMapCenteredOnLocation(this.mapContainer, currentLocation);
    this.map.on("load", () => {
      setNearbyStopMarkers(this.map, stopLocations);
      setCurrentLocationMarker(this.map, currentLocation);
      setRoutes(this.map, nearbyRouteIds);
    });
  }
}

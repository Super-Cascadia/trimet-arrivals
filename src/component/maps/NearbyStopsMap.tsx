import { map } from "lodash";
import mapboxgl from "mapbox-gl";
import React, { Component } from "react";
import { StopLocation } from "../../api/trimet/types";
import { StopLocationsDictionary } from "../../store/reducers/stopsReducer";

mapboxgl.accessToken =
  "pk.eyJ1IjoiamFtZXNvbm55ZWhvbHQiLCJhIjoiY2p3NWoyamV0MTk1dDQ0cGNmdGZkenViMiJ9.TqDD3r62vlPzVgPnYjocsg";

type LatLngCoords = number[];

interface Props {
  currentLocation: LatLngCoords;
  stopLocations: StopLocationsDictionary;
}

export default class NearbyStopsMap extends Component<Props> {
  private static setCurrentLocationMarker(
    mapBoxMap,
    currentLocation: LatLngCoords
  ) {
    if (currentLocation) {
      mapBoxMap.addLayer({
        id: "currentlocation",
        layout: {
          "icon-image": "rocket-15"
        },
        source: {
          data: {
            features: [
              {
                geometry: {
                  coordinates: currentLocation,
                  type: "Point"
                },
                properties: {},
                type: "Feature"
              }
            ],
            type: "FeatureCollection"
          },
          type: "geojson"
        },
        type: "symbol"
      });
    }
  }

  private static setLocations(stopLocations: StopLocationsDictionary) {
    return map(stopLocations, (stopLocation: StopLocation) => {
      return {
        geometry: {
          coordinates: [stopLocation.lng, stopLocation.lat],
          type: "Point"
        },
        properties: {},
        type: "Feature"
      };
    });
  }

  private static setNearbyStopMarkers(
    mapBoxMap,
    stopLocations: StopLocationsDictionary
  ) {
    mapBoxMap.addLayer({
      id: "symbols",
      layout: {
        "icon-image": "bus-15"
      },
      source: {
        data: {
          features: NearbyStopsMap.setLocations(stopLocations),
          type: "FeatureCollection"
        },
        type: "geojson"
      },
      type: "symbol"
    });

    // Center the map on the coordinates of any clicked symbol from the 'symbols' layer.
    mapBoxMap.on("click", "symbols", e => {
      mapBoxMap.flyTo({ center: e.features[0].geometry.coordinates });
    });

    // Change the cursor to a pointer when the it enters a feature in the 'symbols' layer.
    mapBoxMap.on("mouseenter", "symbols", () => {
      mapBoxMap.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    mapBoxMap.on("mouseleave", "symbols", () => {
      mapBoxMap.getCanvas().style.cursor = "";
    });
  }

  private static setMapFeatures(
    mapBoxMap,
    stopLocations: StopLocationsDictionary,
    currentLocation: LatLngCoords
  ) {
    mapBoxMap.on("load", () => {
      NearbyStopsMap.setNearbyStopMarkers(mapBoxMap, stopLocations);
      NearbyStopsMap.setCurrentLocationMarker(mapBoxMap, currentLocation);
    });
  }

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
    this.map = new mapboxgl.Map({
      // @ts-ignore
      center: currentLocation,
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v9",
      zoom: 15.25
    });

    NearbyStopsMap.setMapFeatures(this.map, stopLocations, currentLocation);
  }
}

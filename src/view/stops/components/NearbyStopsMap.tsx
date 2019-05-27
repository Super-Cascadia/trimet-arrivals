import { map } from "lodash";
import mapboxgl from "mapbox-gl";
import React, { Component } from "react";
import { StopLocation } from "../../../api/trimet/types";
import { StopLocationsDictionary } from "../../../store/reducers/stopsReducer";

mapboxgl.accessToken =
  "pk.eyJ1IjoiamFtZXNvbm55ZWhvbHQiLCJhIjoiY2p3NWoyamV0MTk1dDQ0cGNmdGZkenViMiJ9.TqDD3r62vlPzVgPnYjocsg";

interface Props {
  currentLocation: number[];
  stopLocations: StopLocationsDictionary;
}

export default class NearbyStopsMap extends Component<Props> {
  private static getStopLocations(stopLocations: StopLocationsDictionary) {
    return map(stopLocations, (stopLocation: StopLocation) => {
      return {
        geometry: {
          coordinates: [stopLocation.lng, stopLocation.lat],
          type: "Point"
        },
        properties: {
          description: `${stopLocation.dir} | ${stopLocation.desc}`,
          title: `${stopLocation.dir} | ${stopLocation.desc}`
        },
        type: "Feature"
      };
    });
  }

  private static getCurrentLocation(currentLocation) {
    return {
      currentLocation: true,
      geometry: {
        coordinates: currentLocation,
        type: "Point"
      },
      properties: {
        description: "Map Center",
        title: "Map Center"
      },
      type: "Feature"
    };
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

  private initializeMap(currentLocation, stopLocations) {
    this.map = new mapboxgl.Map({
      center: currentLocation,
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v9",
      zoom: 15.25
    });

    this.setMapFeatures(this.map, stopLocations, currentLocation);
  }

  private setMapFeatures(mapBoxMap, stopLocations, currentLocation) {
    const geojson = {
      features: [
        NearbyStopsMap.getCurrentLocation(currentLocation),
        ...NearbyStopsMap.getStopLocations(stopLocations)
      ],
      type: "FeatureCollection"
    };

    geojson.features.forEach(marker => {
      // create a HTML element for each feature
      const el = document.createElement("div");

      // @ts-ignore
      el.className =
        marker && marker.currentLocation === true ? "marker-current" : "marker";

      // make a marker for each feature and add to the map
      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .addTo(mapBoxMap);

      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(
              "<h3>" +
                marker.properties.title +
                "</h3><p>" +
                marker.properties.description +
                "</p>"
            )
        )
        .addTo(mapBoxMap);
    });
  }
}

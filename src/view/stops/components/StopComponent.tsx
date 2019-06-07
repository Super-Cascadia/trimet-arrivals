import React from "react";
import { Route } from "../../../api/trimet/types";
import { StopLocationWithDistance } from "../../../store/reducers/stopsReducer";
import ArrivalsContainer from "../../arrivals/containers/ArrivalsContainer";
import "../Stops.css";
import StopsTableHeader from "./StopsTableHeader";

interface Props {
  stopLocation: StopLocationWithDistance;
  loadArrivalData: (locationId: number) => TimerHandler;
  locationId: number;
  loading: boolean;
  showArrivals: boolean;
  onRouteIndicatorClick?: (route: Route) => void;
}

const interval = 30000;

export default class StopComponent extends React.Component<Props> {
  public refreshInterval: {};
  private loadArrivalData: (locId: number) => void;

  constructor(props) {
    super(props);

    this.loadArrivalData = (locId: number) => this.loadArrivals(locId);
  }

  public loadAndSetInterval(locationId: number) {
    const { loadArrivalData } = this.props;
    loadArrivalData(locationId);
    this.refreshInterval = setInterval(loadArrivalData(locationId), interval);
  }

  public loadArrivals(locationId: number) {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval as number);
    }
    this.loadAndSetInterval(locationId);
  }

  public render() {
    const {
      stopLocation,
      locationId,
      loading,
      showArrivals,
      onRouteIndicatorClick
    } = this.props;

    return (
      <article className="stop">
        <StopsTableHeader
          stopLocation={stopLocation}
          loadArrivalData={this.loadArrivalData}
          loading={loading}
          showArrivals={showArrivals}
          onRouteIndicatorClick={onRouteIndicatorClick}
          locationId={locationId}
        />
        {showArrivals && (
          <ArrivalsContainer
            locationId={locationId}
            showArrivals={showArrivals}
            loadArrivalData={this.loadArrivalData}
            onRouteIndicatorClick={onRouteIndicatorClick}
            stopLocation={stopLocation}
          />
        )}
      </article>
    );
  }
}

import React from "react";
import { Route, StopLocation } from "../../../api/trimet/types";
import ArrivalsContainer from "../../arrivals/containers/ArrivalsContainer";
import "../Stops.css";
import StopsTableHeader from "./StopsTableHeader";

interface Props {
  stopLocation: StopLocation;
  loadArrivalData: (locationId: number) => TimerHandler;
  locationId: number;
  loading: boolean;
  showArrivals: boolean;
  onRouteIndicatorClick: (route: Route) => void;
  onBookmarkClick: (
    stopLocation: StopLocation,
    stopIsBookmarked: boolean
  ) => void;
  stopIsBookmarked: boolean;
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
      onRouteIndicatorClick,
      onBookmarkClick,
      stopIsBookmarked
    } = this.props;

    return (
      <article className="stop">
        <StopsTableHeader
          stopLocation={stopLocation}
          loadArrivalData={this.loadArrivalData}
          loading={loading}
          showArrivals={showArrivals}
          onRouteIndicatorClick={onRouteIndicatorClick}
          onBookmarkClick={onBookmarkClick}
          stopIsBookmarked={stopIsBookmarked}
        />
        <ArrivalsContainer
          locationId={locationId}
          showArrivals={showArrivals}
          loadArrivalData={this.loadArrivalData}
          onRouteIndicatorClick={onRouteIndicatorClick}
          stopLocation={stopLocation}
        />
      </article>
    );
  }
}

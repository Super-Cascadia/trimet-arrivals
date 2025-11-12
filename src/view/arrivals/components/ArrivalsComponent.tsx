import { Moment } from "moment";
import React from "react";
import { Arrival } from "../../../api/trimet/interfaces/arrivals";
import {
  StopLocation,
  TrimetRoute
} from "../../../api/trimet/interfaces/types";
import { LoadArrivalData } from "../../../store/action/stopActions";
import "../Arrivals.css";
import ArrivalsTableLoadMore from "./ArrivalsTableLoadMore";

interface Props {
  loading: boolean;
  locationId: number;
  arrivals: Arrival[];
  loadArrivalData: LoadArrivalData;
  showArrivals: boolean;
  now: Moment;
  stopLocation: StopLocation;
  onRouteIndicatorClick: (route: TrimetRoute) => void;
}

export default class ArrivalsComponent extends React.Component<Props> {
  public componentDidMount() {
    const { loadArrivalData, locationId, showArrivals } = this.props;

    if (showArrivals) {
      loadArrivalData(locationId);
    }
  }
  public render() {
    const {
      arrivals,
      loading = true,
      showArrivals = true,
      now,
      onRouteIndicatorClick,
      stopLocation
    } = this.props;

    return (
      <div className="arrivals-wrapper">
        {!loading && showArrivals && !arrivals && (
          <p className="no-arrivals">No arrivals available.</p>
        )}
        {showArrivals && arrivals && (
          <ArrivalsTableLoadMore
            arrivals={arrivals}
            loading={loading}
            now={now}
            onRouteIndicatorClick={onRouteIndicatorClick}
            stopLocation={stopLocation}
          />
        )}
      </div>
    );
  }
}

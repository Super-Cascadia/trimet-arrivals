import cx from "classnames";
import React from "react";
import { Route, StopLocation } from "../../../api/trimet/types";
import { LoadArrivalData } from "../../../store/action/stopActions";
import StopBookmarkControlContainer from "../containers/StopBookmarkControlContainer";
import "../Stops.css";
import ReloadIntervalCoordinator from "./ReloadIntervalCoordinator";
import StopInfo from "./StopInfo";

interface Props {
  stopLocation: StopLocation;
  loadArrivalData: LoadArrivalData;
  loading: boolean;
  showArrivals: boolean;
  onRouteIndicatorClick: (route: Route) => void;
  locationId: number;
}

export default class StopsTableHeader extends React.Component<Props> {
  public render() {
    const {
      stopLocation,
      loading,
      showArrivals,
      loadArrivalData,
      onRouteIndicatorClick,
      locationId
    } = this.props;

    if (!stopLocation) {
      return null;
    }

    const classNames = cx("stops-header", {
      "arrivals-hidden": !showArrivals
    });

    return (
      <div className={classNames}>
        <StopInfo stopLocation={stopLocation} onClick={onRouteIndicatorClick} />
        <StopBookmarkControlContainer
          locationId={locationId}
          stopLocation={stopLocation}
        />
        <ReloadIntervalCoordinator
          stopLocation={stopLocation}
          loadArrivalData={loadArrivalData}
          loading={loading}
          showArrivals={showArrivals}
        />
      </div>
    );
  }
}

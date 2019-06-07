import cx from "classnames";
import React from "react";
import { Route } from "../../../api/trimet/types";
import { LoadArrivalData } from "../../../store/action/stopActions";
import { StopLocationWithDistance } from "../../../store/reducers/stopsReducer";
import StopBookmarkControlContainer from "../containers/StopBookmarkControlContainer";
import ReloadIntervalCoordinator from "./ReloadIntervalCoordinator";
import StopInfo from "./StopInfo";
import "./StopsTableHeader.css";

interface Props {
  stopLocation: StopLocationWithDistance;
  loadArrivalData: LoadArrivalData;
  loading: boolean;
  showArrivals: boolean;
  onRouteIndicatorClick: (route: Route) => void;
  locationId: number;
}

export default function StopsTableHeader(props: Props) {
  const {
    stopLocation,
    loading,
    showArrivals,
    loadArrivalData,
    onRouteIndicatorClick,
    locationId
  } = props;

  if (!stopLocation) {
    return null;
  }

  const classNames = cx("stops-header", {
    "arrivals-hidden": !showArrivals
  });

  return (
    <div className={classNames}>
      <StopInfo stopLocation={stopLocation} onClick={onRouteIndicatorClick} />
      <div className="stop-control-section">
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
    </div>
  );
}

import React from "react";
import { StopLocation } from "../../../api/trimet/types";
import { LoadArrivalData } from "../../../store/action/stopActions";
import "../Stops.css";
import ReloadIntervalCoordinator from "./ReloadIntervalCoordinator";
import StopInfo from "./StopInfo";

interface Props {
  stopLocation: StopLocation;
  loadArrivalData: LoadArrivalData;
  loading: boolean;
  showArrivals: boolean;
}

export default class StopsTableHeader extends React.Component<Props> {
  public render() {
    const { stopLocation, loading, showArrivals, loadArrivalData } = this.props;

    if (!stopLocation) {
      return null;
    }

    return (
      <div className="stops-header">
        <StopInfo stopLocation={stopLocation} />
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

import React from "react";
import { Route, StopLocation } from "../../../api/trimet/types";
import BookmarkButton from "../../../component/buttons/BookmarksButton";
import { LoadArrivalData } from "../../../store/action/stopActions";
import "../Stops.css";
import ReloadIntervalCoordinator from "./ReloadIntervalCoordinator";
import StopInfo from "./StopInfo";

interface Props {
  stopLocation: StopLocation;
  loadArrivalData: LoadArrivalData;
  loading: boolean;
  showArrivals: boolean;
  onRouteIndicatorClick: (route: Route) => void;
  onBookmarkClick: (
    stopLocation: StopLocation,
    stopIsBookmarked: boolean
  ) => void;
  stopIsBookmarked: boolean;
}

export default class StopsTableHeader extends React.Component<Props> {
  public render() {
    const {
      stopLocation,
      loading,
      showArrivals,
      loadArrivalData,
      onRouteIndicatorClick,
      onBookmarkClick,
      stopIsBookmarked
    } = this.props;

    if (!stopLocation) {
      return null;
    }

    return (
      <div className="stops-header">
        <StopInfo stopLocation={stopLocation} onClick={onRouteIndicatorClick} />
        <BookmarkButton
          onBookmarkClick={onBookmarkClick}
          stopLocation={stopLocation}
          stopIsBookmarked={stopIsBookmarked}
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

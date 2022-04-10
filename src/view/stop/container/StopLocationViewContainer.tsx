import { connect } from "react-redux";
import { StopLocation } from "../../../api/trimet/interfaces/types";
import {
  bookmarkStopRequest,
  removeStopBookmarkRequest
} from "../../../store/action/bookmarkActions";
import { loadArrivalDataRequest } from "../../../store/action/stopActions";
import { RootState } from "../../../store/reducers";
import { stopIsBookmarkedSelector } from "../../../store/selectors/bookmarkSelectors";
import { arrivalsSelector } from "../../../store/selectors/data/arrivalsDataSelectors";
import StopLocationView from "../component/StopLocationView";

interface ReceivedProps {
  locationId: number;
}

const mapStateToProps = (state: RootState, props: ReceivedProps) => {
  return {
    ...props,
    arrivals: arrivalsSelector(state, props.locationId),
    stopIsBookmarked: stopIsBookmarkedSelector(state, props.locationId)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadArrivalData(locationId: number) {
      dispatch(loadArrivalDataRequest(locationId));
    },
    onBookmarkClick(stopLocation: StopLocation, stopIsBookmarked: boolean) {
      if (stopIsBookmarked) {
        const locationId = stopLocation.locid
          ? stopLocation.locid
          : stopLocation.id;
        dispatch(removeStopBookmarkRequest(locationId));
      } else {
        dispatch(bookmarkStopRequest(stopLocation));
      }
    }
  };
};

const StopLocationViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(StopLocationView);

export default StopLocationViewContainer;

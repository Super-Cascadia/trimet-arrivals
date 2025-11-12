import { connect } from "react-redux";
import { StopLocation } from "../../../api/trimet/interfaces/types";
import {
  bookmarkStopRequest,
  removeStopBookmarkRequest
} from "../../../store/action/bookmarkActions";
import { RootState } from "../../../store/reducers";
import { stopIsBookmarkedSelector } from "../../../store/selectors/bookmarkSelectors";
import StopLocationView from "../component/StopLocationView";

interface ReceivedProps {
  locationId: number;
}

const mapStateToProps = (state: RootState, props: ReceivedProps) => {
  return {
    ...props,
    stopIsBookmarked: stopIsBookmarkedSelector(state, props.locationId)
  };
};

const mapDispatchToProps = dispatch => {
  return {
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

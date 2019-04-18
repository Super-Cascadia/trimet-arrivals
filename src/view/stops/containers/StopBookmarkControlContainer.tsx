import { connect } from "react-redux";
import { StopLocation } from "../../../api/trimet/types";
import {
  bookmarkStopRequest,
  removeStopBookmarkRequest
} from "../../../store/action/bookmarkActions";
import { RootState } from "../../../store/reducers";
import { stopIsBookmarkedSelector } from "../../../store/selectors/bookmarkSelectors";
import StopBookmarkControlComponent from "../components/StopBookmarkControlComponent";

interface Props {
  locationId: number;
}

const mapStateToProps = (state: RootState, props: Props) => {
  return {
    ...props,
    stopIsBookmarked: stopIsBookmarkedSelector(state, props.locationId)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onBookmarkClick(
      stopLocation: StopLocation,
      stopIsBookmarked: boolean
    ): void {
      if (stopIsBookmarked) {
        dispatch(removeStopBookmarkRequest(stopLocation.locid));
      } else {
        dispatch(bookmarkStopRequest(stopLocation));
      }
    }
  };
};

const StopBookmarkControlContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(StopBookmarkControlComponent);

export default StopBookmarkControlContainer;

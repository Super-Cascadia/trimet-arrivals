import { connect } from "react-redux";
import { StopLocation } from "../../../api/trimet/interfaces/types";
import {
  bookmarkStopRequest,
  removeStopBookmarkRequest
} from "../../../store/action/bookmarkActions";
import { bookmarkSectionSelectRequest } from "../../../store/action/bookmarkSectionActions";
import { RootState } from "../../../store/reducers";
import { bookmarkSectionSelectors } from "../../../store/selectors/bookmarkSectionSelectors";
import { stopIsBookmarkedSelector } from "../../../store/selectors/bookmarkSelectors";
import StopBookmarkControlComponent from "../components/StopBookmarkControlComponent";

interface Props {
  locationId: number;
}

const mapStateToProps = (state: RootState, props: Props) => {
  return {
    ...props,
    bookmarkSections: bookmarkSectionSelectors(state),
    stopIsBookmarked: stopIsBookmarkedSelector(state, props.locationId)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onBookmarkClick(stopLocation: StopLocation, stopIsBookmarked: boolean) {
      if (stopIsBookmarked) {
        dispatch(removeStopBookmarkRequest(stopLocation.locid));
      } else {
        dispatch(bookmarkStopRequest(stopLocation));
      }
    },
    onBookmarkSectionSelect(
      bookmarkSectionId: number,
      stopLocation: StopLocation
    ) {
      dispatch(bookmarkSectionSelectRequest(bookmarkSectionId, stopLocation));
    }
  };
};

const StopBookmarkControlContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(StopBookmarkControlComponent);

export default StopBookmarkControlContainer;

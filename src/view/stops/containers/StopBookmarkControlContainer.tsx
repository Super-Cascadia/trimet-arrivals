import { connect } from "react-redux";
import { StopLocation } from "../../../api/trimet/types";
import {
  bookmarkSectionSelectRequest,
  bookmarkStopRequest,
  removeStopBookmarkRequest
} from "../../../store/action/bookmarkActions";
import { RootState } from "../../../store/reducers";
import {
  bookmarkSectionSelector,
  stopIsBookmarkedSelector
} from "../../../store/selectors/bookmarkSelectors";
import StopBookmarkControlComponent from "../components/StopBookmarkControlComponent";

interface Props {
  locationId: number;
}

const mapStateToProps = (state: RootState, props: Props) => {
  return {
    ...props,
    bookmarkSections: bookmarkSectionSelector(state),
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
      selectedBookmarkSection: number,
      stopLocation: StopLocation
    ) {
      dispatch(
        bookmarkSectionSelectRequest(selectedBookmarkSection, stopLocation)
      );
    }
  };
};

const StopBookmarkControlContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(StopBookmarkControlComponent);

export default StopBookmarkControlContainer;

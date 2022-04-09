import { connect } from "react-redux";
import { StopLocation } from "../../../api/trimet/interfaces/types";
import BookmarkButton from "../../../component/buttons/BookmarkButton";
import {
  bookmarkStopRequest,
  removeStopBookmarkRequest
} from "../../../store/action/bookmarkActions";
import { RootState } from "../../../store/reducers";
import { stopIsBookmarkedSelector } from "../../../store/selectors/bookmarkSelectors";

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
    onBookmarkClick(stopLocation: StopLocation, stopIsBookmarked: boolean) {
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
)(BookmarkButton);

export default StopBookmarkControlContainer;

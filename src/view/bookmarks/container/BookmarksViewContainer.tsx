import { connect } from "react-redux";
import { onInitialLoadRequest } from "../../../store/action/viewActions";
import { RootState } from "../../../store/reducers";
import {
  bookmarkSectionSelectors,
  sectionNameInputSelector
} from "../../../store/selectors/bookmarkSectionSelectors";
import {
  bookmarkCountSelector,
  bookmarkedStopLocationsSelector
} from "../../../store/selectors/bookmarkSelectors";
import { timeOfLastLoadSelector } from "../../../store/selectors/stopSelectors";
import BookmarksViewComponent from "../component/BookmarksViewComponent";

const mapStateToProps = (state: RootState) => {
  return {
    bookmarkSectionName: sectionNameInputSelector(state),
    bookmarkSections: bookmarkSectionSelectors(state),
    bookmarks: bookmarkedStopLocationsSelector(state),
    numberOfBookmarks: bookmarkCountSelector(state),
    timeOfLastLoad: timeOfLastLoadSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onInitialLoad() {
      dispatch(onInitialLoadRequest());
    }
  };
};

const BookmarksViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(BookmarksViewComponent);

export default BookmarksViewContainer;

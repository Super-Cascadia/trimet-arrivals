import { connect } from "react-redux";
import { RootState } from "../../../store/reducers";
import {
  bookmarkSectionSelectors,
  sectionNameInputSelector
} from "../../../store/selectors/bookmarkSectionSelectors";
import { bookmarkedStopLocationsSelector } from "../../../store/selectors/bookmarkSelectors";
import BookmarksViewComponent from "../component/BookmarksViewComponent";

const mapStateToProps = (state: RootState) => {
  return {
    bookmarkSectionName: sectionNameInputSelector(state),
    bookmarkSections: bookmarkSectionSelectors(state),
    bookmarks: bookmarkedStopLocationsSelector(state)
  };
};

const BookmarksViewContainer = connect(
  mapStateToProps,
  // tslint:disable:no-empty
  () => {}
  // tslint:enable:no-empty
)(BookmarksViewComponent);

export default BookmarksViewContainer;

import { connect } from "react-redux";
import {
  addBookmarkToBookmarkSectionRequest,
  removeAllBookmarksInSectionRequest,
  removeBookmarkFromSectionRequest
} from "../../../store/action/bookmarkSectionActions";
import { RootState } from "../../../store/reducers";
import { bookmarksInSectionSelector } from "../../../store/selectors/bookmarkSectionSelectors";
import { bookmarkedStopLocationSelector } from "../../../store/selectors/bookmarkSelectors";
import BookmarksInSectionSelectionHandler from "../component/BookmarksInSectionSelectionHandler";

const mapStateToProps = (state: RootState, ownProps) => {
  const id = ownProps.bookmarkSectionId;
  const bookmarksInSection = bookmarksInSectionSelector(state, id);
  const allBookmarks = bookmarkedStopLocationSelector(state);

  return {
    allBookmarks,
    bookmarksInSection
  };
};

const mapDispatchToProps = dispatch => {
  return {
    removeBookmarkFromSection(bookmarkSectionId: number, stopId: number) {
      dispatch(removeBookmarkFromSectionRequest(bookmarkSectionId, stopId));
    },
    addBookmarkToBookmarkSection(bookmarkSectionId, stopId) {
      dispatch(addBookmarkToBookmarkSectionRequest(bookmarkSectionId, stopId));
    },
    removeAllBookmarksFromSection(bookmarkSectionId) {
      dispatch(removeAllBookmarksInSectionRequest(bookmarkSectionId));
    }
  };
};

const BookmarksInSectionSelectorContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(BookmarksInSectionSelectionHandler);

export default BookmarksInSectionSelectorContainer;

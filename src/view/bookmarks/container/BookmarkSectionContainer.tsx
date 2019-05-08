import { connect } from "react-redux";
import {
  addBookmarkToBookmarkSectionRequest,
  removeAllBookmarksInSectionRequest,
  removeBookmarkFromSectionRequest,
  removeBookmarkSectionRequest,
  updateBookmarkSectionNameRequest
} from "../../../store/action/bookmarkSectionActions";
import { RootState } from "../../../store/reducers";
import {
  bookmarkSectionNameSelector,
  bookmarksInSectionSelector
} from "../../../store/selectors/bookmarkSectionSelectors";
import { bookmarkedStopLocationSelector } from "../../../store/selectors/bookmarkSelectors";
import BookmarkSectionComponent from "../component/BookmarkSectionComponent";

const mapStateToProps = (state: RootState, ownProps) => {
  const id = ownProps.bookmarkSectionId;
  const bookmarksInSection = bookmarksInSectionSelector(state, id);
  const allBookmarks = bookmarkedStopLocationSelector(state);
  const name = bookmarkSectionNameSelector(state, id);

  return {
    allBookmarks,
    bookmarksInSection,
    id,
    name
  };
};

const mapDispatchToProps = dispatch => {
  return {
    removeBookmarkSection(bookmarkSectionId: number) {
      dispatch(removeBookmarkSectionRequest(bookmarkSectionId));
    },
    removeBookmarkFromSection(bookmarkSectionId: number, stopId: number) {
      dispatch(removeBookmarkFromSectionRequest(bookmarkSectionId, stopId));
    },
    addBookmarkToBookmarkSection(bookmarkSectionId, stopId) {
      dispatch(addBookmarkToBookmarkSectionRequest(bookmarkSectionId, stopId));
    },
    removeAllBookmarksFromSection(bookmarkSectionId) {
      dispatch(removeAllBookmarksInSectionRequest(bookmarkSectionId));
    },
    updateBookmarkSectionName(
      bookmarkSectionId: number,
      bookmarkSectionName: string
    ) {
      dispatch(
        updateBookmarkSectionNameRequest(bookmarkSectionId, bookmarkSectionName)
      );
    }
  };
};

const BookmarkSectionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(BookmarkSectionComponent);

export default BookmarkSectionContainer;

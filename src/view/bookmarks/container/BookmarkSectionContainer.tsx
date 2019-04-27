import { connect } from "react-redux";
import {
  addBookmarkToBookmarkSection,
  removeBookmarkFromSectionRequest,
  removeBookmarkSectionRequest
} from "../../../store/action/bookmarkSectionActions";
import { RootState } from "../../../store/reducers";
import {
  bookmarkSectionNameSelector,
  bookmarkSectionStopsSelector
} from "../../../store/selectors/bookmarkSectionSelectors";
import { bookmarkedStopLocationIds } from "../../../store/selectors/bookmarkSelectors";
import BookmarkSectionComponent from "../component/BookmarkSectionComponent";

const mapStateToProps = (state: RootState, ownProps) => {
  const id = ownProps.bookmarkSectionId;
  const bookmarksInSection = bookmarkSectionStopsSelector(state, id);
  const allBookmarks = bookmarkedStopLocationIds(state);
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
      dispatch(addBookmarkToBookmarkSection(bookmarkSectionId, stopId));
    }
  };
};

const BookmarkSectionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(BookmarkSectionComponent);

export default BookmarkSectionContainer;

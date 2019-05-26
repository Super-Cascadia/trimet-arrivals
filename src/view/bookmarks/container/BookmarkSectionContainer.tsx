import { connect } from "react-redux";
import {
  removeBookmarkFromSectionRequest,
  removeBookmarkSectionRequest,
  updateBookmarkSectionNameRequest
} from "../../../store/action/bookmarkSectionActions";
import { RootState } from "../../../store/reducers";
import {
  bookmarkSectionNameSelector,
  bookmarksInSectionSelector
} from "../../../store/selectors/bookmarkSectionSelectors";
import BookmarkSectionComponent from "../component/bookmarkSections/BookmarkSectionComponent";

const mapStateToProps = (state: RootState, ownProps) => {
  const id = ownProps.bookmarkSectionId;
  const bookmarksInSection = bookmarksInSectionSelector(state, id);
  const name = bookmarkSectionNameSelector(state, id);

  return {
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

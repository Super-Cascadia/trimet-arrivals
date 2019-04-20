import { connect } from "react-redux";
import { removeBookmarkSectionRequest } from "../../../store/action/bookmarkSectionActions";
import { RootState } from "../../../store/reducers";
import {
  bookmarkSectionNameSelector,
  bookmarkSectionStopsSelector
} from "../../../store/selectors/bookmarkSectionSelectors";
import BookmarkSectionComponent from "../component/BookmarkSectionComponent";

const mapStateToProps = (state: RootState, ownProps) => {
  const id = ownProps.bookmarkSectionId;
  const bookmarkedStops = bookmarkSectionStopsSelector(state, id);

  return {
    bookmarkedStops,
    id,
    name: bookmarkSectionNameSelector(state, id)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    removeBookmarkSection(bookmarkSectionId: number) {
      dispatch(removeBookmarkSectionRequest(bookmarkSectionId));
    }
  };
};

const BookmarkSectionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(BookmarkSectionComponent);

export default BookmarkSectionContainer;

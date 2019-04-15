import { connect } from "react-redux";
import {
  createBookmarkSectionRequest,
  sectionNameUpdateRequest
} from "../../../store/action/bookmarkActions";
import { RootState } from "../../../store/reducers";
import {
  bookmarkInputSectionnameSelector,
  bookmarkSectionSelector,
  bookmarksSelector
} from "../../../store/selectors/bookmarkSelectors";
import BookmarksViewComponent from "../component/BookmarksViewComponent";

const mapStateToProps = (state: RootState) => {
  return {
    bookmarkSectionName: bookmarkInputSectionnameSelector(state),
    bookmarkSections: bookmarkSectionSelector(state),
    bookmarks: bookmarksSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSectionNameUpdate(name: string) {
      dispatch(sectionNameUpdateRequest(name));
    },
    createBookmarkSection(e) {
      dispatch(createBookmarkSectionRequest());
    }
  };
};

const BookmarksViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(BookmarksViewComponent);

export default BookmarksViewContainer;

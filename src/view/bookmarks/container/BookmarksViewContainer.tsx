import { connect } from "react-redux";
import {
  createBookmarkSectionRequest,
  removeBookmarkSectionRequest,
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

const BookmarksViewContainer = connect(
  mapStateToProps,
  // tslint:disable:no-empty
  () => {}
  // tslint:enable:no-empty
)(BookmarksViewComponent);

export default BookmarksViewContainer;

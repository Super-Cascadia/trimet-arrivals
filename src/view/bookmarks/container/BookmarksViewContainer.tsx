import { connect } from "react-redux";
import { RootState } from "../../../store/reducers";
import { bookmarksSelector } from "../../../store/selectors/bookmarkSelectors";
import BookmarksViewComponent from "../component/BookmarksViewComponent";

const mapStateToProps = (state: RootState) => {
  return {
    bookmarks: bookmarksSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

const BookmarksViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(BookmarksViewComponent);

export default BookmarksViewContainer;

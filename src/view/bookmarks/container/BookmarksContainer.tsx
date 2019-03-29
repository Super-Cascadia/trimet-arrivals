import { connect } from "react-redux";
import { RootState } from "../../../store/reducers";
import { bookmarksSelector } from "../../../store/selectors/bookmarkSelectors";
import BookmarksComponent from "../component/BookmarksComponent";

const mapStateToProps = (state: RootState) => {
  return {
    bookmarks: bookmarksSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

const BookmarksContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(BookmarksComponent);

export default BookmarksContainer;

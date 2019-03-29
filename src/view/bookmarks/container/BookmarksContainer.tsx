import { connect } from "react-redux";
import { RootState } from "../../../store/reducers";
import BookmarksComponent from "../component/BookmarksComponent";

const mapStateToProps = (state: RootState) => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

const BookmarksContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(BookmarksComponent);

export default BookmarksContainer;

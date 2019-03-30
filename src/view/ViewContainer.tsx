import { connect } from "react-redux";
import { changeViewRequest } from "../store/action/viewActions";
import { RootState } from "../store/reducers";
import { bookmarkCountSelector } from "../store/selectors/bookmarkSelectors";
import { viewSelector } from "../store/selectors/viewSelectors";
import ViewComponent from "./ViewComponent";

const mapStateToProps = (state: RootState) => {
  return {
    activeView: viewSelector(state),
    numberOfBookmarks: bookmarkCountSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateView(activeView: string): void {
      dispatch(changeViewRequest(activeView));
    }
  };
};

const ViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewComponent);

export default ViewContainer;

import { connect } from "react-redux";
import {
  changeViewRequest,
  onInitialLoadRequest
} from "../store/action/viewActions";
import { RootState } from "../store/reducers";
import { bookmarkCountSelector } from "../store/selectors/bookmarkSelectors";
import { timeOfLastLoadSelector } from "../store/selectors/stopSelectors";
import { viewSelector } from "../store/selectors/viewSelectors";
import ViewComponent from "./ViewComponent";

const mapStateToProps = (state: RootState) => {
  return {
    activeView: viewSelector(state),
    numberOfBookmarks: bookmarkCountSelector(state),
    timeOfLastLoad: timeOfLastLoadSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateView(activeView: string): void {
      dispatch(changeViewRequest(activeView));
    },
    onInitialLoad() {
      dispatch(onInitialLoadRequest());
    }
  };
};

const ViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewComponent);

export default ViewContainer;

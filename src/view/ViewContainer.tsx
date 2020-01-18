import { connect } from "react-redux";
import { onInitialLoadRequest } from "../store/action/viewActions";
import { RootState } from "../store/reducers";
import { bookmarkCountSelector } from "../store/selectors/bookmarkSelectors";
import { timeOfLastLoadSelector } from "../store/selectors/stopSelectors";
import ViewComponent from "./ViewComponent";

const mapStateToProps = (state: RootState) => {
  return {
    numberOfBookmarks: bookmarkCountSelector(state),
    timeOfLastLoad: timeOfLastLoadSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
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

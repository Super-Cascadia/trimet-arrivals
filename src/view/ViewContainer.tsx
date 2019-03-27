import { connect } from "react-redux";
import { RootState } from "../store/reducers";
import { viewSelector } from "../store/selectors/viewSelectors";
import ViewComponent from "./ViewComponent";

const mapStateToProps = (state: RootState) => {
  return {
    activeView: viewSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

const ViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewComponent);

export default ViewContainer;

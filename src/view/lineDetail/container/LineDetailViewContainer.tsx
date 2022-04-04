import { connect } from "react-redux";
import { loadRouteDataRequest } from "../../../store/action/routeActions";
import { RootState } from "../../../store/reducers";
import { routeSelector } from "../../../store/selectors/data/routeDataSelectors";
import LineDetailView from "../component/LineDetailView";

const mapStateToProps = (state: RootState, props) => {
  return {
    ...props
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

const LineDetailViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LineDetailView);

export default LineDetailViewContainer;

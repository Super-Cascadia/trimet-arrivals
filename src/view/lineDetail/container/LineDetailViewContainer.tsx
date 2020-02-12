import { connect } from "react-redux";
import { loadRouteDataRequest } from "../../../store/action/routeActions";
import { RootState } from "../../../store/reducers";
import { routeSelector } from "../../../store/selectors/data/routeDataSelectors";
import LineDetailView from "../component/LineDetailView";

const mapStateToProps = (state: RootState, props) => {
  return {
    ...props,
    route: routeSelector(state, props.id)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadRouteData(id: number) {
      dispatch(loadRouteDataRequest(id));
    }
  };
};

const LineDetailViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LineDetailView);

export default LineDetailViewContainer;

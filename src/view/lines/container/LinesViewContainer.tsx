import { connect } from "react-redux";
import { loadAllRouteDataRequest } from "../../../store/action/routeActions";
import { RootState } from "../../../store/reducers";
import { allRoutesSelector } from "../../../store/selectors/data/routeDataSelectors";
import LinesViewComponent from "../component/LinesViewComponent";

const mapStateToProps = (state: RootState) => {
  return {
    routes: allRoutesSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadAllRoutes() {
      dispatch(loadAllRouteDataRequest());
    }
  };
};

const LinesViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LinesViewComponent);

export default LinesViewContainer;

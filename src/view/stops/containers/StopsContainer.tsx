import { connect } from "react-redux";
import { loadStopDataRequest } from "../../../store/action/stopActions";
import { RootState } from "../../../store/reducers";
import {
  allStopLocationsSelector,
  stopsLoadingSelector,
  timeOfLastLoadSelector
} from "../../../store/selectors/stopSelectors";
import StopsComponent from "../components/StopsComponent";

const mapStateToProps = (state: RootState) => {
  return {
    loading: stopsLoadingSelector(state),
    stopLocations: allStopLocationsSelector(state),
    timeOfLastLoad: timeOfLastLoadSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadStopData(radiusInFeet: number): void {
      dispatch(loadStopDataRequest(radiusInFeet));
    }
  };
};

const StopsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(StopsComponent);

export default StopsContainer;

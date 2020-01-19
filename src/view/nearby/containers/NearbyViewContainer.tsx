import { connect } from "react-redux";
import { loadStopDataRequest } from "../../../store/action/stopActions";
import { RootState } from "../../../store/reducers";
import {
  allStopLocationsSelector,
  stopsLoadingSelector
} from "../../../store/selectors/stopSelectors";
import NearbyViewComponent from "../components/NearbyViewComponent";

const mapStateToProps = (state: RootState) => {
  return {
    loading: stopsLoadingSelector(state),
    stopLocations: allStopLocationsSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadStopData(radiusInFeet: number): void {
      dispatch(loadStopDataRequest(radiusInFeet));
    }
  };
};

const NearbyViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NearbyViewComponent);

export default NearbyViewContainer;

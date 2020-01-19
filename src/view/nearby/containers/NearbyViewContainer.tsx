import { connect } from "react-redux";
import { loadStopDataRequest } from "../../../store/action/stopActions";
import { RootState } from "../../../store/reducers";
import { currentLocationSelector } from "../../../store/selectors/locationSelectors";
import {
  allNearbyRoutesSelector,
  allStopLocationsSelector,
  stopsLoadingSelector
} from "../../../store/selectors/stopSelectors";
import NearbyViewComponent from "../components/NearbyViewComponent";

const mapStateToProps = (state: RootState) => {
  return {
    currentLocation: currentLocationSelector(state),
    loading: stopsLoadingSelector(state),
    nearbyRoutes: allNearbyRoutesSelector(state),
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

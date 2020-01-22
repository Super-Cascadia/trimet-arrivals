import { connect } from "react-redux";
import { loadStopDataRequest } from "../../../store/action/stopActions";
import { RootState } from "../../../store/reducers";
import { currentLocationSelector } from "../../../store/selectors/locationSelectors";
import { allNearbyRoutesSelector } from "../../../store/selectors/nearbyRoutesSelectors";
import { allStopLocationsSelector } from "../../../store/selectors/stopSelectors";
import NearbyMap from "../components/NearbyMap";

const mapStateToProps = (state: RootState) => {
  return {
    currentLocation: currentLocationSelector(state),
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

const NearbyMapContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NearbyMap);

export default NearbyMapContainer;

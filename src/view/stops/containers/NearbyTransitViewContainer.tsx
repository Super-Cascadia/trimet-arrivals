import { connect } from "react-redux";
import { loadStopDataRequest } from "../../../store/action/stopActions";
import { onInitialLoadRequest } from "../../../store/action/viewActions";
import { RootState } from "../../../store/reducers";
import { bookmarkCountSelector } from "../../../store/selectors/bookmarkSelectors";
import { currentLocationSelector } from "../../../store/selectors/locationSelectors";
import {
  allNearbyRoutesSelector,
  allStopLocationsSelector,
  stopsLoadingSelector,
  timeOfLastLoadSelector
} from "../../../store/selectors/stopSelectors";
import NearbyTransitViewComponent from "../components/NearbyTransitViewComponent";

const mapStateToProps = (state: RootState) => {
  return {
    currentLocation: currentLocationSelector(state),
    loading: stopsLoadingSelector(state),
    nearbyRoutes: allNearbyRoutesSelector(state),
    numberOfBookmarks: bookmarkCountSelector(state),
    stopLocations: allStopLocationsSelector(state),
    timeOfLastLoad: timeOfLastLoadSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadStopData(radiusInFeet: number): void {
      dispatch(loadStopDataRequest(radiusInFeet));
    },
    onInitialLoad() {
      dispatch(onInitialLoadRequest());
    }
  };
};

const NearbyTransitViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NearbyTransitViewComponent);

export default NearbyTransitViewContainer;

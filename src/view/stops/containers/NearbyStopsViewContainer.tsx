import { connect } from "react-redux";
import {
  changeViewRequest,
  loadStopDataRequest
} from "../../../store/action/stopActions";
import { onInitialLoadRequest } from "../../../store/action/viewActions";
import { RootState } from "../../../store/reducers";
import { bookmarkCountSelector } from "../../../store/selectors/bookmarkSelectors";
import { currentLocationSelector } from "../../../store/selectors/locationSelectors";
import { nearbyActiveViewSelector } from "../../../store/selectors/nearbyViewSelector";
import {
  allNearbyRoutesSelector,
  allStopLocationsSelector,
  stopsLoadingSelector,
  timeOfLastLoadSelector
} from "../../../store/selectors/stopSelectors";
import { viewSelector } from "../../../store/selectors/viewSelectors";
import NearbyStopsViewComponent from "../components/NearbyStopsViewComponent";

const mapStateToProps = (state: RootState) => {
  return {
    activeSubView: nearbyActiveViewSelector(state),
    activeView: viewSelector(state),
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
    changeView(view: string): void {
      dispatch(changeViewRequest(view));
    },
    onInitialLoad() {
      dispatch(onInitialLoadRequest());
    }
  };
};

const NearbyStopsViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NearbyStopsViewComponent);

export default NearbyStopsViewContainer;

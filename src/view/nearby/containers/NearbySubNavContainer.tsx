import { size } from "lodash";
import { connect } from "react-redux";
import { RootState } from "../../../store/reducers";
import { allNearbyRouteIdsSelector } from "../../../store/selectors/nearbyRoutesSelectors";
import { allStopLocationsSelector } from "../../../store/selectors/stopSelectors";
import NearbySubNav from "../components/NearbySubNav";

const mapStateToProps = (state: RootState) => {
  const stopCount = size(allStopLocationsSelector(state));
  const routeCount = size(allNearbyRouteIdsSelector(state));

  return {
    routeCount,
    stopCount
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

const NearbySubNavContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NearbySubNav);

export default NearbySubNavContainer;

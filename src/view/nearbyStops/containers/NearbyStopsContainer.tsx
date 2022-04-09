import { connect } from "react-redux";
import { RootState } from "../../../store/reducers";
import { allStopLocationsSelector } from "../../../store/selectors/stopSelectors";
import NearbyStops from "../components/NearbyStops";

const mapStateToProps = (state: RootState) => {
  return {
    stopLocations: allStopLocationsSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

const NearbyStopsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NearbyStops);

export default NearbyStopsContainer;

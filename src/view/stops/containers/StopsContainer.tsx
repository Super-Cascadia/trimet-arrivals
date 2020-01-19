import { connect } from "react-redux";
import { RootState } from "../../../store/reducers";
import { allStopLocationsSelector } from "../../../store/selectors/stopSelectors";
import Stops from "../components/Stops";

const mapStateToProps = (state: RootState) => {
  return {
    stopLocations: allStopLocationsSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

const StopsContainer = connect(mapStateToProps, mapDispatchToProps)(Stops);

export default StopsContainer;

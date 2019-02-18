import { connect } from "react-redux";
import StopsComponent from "./StopsComponent";
import { loadStopData } from "../../store/action/stopActions";
import { RootState } from "../../store/reducers";

const mapStateToProps = (state: RootState) => {
  const { stopsReducer } = state;
  const loading = stopsReducer.loading;
  const stopLocations = stopsReducer.stopLocations;
  const timeOfLastLoad = stopsReducer.timeOfLastLoad;

  return {
    loading,
    stopLocations,
    timeOfLastLoad
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadStopData(radiusInFeet: number): void {
      dispatch(loadStopData(radiusInFeet));
    }
  };
};

const StopsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(StopsComponent);

export default StopsContainer;

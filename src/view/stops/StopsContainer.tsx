import { connect } from "react-redux";
import { loadStopData } from "../../store/action/stopActions";
import { RootState } from "../../store/reducers";
import StopsComponent from "./StopsComponent";

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

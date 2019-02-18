import { connect } from "react-redux";
import { StopLocation } from "../../api/trimet/types";
import { loadArrivalData } from "../../store/action/stopActions";
import { RootState } from "../../store/reducers";
import StopComponent from "./StopComponent";

interface Props {
  locationId: number;
  showArrivals: boolean;
}

const mapStateToProps = (state: RootState, props: Props) => {
  const { stopsReducer, arrivalsReducer } = state;
  const { locationId } = props;

  const stopLocation: StopLocation = stopsReducer.stopLocations[locationId];
  const loading: boolean = arrivalsReducer.loading[locationId];

  return {
    ...props,
    loading,
    stopLocation,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadArrivalData(locationId: number): void {
      dispatch(loadArrivalData(locationId));
    }
  };
};

const StopContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(StopComponent);

export default StopContainer;

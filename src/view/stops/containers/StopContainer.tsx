import { connect } from "react-redux";
import { loadArrivalDataRequest } from "../../../store/action/stopActions";
import { RootState } from "../../../store/reducers";
import { arrivalsLoadingSelector } from "../../../store/selectors/arrivalSelectors";
import { stopLocationSelector } from "../../../store/selectors/stopSelectors";
import StopComponent from "../components/StopComponent";

interface Props {
  locationId: number;
  showArrivals: boolean;
  onRouteIndicatorClick: () => void;
}

const mapStateToProps = (state: RootState, props: Props) => {
  return {
    ...props,
    loading: arrivalsLoadingSelector(state, props.locationId),
    stopLocation: stopLocationSelector(state, props.locationId)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadArrivalData(locationId: number): void {
      dispatch(loadArrivalDataRequest(locationId));
    }
  };
};

const StopContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(StopComponent);

export default StopContainer;

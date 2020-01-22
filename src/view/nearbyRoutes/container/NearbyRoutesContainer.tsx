import { connect } from "react-redux";
import { loadStopDataRequest } from "../../../store/action/stopActions";
import { RootState } from "../../../store/reducers";
import { allNearbyRoutesSelector } from "../../../store/selectors/nearbyRoutesSelectors";
import NearbyRoutes from "../component/NearbyRoutes";

const mapStateToProps = (state: RootState) => {
  return {
    nearbyRoutes: allNearbyRoutesSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadStopData(radiusInFeet: number): void {
      dispatch(loadStopDataRequest(radiusInFeet));
    }
  };
};

const NearbyRoutesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NearbyRoutes);

export default NearbyRoutesContainer;

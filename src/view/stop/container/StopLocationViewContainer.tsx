import { connect } from "react-redux";
import { loadArrivalDataRequest } from "../../../store/action/stopActions";
import { RootState } from "../../../store/reducers";
import StopLocationView from "../component/StopLocationView";

const mapStateToProps = (state: RootState, props) => {
  return {
    ...props
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadArrivalData(locationId: number) {
      dispatch(loadArrivalDataRequest(locationId));
    }
  };
};

const StopLocationViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(StopLocationView);

export default StopLocationViewContainer;

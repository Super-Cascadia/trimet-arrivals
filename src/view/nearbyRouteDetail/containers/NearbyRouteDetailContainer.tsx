import { connect } from "react-redux";
import { loadRouteDataRequest } from "../../../store/action/routeActions";
import { RootState } from "../../../store/reducers";
import NearbyRouteDetail from "../components/NearbyRouteDetail";

interface Props {
  id: number;
}

const mapStateToProps = (state: RootState, props: Props) => {
  return {
    ...props
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadRouteData(id: number) {
      dispatch(loadRouteDataRequest(id));
    }
  };
};

const NearbyRouteDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NearbyRouteDetail);

export default NearbyRouteDetailContainer;

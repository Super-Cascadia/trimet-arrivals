import { connect } from "react-redux";
import { loadRouteDataRequest } from "../../../store/action/routeActions";
import { RootState } from "../../../store/reducers";
import { routeSelector } from "../../../store/selectors/routeSelectors";
import NearbyRouteDetail from "../components/NearbyRouteDetail";

interface Props {
  id: number;
}

const mapStateToProps = (state: RootState, props: Props) => {
  const id = props.id;

  return {
    ...props,
    route: routeSelector(state, id)
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

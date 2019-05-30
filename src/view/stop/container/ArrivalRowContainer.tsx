import { connect } from "react-redux";
import { Arrival } from "../../../api/trimet/interfaces/arrivals";
import { RootState } from "../../../store/reducers";
import { routeSelector } from "../../../store/selectors/data/routeDataSelectors";
import StopLocationArrivalRow from "../component/StopLocationArrivalRow";

interface Props {
  arrival: Arrival;
}

const mapStateToProps = (state: RootState, props: Props) => {
  return {
    ...props,
    route: routeSelector(state, props.arrival.route)
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

const ArrivalRowContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(StopLocationArrivalRow);

export default ArrivalRowContainer;

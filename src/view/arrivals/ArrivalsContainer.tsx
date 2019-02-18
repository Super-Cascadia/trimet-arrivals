import moment from "moment";
import { connect } from "react-redux";
import { LoadArrivalData } from "../../store/action/stopActions";
import { RootState } from "../../store/reducers";
import ArrivalsComponent from "../arrivals/ArrivalsComponent";

interface Props {
  locationId: number;
  showArrivals: boolean;
  loadArrivalData: LoadArrivalData;
}

const mapStateToProps = (state: RootState, props: Props) => {
  const { arrivalsReducer } = state;
  const locationId = props.locationId;
  const loading = arrivalsReducer.loading[locationId];
  const arrivals = arrivalsReducer.arrivals[locationId];
  const now = moment();

  return {
    ...props,
    arrivals,
    loading,
    locationId,
    now
  };
};

const mapDispatchToProps = () => {
  return {};
};

const ArrivalsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ArrivalsComponent);

export default ArrivalsContainer;

import { connect } from "react-redux";
import { RootState } from "../../store/reducers";
import { LoadArrivalData } from "../../store/action/stopActions";
import ArrivalsComponent from "../arrivals/ArrivalsComponent";
import moment from "moment";

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
    loading,
    locationId,
    arrivals,
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

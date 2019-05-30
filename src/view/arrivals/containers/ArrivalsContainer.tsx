import moment from "moment";
import { connect } from "react-redux";
import { TrimetRoute } from "../../../api/trimet/interfaces/types";
import { LoadArrivalData } from "../../../store/action/stopActions";
import { RootState } from "../../../store/reducers";
import {
  arrivalsAtStopSelector,
  arrivalsLoadingSelector
} from "../../../store/selectors/arrivalSelectors";
import ArrivalsComponent from "../components/ArrivalsComponent";

interface Props {
  locationId: number;
  showArrivals: boolean;
  loadArrivalData: LoadArrivalData;
  onRouteIndicatorClick: (route: TrimetRoute) => void;
}

const mapStateToProps = (state: RootState, props: Props) => {
  const { locationId } = props;
  const now = moment();

  return {
    ...props,
    arrivals: arrivalsAtStopSelector(state, locationId),
    loading: arrivalsLoadingSelector(state, locationId),
    locationId,
    now
  };
};

const ArrivalsContainer = connect(mapStateToProps, () => ({}))(
  ArrivalsComponent
);

export default ArrivalsContainer;

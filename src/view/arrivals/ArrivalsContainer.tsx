import { connect, Dispatch } from 'react-redux';
import { RootState } from '../../store/reducers';
import { StopActions } from '../../store/action/stopActions';
import ArrivalsComponent from '../arrivals/ArrivalsComponent';
import { LoadArrivalData } from '../stops/components/Stops';

interface Props {
    locationId: number;
    showArrivals: boolean;
    loadArrivalData: LoadArrivalData;
}

const mapStateToProps = (state: RootState, ownProps: Props) => {
    const { arrivalsReducer } = state;
    const locationId = ownProps.locationId;
    const loading = arrivalsReducer.loading[locationId];
    const arrivals = arrivalsReducer.arrivals[locationId];

    return {
        ...ownProps,
        loading,
        locationId,
        arrivals
    };
};

const mapDispatchToProps = (dispatch: Dispatch<StopActions>) => {
    return {};
};

const ArrivalsContainer = connect(
    mapStateToProps, 
    mapDispatchToProps
)(ArrivalsComponent);

export default ArrivalsContainer;
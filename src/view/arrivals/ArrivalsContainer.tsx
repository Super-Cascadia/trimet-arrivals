import { connect, Dispatch } from 'react-redux';
import { RootState } from '../../store/reducers';
import { StopActions } from '../../store/action/stopActions';
import ArrivalsComponent from '../arrivals/ArrivalsComponent';
import { loadArrivalData } from '../../store/action';

interface Props {
    locationId: number;
}

const mapStateToProps = (state: RootState, ownProps: Props) => {
    const { arrivalsReducer } = state;
    const loading = arrivalsReducer.loading;
    const locationId = ownProps.locationId;
    const arrivals = arrivalsReducer.arrivals[locationId];

    return {
        loading,
        locationId,
        arrivals
    };
};

const mapDispatchToProps = (dispatch: Dispatch<StopActions>) => {
    return {
        loadArrivalData(locationId: number) {
            dispatch(loadArrivalData(locationId));
        }
    };
};

const ArrivalsContainer = connect(
    mapStateToProps, 
    mapDispatchToProps
)(ArrivalsComponent);

export default ArrivalsContainer;
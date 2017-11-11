import { connect, Dispatch } from 'react-redux';
import { RootState } from '../../store/reducers';
import { StopActions } from '../../store/action/stopActions';
import StopComponent from './StopComponent';
import { loadArrivalData } from '../../store/action';

interface Props {
    locationId: number;
    showArrivals: boolean;
}

const mapStateToProps = (state: RootState, ownProps: Props) => {
    const { stopsReducer, arrivalsReducer } = state;
    const { locationId } = ownProps;

    const stopLocation = stopsReducer.stopLocations[locationId];
    const loading = arrivalsReducer.loading[locationId];

    return {
        ...ownProps,
        stopLocation,
        loading
    };
};

const mapDispatchToProps = (dispatch: Dispatch<StopActions>) => {
    return {
        loadArrivalData(locationId: number): void {
            dispatch(loadArrivalData(locationId));
        }
    };
};

const StopContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(StopComponent);

export default StopContainer;
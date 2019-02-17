import { connect, Dispatch } from 'react-redux';
import { RootState } from '../../store/reducers';
import { StopActions } from '../../store/action/stopActions';
import StopComponent from './StopComponent';
import { loadArrivalData } from '../../store/action';
import { StopLocation } from '../../api/trimet/types';

interface Props {
    locationId: number;
    showArrivals: boolean;
}

const mapStateToProps = (state: RootState, props: Props) => {
    const { stopsReducer, arrivalsReducer } = state;
    const { locationId } = props;

    const stopLocation: StopLocation = stopsReducer.stopLocations[locationId];
    const loading: boolean = arrivalsReducer.loading[locationId];

    return {
        ...props,
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
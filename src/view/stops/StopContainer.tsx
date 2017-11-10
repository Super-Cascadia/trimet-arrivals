import { connect, Dispatch } from 'react-redux';
import { RootState } from '../../store/reducers';
import { StopActions } from '../../store/action/stopActions';
import StopComponent from './StopComponent';
import { loadArrivalData } from '../../store/action';

interface Props {
    locationId: number;
}

const mapStateToProps = (state: RootState, ownProps: Props) => {
    const stopLocation = state.stopsReducer.stopLocations[ownProps.locationId];

    return {
        ...ownProps,
        stopLocation
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
import { connect, Dispatch } from 'react-redux';
import StopsComponent from './StopsComponent';
import { loadStopData } from '../../store/action';
import { RootState } from '../../store/reducers';
import { StopActions } from '../../store/action/stopActions';

const mapStateToProps = (state: RootState) => {
    const loading = state.stopsReducer.loading;
    const stopLocations = state.stopsReducer.stopLocations;

    return {
        loading,
        stopLocations
    };
};

const mapDispatchToProps = (dispatch: Dispatch<StopActions>) => {
    return {
        loadStopData(radiusInFeet: number): void {
            dispatch(loadStopData(radiusInFeet));
        }
    };
};

const StopsContainer = connect(
    mapStateToProps, 
    mapDispatchToProps
)(StopsComponent);

export default StopsContainer;
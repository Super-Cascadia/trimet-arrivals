import { connect, Dispatch } from 'react-redux';
import StopsComponent from './StopsComponent';
import { loadStopData } from '../../store/action';
import { RootState } from '../../store/reducers';
import { StopActions } from '../../store/action/stopActions';

const mapStateToProps = (state: RootState) => {
    const { stopsReducer } = state;
    const loading = stopsReducer.loading;
    const stopLocations = stopsReducer.stopLocations;
    const timeOfLastLoad = stopsReducer.timeOfLastLoad;

    return {
        loading,
        stopLocations,
        timeOfLastLoad
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
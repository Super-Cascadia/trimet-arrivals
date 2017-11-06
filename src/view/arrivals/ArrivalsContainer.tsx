import { connect, Dispatch } from 'react-redux';
import { RootState } from '../../store/reducers';
import { StopActions } from '../../store/action/stopActions';
import ArrivalsComponent from '../arrivals/ArrivalsComponent';

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
    return {};
};

const ArrivalsContainer = connect(
    mapStateToProps, 
    mapDispatchToProps
)(ArrivalsComponent);

export default ArrivalsContainer;
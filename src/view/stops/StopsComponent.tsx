import * as React from 'react';
import { StopLocationState } from '../../store/reducers/stopsReducer';
import StopsTable from './components/StopsTable';

export interface Props {
    loadStopData: (radiusInFeet: number) => void;
    loading: Boolean;
    stopLocations: StopLocationState;
}

class StopsComponent extends React.Component<Props> {
    componentDidMount() {
        const { loadStopData } = this.props;
        loadStopData(500);        
    }
    render() {
        const { loading, stopLocations } = this.props;

        return (
            <div>
                {loading && 
                    <div>Loading</div>
                }
                {!loading &&
                    <div>
                        <h1>Nearby Stops</h1>
                        <StopsTable stopLocations={stopLocations} />
                    </div>
                }
            </div>
        );
    }
}

export default StopsComponent;
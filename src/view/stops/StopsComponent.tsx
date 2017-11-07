import * as React from 'react';
import { StopLocationsDictionary } from '../../store/reducers/stopsReducer';
import StopsTable from './components/StopsTable';
import './Stops.css';

export interface Props {
    loadStopData: (radiusInFeet: number) => void;
    loading: Boolean;
    stopLocations: StopLocationsDictionary;
}

class StopsComponent extends React.Component<Props> {
    componentDidMount() {
        const { loadStopData } = this.props;
        loadStopData(750);        
    }
    render() {
        const { loading, stopLocations } = this.props;

        return (
            <div>
                {loading && 
                    <div>Loading...</div>
                }
                {!loading && stopLocations &&
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
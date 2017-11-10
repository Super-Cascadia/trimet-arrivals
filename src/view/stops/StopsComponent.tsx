import * as React from 'react';
import { StopLocationsDictionary } from '../../store/reducers/stopsReducer';
import StopsTable from './components/StopsTable';
import './Stops.css';
import * as moment from 'moment';

export type LoadStopData = (radiusInFeet: number) => void;

export interface Props {
    loadStopData: LoadStopData;
    loading: Boolean;
    stopLocations: StopLocationsDictionary;
}

class StopsComponent extends React.Component<Props> {
    componentDidMount() {
        const { loadStopData } = this.props;
        loadStopData(200);
    }
    render() {
        const { loading, stopLocations } = this.props;
        const currentTime = moment().format('ddd, h:mm:ss a');

        return (
            <div>
                {loading && 
                    <div>Loading...</div>
                }
                {!loading && stopLocations &&
                    <div>
                        <h1>Nearby Stops | {currentTime}</h1>
                        <StopsTable stopLocations={stopLocations} />
                    </div>
                }
            </div>
        );
    }
}

export default StopsComponent;
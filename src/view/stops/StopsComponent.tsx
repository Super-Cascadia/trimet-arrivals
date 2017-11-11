import * as React from 'react';
import { StopLocationsDictionary } from '../../store/reducers/stopsReducer';
import Stops from './components/Stops';
import './Stops.css';

export type LoadStopData = (radiusInFeet: number) => void;

export interface Props {
    loadStopData: LoadStopData;
    loading: Boolean;
    stopLocations: StopLocationsDictionary;
    timeOfLastLoad: string;
}

class StopsComponent extends React.Component<Props> {
    componentDidMount() {
        const { loadStopData } = this.props;
        loadStopData(750);
    }
    render() {
        const { loading, stopLocations, timeOfLastLoad } = this.props;

        return (
            <div>
                {loading && 
                    <div>Loading...</div>
                }
                {!loading && stopLocations &&
                    <div>
                        <h1>Nearby Stops | <i>{timeOfLastLoad}</i></h1>
                        <Stops stopLocations={stopLocations} showArrivals={true} />
                    </div>
                }
            </div>
        );
    }
}

export default StopsComponent;
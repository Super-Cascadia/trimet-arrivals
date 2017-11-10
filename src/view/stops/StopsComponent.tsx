import * as React from 'react';
import { StopLocationsDictionary } from '../../store/reducers/stopsReducer';
import StopsTable, { LoadArrivalData } from './components/StopsTable';
import './Stops.css';

export type LoadStopData = (radiusInFeet: number) => void;

export interface Props {
    loadStopData: LoadStopData;
    loading: Boolean;
    stopLocations: StopLocationsDictionary;
    loadArrivalData: LoadArrivalData;
}

class StopsComponent extends React.Component<Props> {
    componentDidMount() {
        const { loadStopData } = this.props;
        loadStopData(500);
    }
    render() {
        const { loading, stopLocations, loadArrivalData } = this.props;

        return (
            <div>
                {loading && 
                    <div>Loading...</div>
                }
                {!loading && stopLocations &&
                    <div>
                        <h1>Nearby Stops</h1>
                        <StopsTable stopLocations={stopLocations} loadArrivalData={loadArrivalData} />
                    </div>
                }
            </div>
        );
    }
}

export default StopsComponent;
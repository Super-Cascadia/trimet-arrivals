import * as React from 'react';
import { StopLocationsDictionary } from '../../../store/reducers/stopsReducer';
import { map } from 'lodash';
import { StopLocation } from '../../../api/trimet/types';
import ArrivalsContainer from '../../arrivals/ArrivalsContainer';
import '../Stops.css';

export interface Props {
    stopLocations: StopLocationsDictionary;
}

class StopsTable extends React.Component<Props> {
    static getLocationInfo(stopLocations: StopLocationsDictionary) {
        return map(stopLocations, (stopLocation: StopLocation, key: number) => {
            return (
                <div className="stops">
                    <div className="stops-header">
                        <h2>{stopLocation.locid} - {stopLocation.desc} - {stopLocation.dir}</h2>
                    </div>
                    <ArrivalsContainer locationId={key} />
                </div>
                                
            );
        });
    }

    render() {
        const { stopLocations } = this.props;

        if (!stopLocations) {
            return null;
        }

        return (
            <div>
                {StopsTable.getLocationInfo(stopLocations)}
            </div>
        );
    }
}

export default StopsTable;
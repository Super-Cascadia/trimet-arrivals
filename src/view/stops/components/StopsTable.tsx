import * as React from 'react';
import { StopLocationsDictionary } from '../../../store/reducers/stopsReducer';
import { map } from 'lodash';
import { StopLocation } from '../../../api/trimet/types';
import '../Stops.css';
import StopContainer from '../StopContainer';

export type LoadArrivalData = (locationId: number) => void;

interface Props {
    stopLocations: StopLocationsDictionary;
}

class StopsTable extends React.Component<Props> {
    static getLocationInfo(stopLocations: StopLocationsDictionary) {
        return map(stopLocations, (stopLocation: StopLocation, key: number) => {
            return (
                <StopContainer locationId={key} key={key} />
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
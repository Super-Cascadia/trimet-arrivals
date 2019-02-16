import React from 'react';
import { StopLocationsDictionary } from '../../../store/reducers/stopsReducer';
import { map } from 'lodash';
import { StopLocation } from '../../../api/trimet/types';
import '../Stops.css';
import StopContainer from '../StopContainer';

interface Props {
    stopLocations: StopLocationsDictionary;
    showArrivals: boolean;
}

class Stops extends React.Component<Props> {
    static getLocationInfo(stopLocations: StopLocationsDictionary, showArrivals: boolean) {
        return map(stopLocations, (stopLocation: StopLocation, key: number) => {
            return (
                <StopContainer locationId={key} key={key} showArrivals={showArrivals} />
            );
        });
    }

    render() {
        const { stopLocations, showArrivals } = this.props;

        if (!stopLocations) {
            return null;
        }

        return (
            <div className="stops">
                {Stops.getLocationInfo(stopLocations, showArrivals)}
            </div>
        );
    }
}

export default Stops;
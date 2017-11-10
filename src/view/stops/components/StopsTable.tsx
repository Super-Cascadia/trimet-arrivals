import * as React from 'react';
import { StopLocationsDictionary } from '../../../store/reducers/stopsReducer';
import { map } from 'lodash';
import { StopLocation } from '../../../api/trimet/types';
import ArrivalsContainer from '../../arrivals/ArrivalsContainer';
import '../Stops.css';
import StopsTableHeader from './StopsTableHeader';

export type LoadArrivalData = (locationId: number) => void;

interface Props {
    stopLocations: StopLocationsDictionary;
    loadArrivalData: LoadArrivalData;
}

class StopsTable extends React.Component<Props> {
    static getLocationInfo(stopLocations: StopLocationsDictionary, loadArrivalData: LoadArrivalData) {
        return map(stopLocations, (stopLocation: StopLocation, key: number) => {
            return (
                <div className="stops">
                    <StopsTableHeader
                        stopLocation={stopLocation}
                        loadArrivalData={loadArrivalData}
                    />
                    <ArrivalsContainer locationId={key} />
                </div>
                                
            );
        });
    }

    render() {
        const { stopLocations, loadArrivalData } = this.props;

        if (!stopLocations) {
            return null;
        }

        return (
            <div>
                {StopsTable.getLocationInfo(stopLocations, loadArrivalData)}
            </div>
        );
    }
}

export default StopsTable;
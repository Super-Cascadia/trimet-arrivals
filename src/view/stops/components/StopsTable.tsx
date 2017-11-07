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
    getLocationInfo(stopLocations: StopLocationsDictionary) {
        return map(stopLocations, (stopLocation: StopLocation, key: number) => {
            return (
                <article className="stops">
                    <header className="stops-header">
                        <h2>{stopLocation.locid} - {stopLocation.desc} - {stopLocation.dir}</h2>
                    </header>
                    <ArrivalsContainer locationId={key} />
                </article>
                                
            );
        });
    }

    render() {
        const { stopLocations } = this.props;

        if (!stopLocations) {
            return null;
        }

        return (
            <section>
                {this.getLocationInfo(stopLocations)}
            </section>
        );
    }
}

export default StopsTable;
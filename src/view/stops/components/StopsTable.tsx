import * as React from 'react';
import { StopLocationsDictionary } from '../../../store/reducers/stopsReducer';
import { map } from 'lodash';
import { StopLocation } from '../../../api/trimet/types';
import ArrivalsContainer from '../../arrivals/ArrivalsContainer';

export interface Props {
    stopLocations: StopLocationsDictionary;
}

class StopsTable extends React.Component<Props> {
    getRow(location: StopLocation) {
        return (
            <tr>
                <td>{location.locid}</td>
                <td>{location.desc}</td>
                <td>{location.dir}</td>            
            </tr>
        );
    }

    getStopInfoTable(stopLocation: StopLocation) {
        return (
            <table>
                <thead>
                    <tr>
                        <th>ID:</th>
                        <th>Name:</th>
                        <th>Direction</th>
                    </tr>
                </thead>
                <tbody>
                    {this.getRow(stopLocation)}
                </tbody>
            </table>
        );
    }

    getLocationInfo(stopLocations: StopLocationsDictionary) {
        return map(stopLocations, (stopLocation: StopLocation, key: number) => {
            return (
                <article className="stops">
                    {this.getStopInfoTable(stopLocation)}
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
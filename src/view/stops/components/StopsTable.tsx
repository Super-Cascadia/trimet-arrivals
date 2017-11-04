import * as React from 'react';
import { StopLocationState } from '../../../store/reducers/stopsReducer';
import { map } from 'lodash';
import { StopLocation } from '../../../api/trimet/types';

export interface Props {
    stopLocations: StopLocationState;
}

class StopsTable extends React.Component<Props> {
    getRow(locations: StopLocationState) {
        return map(locations, (location: StopLocation) => {
            return (
                <tr>
                    <td>{location.locid}</td>
                    <td>{location.desc}</td>
                    <td>{location.dir}</td>            
                </tr>
            );
        });
    }

    render() {
        const { stopLocations } = this.props;

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
                    {this.getRow(stopLocations)}
                </tbody>
            </table>
        );
    }
}

export default StopsTable;
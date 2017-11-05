import * as React from 'react';
import { LocationArrivals } from '../../../store/reducers/arrivalsReducer';
import { map, sortBy } from 'lodash';
import { Arrival } from '../../../api/trimet/types';
import * as moment from 'moment';

export interface Props {
    arrivals: LocationArrivals;
}

function sortArrivalsByEstimatedTime(arrivals: LocationArrivals): Arrival[] {
    return sortBy(arrivals, (arrival: Arrival) => {
        return arrival.estimated;
    });
}

class ArrivalsTable extends React.Component<Props> {
    getRow(arrival: Arrival) {
        const scheduledTime = moment(arrival.scheduled).format('ddd, h:mm:ss a');
        const estimatedTime = moment(arrival.estimated).format('ddd, h:mm:ss a'); 
        
        const MILE = 5280;
        const distance = arrival.feet < MILE ? MILE / arrival.feet : arrival.feet / MILE;

        return (
            <tr>
                <td>{arrival.shortSign}</td>
                <td>{Math.round(distance)} miles</td>
                <td>{estimatedTime}</td>   
                <td>{scheduledTime}</td>                     
            </tr>
        );
    }

    getRows(arrivals: LocationArrivals) {
        const sortedArrivals = sortArrivalsByEstimatedTime(arrivals);

        return map(sortedArrivals, (arrival: Arrival) => {
            return this.getRow(arrival);
        });
    }
    
    render() {
        const { arrivals } = this.props;

        if (!arrivals) {
            return null;
        }
        
        return (
            <table>
                <thead>
                    <tr>
                        <th>Name:</th>
                        <th>Distance:</th>
                        <th>Estimated:</th>
                        <th>Scheduled:</th>
                    </tr>
                </thead>
                <tbody>
                    {this.getRows(arrivals)}
                </tbody>
            </table>
        );
    }
}

export default ArrivalsTable;
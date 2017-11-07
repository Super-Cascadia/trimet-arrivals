import * as React from 'react';
import { map, sortBy } from 'lodash';
import { Arrival } from '../../../api/trimet/types';
import * as moment from 'moment';
import './Arrivals.css';

export interface Props {
    arrivals: Arrival[];
}

function sortArrivalsByEstimatedTime(arrivals: Arrival[]): Arrival[] {
    return sortBy(arrivals, (arrival: Arrival) => {
        return arrival.estimated;
    });
}

function getDistanceUntilArrival(feet: number): number {
    const MILE = 5280;

    return feet && feet < MILE ? MILE / feet : feet && feet / MILE;
}

class ArrivalsTable extends React.Component<Props> {
    getArrivalIndicator(arrival: Arrival) {
        return (
            <div className="route-indicator">{arrival.route}</div>
        );
    }
    getRow(arrival: Arrival) {
        const scheduledTime = moment(arrival.scheduled).format('ddd, h:mm:ss a');
        const estimatedTime = moment(arrival.estimated).format('ddd, h:mm:ss a');         
        const distance = getDistanceUntilArrival(arrival.feet);

        return (
            <tr>
                <td className="route-indicator-column">
                    {this.getArrivalIndicator(arrival)}
                </td>
                <td>{arrival.shortSign}</td>
                <td>{Math.round(distance)} miles</td>
                <td>{estimatedTime}</td>   
                <td>{scheduledTime}</td>                     
            </tr>
        );
    }

    getRows(arrivals: Arrival[]) {
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
            <table className="arrivals-table">
                <tbody>
                    {this.getRows(arrivals)}
                </tbody>
            </table>
        );
    }
}

export default ArrivalsTable;
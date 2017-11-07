import * as React from 'react';
import { map, sortBy } from 'lodash';
import { Arrival } from '../../../api/trimet/types';
import ArrivalRow from './ArrivalRow';
import './Arrivals.css';

export interface Props {
    arrivals: Arrival[];
}

function sortArrivalsByEstimatedTime(arrivals: Arrival[]): Arrival[] {
    return sortBy(arrivals, (arrival: Arrival) => {
        return arrival.estimated;
    });
}

class ArrivalsTable extends React.Component<Props> {
    getArrivalIndicator(arrival: Arrival) {
        return (
            <div className="route-indicator">{arrival.route}</div>
        );
    }
    getRow(arrival: Arrival) {
        return (
            <ArrivalRow arrival={arrival} />
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
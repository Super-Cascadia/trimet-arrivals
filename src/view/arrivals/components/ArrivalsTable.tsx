import React from 'react';
import { map, sortBy } from 'lodash';
import { Arrival } from '../../../api/trimet/types';
import ArrivalRow from './ArrivalRow';
import './Arrivals.css';
import classNames from 'classnames';
import { Moment } from 'moment';

export interface Props {
    arrivals: Arrival[];
    loading: boolean;
    now: Moment
}

function sortArrivalsByEstimatedTime(arrivals: Arrival[]): Arrival[] {
    return sortBy(arrivals, (arrival: Arrival) => {
        return arrival.estimated;
    });
}

class ArrivalsTable extends React.Component<Props> {
    static getRows(arrivals: Arrival[], now) {
        const sortedArrivals = sortArrivalsByEstimatedTime(arrivals);

        return map(sortedArrivals, (arrival: Arrival) => {
            const { scheduled, estimated, feet, route, shortSign, id } = arrival;

            return (
                <ArrivalRow
                    key={id}
                    estimated={estimated}
                    feet={feet}
                    scheduled={scheduled}
                    route={route}
                    shortSign={shortSign}
                    now={now}
                />
            );
        });
    }
    
    render() {
        const { arrivals, loading, now } = this.props;

        if (!arrivals) {
            return null;
        }

        const classes = classNames('arrivals-table', {
            'arrivals-loading': loading
        });

        return (
            <table className={classes}>
                <th/>
                <th>Name</th>
                <th>Arrival</th>
                <th>On Time</th>
                <th>Estimated / Scheduled</th>
                <th>Distance</th>
                <tbody>
                    {ArrivalsTable.getRows(arrivals, now)}
                </tbody>
            </table>
        );
    }
}

export default ArrivalsTable;
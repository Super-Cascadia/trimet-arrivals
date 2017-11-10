import * as React from 'react';
import { Arrival } from '../../../api/trimet/types';
import * as moment from 'moment';
import RouteIndicator from '../../../component/route/RouteIndicator';
import './Arrivals.css';
import { Moment } from 'moment';

interface Props {
    arrival: Arrival;
}

function getDistanceUntilArrival(feet: number): number {
    const MILE = 5280;

    return feet && feet < MILE ? MILE / feet : feet && feet / MILE;
}

class ArrivalRow extends React.Component<Props> {
    static timeToArrivalIndicator(scheduled: Moment, estimated: Moment) {
        const seconds = moment(scheduled.diff(estimated)).seconds();

        if (seconds === 0) {
            return <span className="arrival-on-time"> On time</span>;
        } else {
            return <span className="arrival-estimated-late">{seconds}s late</span>;
        }
    }

    render() {
        const { arrival } = this.props;
        const scheduled = moment(arrival.scheduled);
        const estimated = moment(arrival.estimated);
        const untilArrival = moment(estimated.diff(moment.now())).seconds();

        const scheduledTime = scheduled.format('ddd, h:mm:ss a');
        const estimatedTime = estimated.format('ddd, h:mm:ss a');         
        const distance = getDistanceUntilArrival(arrival.feet);

        return (
            <tr>
                <td className="route-indicator-column">
                    <RouteIndicator routeId={arrival.route} />
                </td>
                <td>{arrival.shortSign}</td>
                <td>{ArrivalRow.timeToArrivalIndicator(scheduled, estimated)}</td>
                <td>{untilArrival}s away</td>
                <td>{Math.round(distance)} miles</td>
                <td>{estimatedTime}</td>   
                <td>{scheduledTime}</td>                     
            </tr>
        );
    }
}

export default ArrivalRow;
import React from 'react';
import { Arrival } from '../../../api/trimet/types';
import moment from 'moment';
import RouteIndicator from '../../../component/route/RouteIndicator';
import './Arrivals.css';
import { Moment } from 'moment';
import LateIndicator from '../../../component/arrivalIndicator/LateIndicator';
import EarlyIndicator from '../../../component/arrivalIndicator/EarlyIndicator';
import TimeToArrivalIndicator from '../../../component/arrivalIndicator/TimeToArrivalIndicator';

interface Props {
    arrival: Arrival;
}

function getDistanceUntilArrival(feet: number): number {
    const MILE = 5280;

    return feet && feet < MILE ? MILE / feet : feet && feet / MILE;
}

function isEstimatedEarly(estimated: Moment, scheduled: Moment) {
    return estimated.isBefore(scheduled);
}

function estimatedToArriveAtSameTime (scheduled: moment.Moment, estimated: moment.Moment) {
    return scheduled.isSame(estimated);
}

class ArrivalRow extends React.Component<Props> {
    static onTimeIndicator(scheduled: Moment, estimated: Moment) {
        if (estimatedToArriveAtSameTime(scheduled, estimated)) {
            return <span className="arrival-on-time"> On time</span>;
        } else {
            if (isEstimatedEarly(estimated, scheduled)) {
                return <EarlyIndicator scheduled={scheduled} estimated={estimated}/>;
            } else {
                return <LateIndicator scheduled={scheduled} estimated={estimated}/>;
            }
        }
    }

    render() {
        const { arrival } = this.props;
        const scheduled = moment(arrival.scheduled);
        const estimated = moment(arrival.estimated);
        const scheduledTime = scheduled.format('h:mm:ss a');
        const estimatedTime = estimated.format('h:mm:ss a');
        const distance = getDistanceUntilArrival(arrival.feet);
        const now = moment();

        return (
            <tr>
                <td className="route-indicator-column">
                    <RouteIndicator routeId={arrival.route} />
                </td>
                <td>{arrival.shortSign}</td>
                <td>
                    <TimeToArrivalIndicator estimated={estimated} now={now} />
                </td>
                <td>{ArrivalRow.onTimeIndicator(scheduled, estimated)}</td>
                <td>{estimatedTime} / {scheduledTime}</td>
                <td>{Math.round(distance)} miles</td>
            </tr>
        );
    }
}

export default ArrivalRow;
import React from 'react';
import { Arrival } from '../../../api/trimet/types';
import moment, { Moment } from 'moment';
import RouteIndicator from '../../../component/route/RouteIndicator';
import './Arrivals.css';
import LateIndicator from '../../../component/arrivalIndicator/LateIndicator';
import EarlyIndicator from '../../../component/arrivalIndicator/EarlyIndicator';
import TimeToArrivalIndicator from '../../../component/arrivalIndicator/TimeToArrivalIndicator';
import { estimatedToArriveAtSameTime, isEstimatedEarly, getDistanceUntilArrival } from '../util';

interface Props {
    arrival: Arrival;
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

    static getEstimatedScheduledTime(scheduled, estimated) {
        const scheduledTime = scheduled.format('h:mm:ss a');
        const estimatedTime = estimated.format('h:mm:ss a');

        return `${estimatedTime} / ${scheduledTime}`
    }

    render() {
        const { arrival } = this.props;
        const scheduled = moment(arrival.scheduled);
        const estimated = moment(arrival.estimated);
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
                <td>{ArrivalRow.getEstimatedScheduledTime(scheduled, estimated)}</td>
                <td>{Math.round(distance)} miles</td>
            </tr>
        );
    }
}

export default ArrivalRow;
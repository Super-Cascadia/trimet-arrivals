import * as React from 'react';
import { Arrival } from '../../../api/trimet/types';
import * as moment from 'moment';
import RouteIndicator from '../../../component/route/RouteIndicator';
import './Arrivals.css';
import { Moment } from 'moment';
import LateIndicator from './LateIndicator';
import EarlyIndicator from './EarlyIndicator';

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
    static timeToArrivalIndicator(estimated: Moment) {
        const now = moment();
        const diff = estimated.diff(now);
        const secondsUntil = moment(diff).seconds();
        const minutesUntil = moment(diff).minutes();

        return `${minutesUntil}m ${secondsUntil}s away`;
    }
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
        const scheduledTime = scheduled.format('ddd, h:mm:ss a');
        const estimatedTime = estimated.format('ddd, h:mm:ss a');
        const distance = getDistanceUntilArrival(arrival.feet);

        return (
            <tr>
                <td className="route-indicator-column">
                    <RouteIndicator routeId={arrival.route} />
                </td>
                <td>{arrival.shortSign}</td>
                <td>{ArrivalRow.onTimeIndicator(scheduled, estimated)}</td>
                <td>{ArrivalRow.timeToArrivalIndicator(estimated)}</td>
                <td>{Math.round(distance)} miles</td>
                <td>{estimatedTime}</td>
                <td>{scheduledTime}</td>
            </tr>
        );
    }
}

export default ArrivalRow;
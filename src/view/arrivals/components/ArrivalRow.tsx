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
    scheduled: number
    estimated: number
    feet: number
    route: number
    shortSign: string
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

    static getEstimatedScheduledTime(scheduled: Moment, estimated: Moment) {
        const scheduledTime = scheduled.format('h:mm:ss a');
        const estimatedTime = estimated.format('h:mm:ss a');

        return `${estimatedTime} / ${scheduledTime}`
    }

    render() {
        const { scheduled, estimated, feet, route, shortSign } = this.props;
        const scheduledMoment = moment(scheduled);
        const estimatedMoment = moment(estimated);
        const distance = getDistanceUntilArrival(feet);
        const now = moment();

        return (
            <tr>
                <td className="route-indicator-column">
                    <RouteIndicator routeId={route} />
                </td>
                <td>{shortSign}</td>
                <td>
                    <TimeToArrivalIndicator estimated={estimatedMoment} now={now} />
                </td>
                <td>{ArrivalRow.onTimeIndicator(scheduledMoment, estimatedMoment)}</td>
                <td>{ArrivalRow.getEstimatedScheduledTime(scheduledMoment, estimatedMoment)}</td>
                <td>{Math.round(distance)} miles</td>
            </tr>
        );
    }
}

export default ArrivalRow;
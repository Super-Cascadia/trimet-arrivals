import * as React from 'react';
import { Arrival } from '../../../api/trimet/types';
import * as moment from 'moment';
import './Arrivals.css';

export interface Props {
    arrival: Arrival;
}

function getDistanceUntilArrival(feet: number): number {
    const MILE = 5280;

    return feet && feet < MILE ? MILE / feet : feet && feet / MILE;
}

class ArrivalRow extends React.Component<Props> {
    getArrivalIndicator(arrival: Arrival) {
        return (
            <div className="route-indicator">{arrival.route}</div>
        );
    }
    
    render() {
        const { arrival } = this.props;
        const scheduled = moment(arrival.scheduled);
        const estimated = moment(arrival.scheduled);
        const seconds = moment(scheduled.diff(estimated)).seconds();
        
        const scheduledTime = scheduled.format('ddd, h:mm:ss a');
        const estimatedTime = estimated.format('ddd, h:mm:ss a');         
        const distance = getDistanceUntilArrival(arrival.feet);

        return (
            <tr>
                <td className="route-indicator-column">
                    {this.getArrivalIndicator(arrival)}
                </td>
                <td>{arrival.shortSign}</td>
                <td>{Math.round(distance)} miles</td>
                <td>{seconds}</td>
                <td>{estimatedTime}</td>   
                <td>{scheduledTime}</td>                     
            </tr>
        );
    }
}

export default ArrivalRow;
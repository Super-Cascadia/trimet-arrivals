import * as React from 'react';
import * as moment from 'moment';
import './Arrivals.css';
import { Moment } from 'moment';

interface Props {
    estimated: Moment;
}

class TimeToArrivalIndicator extends React.PureComponent<Props> {
    render() {
        const { estimated } = this.props;
        const now = moment();
        const diff = estimated.diff(now);
        const secondsUntil = moment(diff).seconds();
        const minutesUntil = moment(diff).minutes();

        if (minutesUntil === 0) {
            return `${secondsUntil}s`;
        }

        return `${minutesUntil}m ${secondsUntil}s`;
    }
}

export default TimeToArrivalIndicator;
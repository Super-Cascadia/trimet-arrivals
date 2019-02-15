import React from 'react';
import './Arrivals.css';
import moment, { Moment } from 'moment';

interface Props {
    estimated: Moment;
    now: Moment;
}

export default class TimeToArrivalIndicator extends React.PureComponent<Props> {
    render() {
        const { estimated, now } = this.props;

        if (estimated && now) {
            const diff = estimated.diff(now);
            const secondsUntil = moment(diff).seconds();
            const minutesUntil = moment(diff).minutes();

            if (minutesUntil === 0) {
                return `${secondsUntil}s`;
            }

            return `${minutesUntil}m ${secondsUntil}s`;
        }

        return '-';
    }
}
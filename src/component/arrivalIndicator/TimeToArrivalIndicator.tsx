import React from 'react';
import './Indicator.css'
import { Moment } from 'moment';
import { secondMinutesDiff } from './util';

interface Props {
    estimated: Moment;
    now: Moment;
}

export default class TimeToArrivalIndicator extends React.PureComponent<Props> {
    render() {
        const { estimated, now } = this.props;

        if (estimated && now) {
            const { seconds, minutes } = secondMinutesDiff(estimated, now);

            if (minutes === 0) {
                return `${seconds}s`;
            }

            return `${minutes}m ${seconds}s`;
        }

        return '-';
    }
}
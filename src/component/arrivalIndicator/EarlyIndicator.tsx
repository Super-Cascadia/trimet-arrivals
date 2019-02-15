import React from 'react';
import { Moment } from 'moment';
import './Indicator.css'
import { remainingMinutes, secondMinutesDiff } from './util';

interface Props {
    scheduled: Moment;
    estimated: Moment;
}

export default class EarlyIndicator extends React.PureComponent<Props> {
    render() {
        const { scheduled, estimated } = this.props;

        if (scheduled && estimated) {
            const { seconds, minutes } = secondMinutesDiff(estimated, scheduled);
            const { secondsDiff, minutesDiff } = remainingMinutes(minutes, seconds);

            if (minutesDiff === 0) {
                return <span className="arrival-estimated-early">{secondsDiff}s early</span>;
            }

            return <span className="arrival-estimated-early">{59 - minutes}m {60 - seconds}s early</span>;
        }

        return "-"
    }
}
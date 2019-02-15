import React from 'react';
import { Moment } from 'moment';
import './Indicator.css'
import { remainingMinutes, secondMinutesDiff } from './util';

interface Props {
    scheduled: Moment;
    estimated: Moment;
}

export default class LateIndicator extends React.PureComponent<Props> {
    render() {
        const { scheduled, estimated } = this.props;

        if (scheduled && estimated) {
            const { seconds, minutes } = secondMinutesDiff(scheduled, estimated);
            const { secondsDiff, minutesDiff } = remainingMinutes(minutes, seconds);

            if (minutesDiff === 0) {
                return <span className="arrival-estimated-late">{secondsDiff}s late</span>;
            }

            return <span className="arrival-estimated-late">{minutesDiff}m {secondsDiff}s late</span>;
        }

        return "-"
    }
}
import React from 'react';
import moment from 'moment';
import './Arrivals.css';
import { Moment } from 'moment';

interface Props {
    scheduled: Moment;
    estimated: Moment;
}

class LateIndicator extends React.PureComponent<Props> {
    render() {
        const { scheduled, estimated } = this.props;
        const diff = scheduled.diff(estimated);
        const seconds = moment(diff).seconds();
        const minutes = moment(diff).minutes();
        const minutesDiff = 59 - minutes;
        const secondsDiff = 60 - seconds;

        if (minutesDiff === 0) {
            return <span className="arrival-estimated-late">{secondsDiff}s late</span>;
        }

        return <span className="arrival-estimated-late">{minutesDiff}m {secondsDiff}s late</span>;
    }
}

export default LateIndicator;
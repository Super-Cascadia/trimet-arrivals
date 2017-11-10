import * as React from 'react';
import * as moment from 'moment';
import './Arrivals.css';
import { Moment } from 'moment';

interface Props {
    scheduled: Moment;
    estimated: Moment;
}

class EarlyIndicator extends React.PureComponent<Props> {
    render() {
        const { scheduled, estimated } = this.props;
        const diff = estimated.diff(scheduled);
        const seconds = moment(diff).seconds();
        const minutes = moment(diff).minutes();

        const minutesDiff = 59 - minutes;
        const secondsDiff = 60 - seconds;

        if (minutesDiff === 0) {
            return <span className="arrival-estimated-early">{secondsDiff}s early</span>;
        }

        return <span className="arrival-estimated-early">{59 - minutes}m {60 - seconds}s early</span>;
    }
}

export default EarlyIndicator;
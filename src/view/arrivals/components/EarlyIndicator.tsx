import * as React from 'react';
import * as moment from 'moment';
import './Arrivals.css';
import { Moment } from 'moment';

interface Props {
    scheduled: Moment;
    estimated: Moment;
}

class EarlyIndicator extends React.Component<Props> {
    render() {
        const { scheduled, estimated } = this.props;
        const diff = estimated.diff(scheduled);
        const seconds = moment(diff).seconds();
        const minutes = moment(diff).minutes();

        return <span className="arrival-estimated-early">{59 - minutes}m {60 - seconds}s early</span>;
    }
}

export default EarlyIndicator;
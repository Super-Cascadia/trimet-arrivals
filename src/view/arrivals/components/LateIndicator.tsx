import * as React from 'react';
import * as moment from 'moment';
import './Arrivals.css';
import { Moment } from 'moment';

interface Props {
    scheduled: Moment;
    estimated: Moment;
}

class LateIndicator extends React.Component<Props> {
    render() {
        const { scheduled, estimated } = this.props;
        const diff = scheduled.diff(estimated);
        const seconds = moment(diff).seconds();
        const minutes = moment(diff).minutes();

        return <span className="arrival-estimated-late">{59 - minutes}m {60 - seconds}s late</span>;
    }
}

export default LateIndicator;
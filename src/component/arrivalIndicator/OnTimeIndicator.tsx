import { Moment } from 'moment';
import { estimatedToArriveAtSameTime, isEstimatedEarly } from '../../view/arrivals/util';
import React from 'react';
import LateIndicator from './LateIndicator';
import EarlyIndicator from './EarlyIndicator';

interface Props {
    scheduled: Moment
    estimated: Moment
}

export default function OnTimeIndicator({ scheduled, estimated } : Props) {
    if (estimatedToArriveAtSameTime(scheduled, estimated)) {
        return <span className="arrival-on-time"> On time</span>;
    } else {
        if (isEstimatedEarly(estimated, scheduled)) {
            return <EarlyIndicator scheduled={scheduled} estimated={estimated}/>;
        } else {
            return <LateIndicator scheduled={scheduled} estimated={estimated}/>;
        }
    }
}
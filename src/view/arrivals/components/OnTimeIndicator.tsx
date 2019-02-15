import { Moment } from 'moment';
import { estimatedToArriveAtSameTime, isEstimatedEarly } from '../util';
import React from 'react';
import LateIndicator from '../../../component/arrivalIndicator/LateIndicator';
import EarlyIndicator from '../../../component/arrivalIndicator/EarlyIndicator';

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
import { Moment } from "moment";
import React from "react";
import LateIndicator from "./LateIndicator";
import EarlyIndicator from "./EarlyIndicator";

interface Props {
  scheduled: Moment;
  estimated: Moment;
}

export function isEstimatedEarly(scheduled: Moment, estimated: Moment) {
  return estimated.isBefore(scheduled);
}

export function estimatedToArriveAtSameTime(
  scheduled: Moment,
  estimated: Moment
) {
  return scheduled.isSame(estimated);
}

export default function OnTimeIndicator({ scheduled, estimated }: Props) {
  if (scheduled && estimated) {
    if (estimatedToArriveAtSameTime(scheduled, estimated)) {
      return <span className="arrival-on-time"> On time</span>;
    } else {
      if (isEstimatedEarly(scheduled, estimated)) {
        return <EarlyIndicator scheduled={scheduled} estimated={estimated} />;
      } else {
        return <LateIndicator scheduled={scheduled} estimated={estimated} />;
      }
    }
  }

  return null;
}

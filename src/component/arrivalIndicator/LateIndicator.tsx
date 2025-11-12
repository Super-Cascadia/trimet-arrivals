import { Moment } from "moment";
import React from "react";
import "./Indicator.css";
import { remainingTime, timeDiff } from "./util";

interface Props {
  scheduled: Moment;
  estimated: Moment;
}

export default class LateIndicator extends React.PureComponent<Props> {
  public render() {
    const { scheduled, estimated } = this.props;

    if (scheduled && estimated) {
      const { seconds, minutes } = timeDiff(scheduled, estimated);
      const { secondsDiff, minutesDiff } = remainingTime(minutes, seconds);

      if (minutesDiff === 0) {
        return (
          <span className="arrival-estimated-late">{secondsDiff}s late</span>
        );
      }

      return (
        <span className="arrival-estimated-late">
          {minutesDiff}m {secondsDiff}s late
        </span>
      );
    }

    return "-";
  }
}

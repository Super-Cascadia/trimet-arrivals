import moment from "moment";
import React from "react";
import { Badge } from "react-bootstrap";
import { getTimeDifferenceInMinutes } from "../../../util/timeUtils";
import { ArrivalCountdown } from "./ArrivalCountdown";

interface TimeDiffBadgeParams {
  estimatedArrivalTime: number;
  scheduledArrivalTime: number;
}

function TimeDiffBadge({
  estimatedArrivalTime,
  scheduledArrivalTime
}: TimeDiffBadgeParams) {
  const minutesLate = getTimeDifferenceInMinutes(
    scheduledArrivalTime,
    moment(estimatedArrivalTime)
  );

  const onTime = minutesLate === 0;
  const late = minutesLate < 0;
  const early = minutesLate > 0;

  const getColor = () => {
    if (onTime) {
      return "success";
    } else if (late) {
      return "danger";
    } else {
      return "primary";
    }
  };

  const color = getColor();

  const getStatusDescription = () => {
    if (onTime) {
      return <span> | On Time</span>;
    } else if (late) {
      return <span> | late</span>;
    } else {
      return null;
    }
  };

  return (
    <Badge bg={color} pill={true}>
      <span>
        <ArrivalCountdown
          estimatedArrivalTime={estimatedArrivalTime}
          scheduledArrivalTime={scheduledArrivalTime}
        />{" "}
        {getStatusDescription()}
      </span>
    </Badge>
  );
}

export default TimeDiffBadge;

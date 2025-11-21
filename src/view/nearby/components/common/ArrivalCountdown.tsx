import React, { useState, useEffect } from "react";
import moment from "moment";

interface ArrivalCountdownParams {
  estimatedArrivalTime: number;
  scheduledArrivalTime: number;
}

export function ArrivalCountdown({
  estimatedArrivalTime,
  scheduledArrivalTime,
}: ArrivalCountdownParams) {
  const [timeString, setTimeString] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = moment();
      const arrivalTime = moment(
        estimatedArrivalTime || scheduledArrivalTime
      );
      const diffInSeconds = arrivalTime.diff(now, "seconds");

      if (diffInSeconds <= 0) {
        setTimeString("Arriving");
      } else if (diffInSeconds < 60) {
        setTimeString(`${diffInSeconds}s`);
      } else {
        const minutes = Math.floor(diffInSeconds / 60);
        const seconds = diffInSeconds % 60;
        if (minutes >= 60) {
          const hours = Math.floor(minutes / 60);
          const remainingMinutes = minutes % 60;
          setTimeString(
            `${hours}hr ${remainingMinutes}m ${seconds}s`
          );
        } else {
          setTimeString(`${minutes}m ${seconds}s`);
        }
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [estimatedArrivalTime, scheduledArrivalTime]);

  return <>{timeString}</>;
}

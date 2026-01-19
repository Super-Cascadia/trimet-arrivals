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
        setTimeString(`0:${String(diffInSeconds).padStart(2, '0')}`);
      } else {
        const minutes = Math.floor(diffInSeconds / 60);
        const seconds = diffInSeconds % 60;
        if (minutes >= 60) {
          const hours = Math.floor(minutes / 60);
          const remainingMinutes = minutes % 60;
          setTimeString(
            `${hours}:${String(remainingMinutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
          );
        } else {
          setTimeString(`${minutes}:${String(seconds).padStart(2, '0')}`);
        }
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [estimatedArrivalTime, scheduledArrivalTime]);

  return <>{timeString}</>;
}

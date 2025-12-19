import React from "react";
import { ArrivalCountdown } from "./ArrivalCountdown";
import { StatusIndicator } from "./StatusIndicator";
import "./ArrivalListItem.scss";

interface ArrivalTimestampProps {
  estimatedArrivalTime: number;
  scheduledArrivalTime: number;
}

/**
 * Displays arrival time information including a countdown and exact time.
 * Shows the estimated arrival time if available, otherwise falls back to scheduled time.
 * 
 * @param estimatedArrivalTime - The estimated arrival timestamp in milliseconds
 * @param scheduledArrivalTime - The scheduled arrival timestamp in milliseconds
 * @returns A component displaying countdown, exact time, and status indicator
 */
export function ArrivalTimestamp({ estimatedArrivalTime, scheduledArrivalTime }: ArrivalTimestampProps) {
  // Format exact arrival time
  const arrivalTimeStamp = estimatedArrivalTime || scheduledArrivalTime;
  const arrivalDate = new Date(arrivalTimeStamp);
  const now = new Date();
  const isToday = arrivalDate.toDateString() === now.toDateString();

  const exactTime = arrivalTimeStamp 
    ? arrivalDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    : '';

  if (!isToday && arrivalTimeStamp) {
    const dateString = arrivalDate.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
    
    return (
      <div className="text-end arrival-time-container flex-shrink-0">
        <span className="h6">
          <span className="arrival-time-text">
            {dateString}
          </span>
          {exactTime && <span className="text-muted exact-time arrival-time-text"> | {exactTime}</span>}
          <StatusIndicator estimated={estimatedArrivalTime} scheduled={scheduledArrivalTime} />
        </span>
      </div>
    );
  }

  return (
    <div className="text-end arrival-time-container flex-shrink-0">
      <span className="h6">
        <span className="arrival-time-text">
          <ArrivalCountdown
            estimatedArrivalTime={estimatedArrivalTime}
            scheduledArrivalTime={scheduledArrivalTime}
          />
        </span>
        {exactTime && <span className="text-muted exact-time arrival-time-text"> | {exactTime}</span>}
        <StatusIndicator estimated={estimatedArrivalTime} scheduled={scheduledArrivalTime} />
      </span>
    </div>
  );
}

import moment from "moment";
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

interface StatusIndicatorProps {
  estimated?: number;
  scheduled?: number;
}

export function StatusIndicator({ estimated, scheduled }: StatusIndicatorProps) {
  if (!estimated || !scheduled) {
    // Show grey circle if status can't be computed
    return (
      <span
        className="status-indicator"
        style={{
          display: "inline-block",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: "#6c757d",
          marginLeft: "4px",
          verticalAlign: "middle"
        }}
      />
    );
  }

  const diffInMinutes = moment(estimated).diff(moment(scheduled), "minutes");
  
  let color: string;
  let status: string;
  let detail: string;
  
  if (Math.abs(diffInMinutes) <= 1) {
    color = "#28a745"; // Green - on time
    status = "On Time";
    detail = "Arrival is on schedule";
  } else if (diffInMinutes < -1) {
    color = "#007bff"; // Blue - early
    status = "Early";
    detail = `Running ${Math.abs(diffInMinutes)} minute${Math.abs(diffInMinutes) === 1 ? '' : 's'} early`;
  } else {
    color = "#dc3545"; // Red - late
    status = "Delayed";
    detail = `Running ${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} late`;
  }

  const tooltip = (
    <Tooltip id="status-tooltip">
      <strong>{status}</strong>
      <br />
      {detail}
    </Tooltip>
  );

  return (
    <OverlayTrigger placement="left" overlay={tooltip}>
      <span
        className="status-indicator"
        style={{
          display: "inline-block",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: color,
          marginLeft: "4px",
          cursor: "pointer",
          verticalAlign: "middle"
        }}
      />
    </OverlayTrigger>
  );
}

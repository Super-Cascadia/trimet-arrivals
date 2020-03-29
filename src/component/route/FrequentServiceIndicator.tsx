import React from "react";
import "./FrequentServiceIndicator.scss";

interface FrequentServiceProps {
  frequentService: boolean;
}

export default function FrequentServiceIndicator({
  frequentService
}: FrequentServiceProps) {
  if (!frequentService) {
    return null;
  }

  return (
    <div className="frequent-service-indicator">
      Frequent
      <br />
      Service
    </div>
  );
}

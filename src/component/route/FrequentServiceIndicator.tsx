import React from "react";
import "./FrequentServiceIndicator.scss";

interface FrequentServiceProps {
  frequentService: boolean;
  small?: boolean;
}

export default function FrequentServiceIndicator({
  frequentService,
  small
}: FrequentServiceProps) {
  if (!frequentService) {
    return null;
  }

  const frequentServiceIndicator = "frequent-service-indicator";

  const classNames = small
    ? `${frequentServiceIndicator} small`
    : frequentServiceIndicator;

  return (
    <div className={classNames}>
      Frequent
      <br />
      Service
    </div>
  );
}

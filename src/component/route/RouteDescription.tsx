import React from "react";

interface Props {
  description: string;
}

export default function RouteDescription({ description }: Props) {
  return (
    <span className="route-description">
      <span>{description}</span>
    </span>
  );
}

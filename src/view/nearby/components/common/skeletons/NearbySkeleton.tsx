import React from "react";
import "./NearbySkeleton.scss";

type WidthClass = "w-100" | "w-80" | "w-60" | "w-50" | "w-40";
type HeightClass = "h-sm" | "h-md";

interface SkeletonLineProps {
  width?: WidthClass;
  height?: HeightClass;
  className?: string;
}

function SkeletonLine({ width = "w-100", height = "h-sm", className = "" }: SkeletonLineProps) {
  return <div className={`skeleton-line ${width} ${height} ${className}`} />;
}

interface NearbySkeletonListProps {
  cards?: number;
  rowsPerCard?: number;
}

export function NearbySkeletonList({ cards = 3, rowsPerCard = 3 }: NearbySkeletonListProps) {
  return (
    <div className="skeleton-container">
      {Array.from({ length: cards }).map((_, ci) => (
        <div key={`s-card-${ci}`} className="skeleton-card">
          <SkeletonLine className="is-header" width="w-60" height="h-md" />
          <div className="skeleton-gap" />
          {Array.from({ length: rowsPerCard }).map((_, ri) => (
            <div key={`s-row-${ci}-${ri}`} className="skeleton-list-item">
              <SkeletonLine width="w-40" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default NearbySkeletonList;

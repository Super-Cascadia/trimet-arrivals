import { map } from "lodash";
import React, { useState } from "react";
import Select from "react-select";
import {
  StopData,
} from "../../../../api/trimet/interfaces/types";
import NearbySkeletonList from "../common/skeletons/NearbySkeleton";
import NearbySubNav from "../common/navigation/NearbySubNav";
import { NearbyLocationList } from "../common/stops/NearbyLocationList";
// @ts-ignore
import "../common/styles/NearbyViewComponent.scss";
import { SearchRadiusSelection } from "../common/search/SearchRadiusSelection";

export interface NearbyStopsProps {
  nearbyStops: StopData;
  radiusSize: number;
  handleRadiusSelectionChange: (e: any) => void;
  handleRefresh?: () => void;
  handleFindNearMe?: () => void;
  stopCount: number;
  routeCount: number;
  currentLocation: number[];
  highlightStopMarker?: (stopId: string | null) => void;
}

/**
 * Component that displays nearby transit stops and allows filtering by stops or routes.
 * Provides a multi-select filter to show only selected stops or route-direction combinations.
 * 
 * @param nearbyStops - The stop data containing locations, routes, and directions
 * @param radiusSize - The current search radius size in meters
 * @param handleRadiusSelectionChange - Callback when the radius selection changes
 * @param handleRefresh - Optional callback to refresh the nearby stops data
 * @param handleFindNearMe - Optional callback to find stops near the user's location
 * @param routeCount - Total count of unique routes in the nearby stops
 * @param stopCount - Total count of stops in the nearby area
 * @param currentLocation - User's current location as [latitude, longitude]
 * @param highlightStopMarker - Optional callback to highlight a stop marker on the map
 * @returns A filterable list of nearby transit stops with route information
 */
export default function NearbyStops({
  nearbyStops,
  radiusSize,
  handleRadiusSelectionChange,
  handleRefresh,
  handleFindNearMe,
  routeCount,
  stopCount,
  currentLocation,
  highlightStopMarker
}: NearbyStopsProps) {
  const isLoading = !nearbyStops;

  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const routeDirectionOptions: { label: string; value: string }[] = [];
  const stopOptions: { label: string; value: string }[] = [];
  if (!isLoading) {
    const seenRouteDirections: Set<string> = new Set();
    const seenStops: Set<number> = new Set();
    nearbyStops.location.forEach(loc => {
      if (!seenStops.has(loc.locid)) {
        seenStops.add(loc.locid);
        stopOptions.push({
          label: `Stop ${loc.locid} – ${loc.desc}`,
          value: `stop:${loc.locid}`
        });
      }
      (loc.route || []).forEach(r => {
        r.dir.forEach(d => {
          const composite = `${r.route}-${d.dir}`;
          if (!seenRouteDirections.has(composite)) {
            seenRouteDirections.add(composite);
            routeDirectionOptions.push({
              label: `Route ${r.route} – ${r.desc} – ${d.desc}`,
              value: `route:${composite}`
            });
          }
        });
      });
    });
  }

  const groupedOptions = [
    { label: "Stops", options: stopOptions },
    { label: "Routes", options: routeDirectionOptions }
  ];

  const handleFilterChange = (selected: any) => {
    const values = selected.map((o: any) => o.value);
    setSelectedValues(values);
  };

  const selectedStops = new Set<number>();
  const selectedRouteDirections = new Set<string>();
  selectedValues.forEach(v => {
    if (v.startsWith("stop:")) {
      const id = Number(v.split(":")[1]);
      selectedStops.add(id);
    } else if (v.startsWith("route:")) {
      selectedRouteDirections.add(v.replace("route:", ""));
    }
  });
  const hasStopFiltering = selectedStops.size > 0;
  const hasRouteFiltering = selectedRouteDirections.size > 0;

  return (
    <div className="stops-wrapper scrollarea">
      <SearchRadiusSelection
        radiusSize={radiusSize}
        handleRadiusSelectionChange={handleRadiusSelectionChange}
        handleRefresh={handleRefresh}
        handleFindNearMe={handleFindNearMe}
      />
      <br />
      <NearbySubNav routeCount={routeCount} stopCount={stopCount} />
      <br />
      <Select
        isMulti
        options={groupedOptions}
        onChange={handleFilterChange}
        placeholder="Filter stops or routes..."
        classNamePrefix="nearby-route-filter"
        className="nearby-filter-container"
        value={groupedOptions
          .map(g => g.options)
          .flat()
          .filter(o => selectedValues.includes(o.value))}
      />
      {isLoading ? (
        <NearbySkeletonList />
      ) : (
        <ul className="list-unstyled">
          <NearbyLocationList
            stopLocations={nearbyStops}
            currentLocation={currentLocation}
            selectedStops={selectedStops}
            routeDirectionFilter={selectedRouteDirections}
            hasStopFiltering={hasStopFiltering}
            hasRouteFiltering={hasRouteFiltering}
            highlightStopMarker={highlightStopMarker}
          />
        </ul>
      )}
    </div>
  );
}

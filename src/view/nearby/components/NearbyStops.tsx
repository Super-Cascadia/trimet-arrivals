import { map } from "lodash";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Card, ListGroup } from "react-bootstrap";
import {
  StopData,
  StopLocation,
  TrimetRoute
} from "../../../api/trimet/interfaces/types";
import RouteIndicator from "../../../component/route/RouteIndicator";
import StopLocationIndicator from "../../../component/stop/StopLocationIndicator";
import NearbySkeletonList from "./common/NearbySkeleton";
import { getNormalizedDistanceString } from "../util/turfUtils";
import NearbySubNav from "./common/NearbySubNav";
import "./NearbyViewComponent.scss";
import { SearchRadiusSelection } from "./SearchRadiusSelection";

function getDirectionArrow(currentLocation: number[], stopLocation: StopLocation): string {
  if (!currentLocation || !stopLocation) return "";
  
  // Calculate bearing from current location to stop
  const lat1 = currentLocation[1] * Math.PI / 180;
  const lat2 = stopLocation.lat * Math.PI / 180;
  const dLon = (stopLocation.lng - currentLocation[0]) * Math.PI / 180;
  
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  const bearing = Math.atan2(y, x) * 180 / Math.PI;
  
  // Normalize to 0-360
  const normalizedBearing = (bearing + 360) % 360;
  
  // Convert to 8-direction arrow (N, NE, E, SE, S, SW, W, NW)
  const directions = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'];
  const index = Math.round(normalizedBearing / 45) % 8;
  
  return directions[index];
}

function getRouteDirections(
  route: TrimetRoute,
  routeDirectionFilter: Set<string>,
  activeRouteDirectionFiltering: boolean
) {
  return route.dir
    .filter(d =>
      activeRouteDirectionFiltering
        ? routeDirectionFilter.has(`${route.route}-${d.dir}`)
        : true
    )
    .map(direction => (
      <ListGroup.Item
        key={`${route.route}-${direction.dir}`}
        action={true}
        variant="light"
      >
        <RouteIndicator routeId={route.route} /> {direction.desc}
      </ListGroup.Item>
    ));
}

function getLocationInfo(
  stopLocations: StopData,
  currentLocation: number[],
  selectedStops: Set<number>,
  routeDirectionFilter: Set<string>,
  hasStopFiltering: boolean,
  hasRouteFiltering: boolean
) {
  return map(stopLocations.location, (stopLocation: StopLocation, key: number) => {
    const isStopMatch = selectedStops.has(stopLocation.locid);
    const distanceDescription = getNormalizedDistanceString(currentLocation, [
      stopLocation.lng,
      stopLocation.lat
    ]);
    const directionArrow = getDirectionArrow(currentLocation, stopLocation);
    const routeDirectionItems = stopLocation.route
      .map(r =>
        getRouteDirections(r, routeDirectionFilter, hasRouteFiltering)
      )
      .flat();
    if (hasStopFiltering && hasRouteFiltering) {
      if (!isStopMatch && routeDirectionItems.length === 0) {
        return null;
      }
    } else if (hasStopFiltering) {
      if (!isStopMatch) {
        return null;
      }
    } else if (hasRouteFiltering) {
      if (routeDirectionItems.length === 0) {
        return null;
      }
    }
    return (
      <>
        <Card key={key}>
          <Card.Header as="h6">
            <StopLocationIndicator
              locationId={stopLocation.locid}
              nearbyStops={true}
            />
            {stopLocation.desc}
            {stopLocation.dir && (
              <span className="text-muted" style={{ marginLeft: '8px', fontSize: '0.9em' }}>
                ({stopLocation.dir})
              </span>
            )}
          </Card.Header>
          <ListGroup variant="flush">{routeDirectionItems}</ListGroup>
          <Card.Footer className="text-muted">
            {directionArrow && <span style={{ marginRight: '6px', fontSize: '1.1em' }}>{directionArrow}</span>}
            {distanceDescription}
          </Card.Footer>
        </Card>
        <br />
      </>
    );
  });
}

export interface NearbyStopsProps {
  nearbyStops: StopData;
  radiusSize: number;
  handleRadiusSelectionChange: (e: any) => void;
  handleRefresh?: () => void;
  handleFindNearMe?: () => void;
  stopCount: number;
  routeCount: number;
  currentLocation: number[];
}

export default function NearbyStops({
  nearbyStops,
  radiusSize,
  handleRadiusSelectionChange,
  handleRefresh,
  handleFindNearMe,
  routeCount,
  stopCount,
  currentLocation
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
        value={groupedOptions
          .map(g => g.options)
          .flat()
          .filter(o => selectedValues.includes(o.value))}
      />
      <br />
      {isLoading ? (
        <NearbySkeletonList cards={4} rowsPerCard={3} />
      ) : (
        getLocationInfo(
          nearbyStops,
          currentLocation,
          selectedStops,
          selectedRouteDirections,
          hasStopFiltering,
          hasRouteFiltering
        )
      )}
    </div>
  );
}

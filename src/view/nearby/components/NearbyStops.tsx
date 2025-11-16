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
import Loading from "../../loading/Loading";
import { getNormalizedDistanceString } from "../util/turfUtils";
import NearbySubNav from "./common/NearbySubNav";
import "./NearbyViewComponent.scss";
import { SearchRadiusSelection } from "./SearchRadiusSelection";

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
          </Card.Header>
          <ListGroup variant="flush">{routeDirectionItems}</ListGroup>
          <Card.Footer className="text-muted">{distanceDescription}</Card.Footer>
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
  stopCount: number;
  routeCount: number;
  currentLocation: number[];
}

export default function NearbyStops({
  nearbyStops,
  radiusSize,
  handleRadiusSelectionChange,
  routeCount,
  stopCount,
  currentLocation
}: NearbyStopsProps) {
  if (!nearbyStops) {
    return <Loading />;
  }

  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const routeDirectionOptions: { label: string; value: string }[] = [];
  const stopOptions: { label: string; value: string }[] = [];
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
      {getLocationInfo(
        nearbyStops,
        currentLocation,
        selectedStops,
        selectedRouteDirections,
        hasStopFiltering,
        hasRouteFiltering
      )}
    </div>
  );
}

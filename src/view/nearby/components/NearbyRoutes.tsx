import { Dictionary, map } from "lodash";
import React, { useState } from "react";
import Select from "react-select";
import { Card, ListGroup } from "react-bootstrap";
import { TrimetRoute } from "../../../api/trimet/interfaces/types";
import RouteIndicator from "../../../component/route/RouteIndicator";
import NearbySubNav from "./common/NearbySubNav";
import "./NearbyRoutes.scss";
import { SearchRadiusSelection } from "./SearchRadiusSelection";

function getRouteDirections(
  route: TrimetRoute,
  selectedDirections: Set<string>,
  hasDirectionFiltering: boolean,
  routeSelected: boolean
) {
  return route.dir
    .filter(d => (hasDirectionFiltering && !routeSelected ? selectedDirections.has(`${route.route}-${d.dir}`) : true))
    .map(direction => (
      <ListGroup.Item key={`${route.route}-${direction.dir}`}>
        <RouteIndicator routeId={route.route} /> {direction.desc}
      </ListGroup.Item>
    ));
}

function getRoutes(
  routes: Dictionary<TrimetRoute[]>,
  selectedRoutes: Set<number>,
  selectedDirections: Set<string>,
  hasRouteFiltering: boolean,
  hasDirectionFiltering: boolean
) {
  return map(routes, (routeGroup: TrimetRoute[], key) => {
    const routeId = routeGroup[0].route;
    const routeSelected = selectedRoutes.has(routeId);
    // Visibility rules
    let visible = true;
    if (hasRouteFiltering && hasDirectionFiltering) {
      const anyDirectionMatch = routeGroup.some(r =>
        r.dir.some(d => selectedDirections.has(`${r.route}-${d.dir}`))
      );
      visible = routeSelected || anyDirectionMatch;
    } else if (hasRouteFiltering) {
      visible = routeSelected;
    } else if (hasDirectionFiltering) {
      const anyDirectionMatch = routeGroup.some(r =>
        r.dir.some(d => selectedDirections.has(`${r.route}-${d.dir}`))
      );
      visible = anyDirectionMatch;
    }
    if (!visible) {
      return null;
    }
    return (
      <>
        <Card key={key}>
          <Card.Header as="h5">{routeGroup[0].desc}</Card.Header>
          <ListGroup variant="flush">
            {routeGroup.map(r =>
              getRouteDirections(
                r,
                selectedDirections,
                hasDirectionFiltering,
                routeSelected
              )
            )}
          </ListGroup>
        </Card>
        <br />
      </>
    );
  });
}

export interface NearbyRoutesProps {
  nearbyRoutes: Dictionary<TrimetRoute[]>;
  radiusSize: number;
  handleRadiusSelectionChange: (e: any) => void;
  routeCount: number;
  stopCount: number;
}

export default function NearbyRoutes({
  nearbyRoutes,
  radiusSize,
  handleRadiusSelectionChange,
  routeCount,
  stopCount
}: NearbyRoutesProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  // Build options
  const routeOptions: { label: string; value: string }[] = [];
  const directionOptions: { label: string; value: string }[] = [];
  const seenRoutes: Set<number> = new Set();
  const seenDirections: Set<string> = new Set();
  map(nearbyRoutes, (routeGroup: TrimetRoute[]) => {
    const route = routeGroup[0];
    if (!seenRoutes.has(route.route)) {
      seenRoutes.add(route.route);
      routeOptions.push({
        label: `Route ${route.route} – ${route.desc}`,
        value: `route:${route.route}`
      });
    }
    routeGroup.forEach(r => {
      r.dir.forEach(d => {
        const composite = `${r.route}-${d.dir}`;
        if (!seenDirections.has(composite)) {
          seenDirections.add(composite);
          directionOptions.push({
            label: `Dir ${d.dir} – ${r.desc} – ${d.desc}`,
            value: `dir:${composite}`
          });
        }
      });
    });
  });

  const groupedOptions = [
    { label: "Routes", options: routeOptions },
    { label: "Directions", options: directionOptions }
  ];

  const handleFilterChange = (selected: any) => {
    const values = selected.map((o: any) => o.value);
    setSelectedValues(values);
  };

  const selectedRoutes = new Set<number>();
  const selectedDirections = new Set<string>();
  selectedValues.forEach(v => {
    if (v.startsWith("route:")) {
      selectedRoutes.add(Number(v.split(":")[1]));
    } else if (v.startsWith("dir:")) {
      selectedDirections.add(v.replace("dir:", ""));
    }
  });
  const hasRouteFiltering = selectedRoutes.size > 0;
  const hasDirectionFiltering = selectedDirections.size > 0;

  return (
    <div id="nearby-view-routes" className="scrollarea">
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
        placeholder="Filter routes or directions..."
        classNamePrefix="nearby-route-filter"
        value={groupedOptions
          .map(g => g.options)
          .flat()
          .filter(o => selectedValues.includes(o.value))}
      />
      <br />
      {getRoutes(
        nearbyRoutes,
        selectedRoutes,
        selectedDirections,
        hasRouteFiltering,
        hasDirectionFiltering
      )}
    </div>
  );
}

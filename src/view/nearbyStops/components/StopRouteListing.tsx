import { map, split } from "lodash";
import React from "react";
import { Card } from "react-bootstrap";
import { TrimetRoute } from "../../../api/trimet/interfaces/types";
import RouteIndicator from "../../../component/route/RouteIndicator";
import "./StopRouteListing.scss";

interface Props {
  routes: TrimetRoute[];
  onClick: (route: TrimetRoute) => void;
}

export default function StopRouteListing({ routes, onClick }: Props) {
  return (
    <div className="route-cards-container">
      {map(routes, (route: TrimetRoute) => {
        const description = split(route.desc, "-")[1];

        return (
          <Card key={route.route} className="route-card">
            <Card.Body>
              <div className="route-card-content">
                <RouteIndicator routeId={route.route} route={route} />
                <span className="route-description">
                  <span>{description}</span>
                  <span className="route-description-divider">-</span>
                  <span>{route.dir[0].desc}</span>
                </span>
              </div>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
}

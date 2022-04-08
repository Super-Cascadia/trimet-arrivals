import React from "react";
import { Nav } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { LinkContainer } from "react-router-bootstrap";
import { useRouteMatch } from "react-router-dom";
import RouteIndicator from "../../../component/route/RouteIndicator";

interface Props {
  routes: number[];
  locationId: number;
}

function StopLocationArrivalsTableNav({ routes, locationId }: Props) {
  const { url } = useRouteMatch();

  return (
    <Nav fill={true} variant="tabs">
      <Nav.Item>
        <LinkContainer to={url}>
          <a className="nav-link">
            <FontAwesome className="route" name="route" />
            All
          </a>
        </LinkContainer>
      </Nav.Item>
      {routes.map(route => {
        return (
          <Nav.Item key={route}>
            <LinkContainer to={`${url}/route/${route}`}>
              <a className="nav-link">
                <RouteIndicator routeId={route} />
              </a>
            </LinkContainer>
          </Nav.Item>
        );
      })}
    </Nav>
  );
}

export default StopLocationArrivalsTableNav;

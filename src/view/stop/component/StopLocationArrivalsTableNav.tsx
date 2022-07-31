import React from "react";
import { Nav } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { LinkContainer } from "react-router-bootstrap";
import RouteIndicator from "../../../component/route/RouteIndicator";

interface Props {
  routes: number[];
  locationId: number;
}

function StopLocationArrivalsTableNav({ routes }: Props) {
  return (
    <Nav fill={true} variant="tabs">
      <Nav.Item>
        <LinkContainer to="/">
          <a className="nav-link">
            <FontAwesome className="route" name="route" />
            All
          </a>
        </LinkContainer>
      </Nav.Item>
      {routes.map(route => {
        return (
          <Nav.Item key={route}>
            <LinkContainer to={`/route/${route}`}>
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

import React from "react";
import { Nav } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { LinkContainer } from "react-router-bootstrap";
import { useRouteMatch } from "react-router-dom";
import "./NearbySubNav.scss";

interface Props {
  stopCount: number;
  routeCount: number;
}

export default function NearbySubNav({ stopCount, routeCount }: Props) {
  const { url } = useRouteMatch();

  return (
    <Nav fill={true} variant="tabs">
      <Nav.Item>
        <LinkContainer to={`/nearby/stops`}>
          <a className="nav-link">
            <FontAwesome className="route" name="route" />
            Stops ({stopCount})
          </a>
        </LinkContainer>
      </Nav.Item>
      <Nav.Item>
        <LinkContainer to={`/nearby/routes`}>
          <a className="nav-link">
            <FontAwesome className="route" name="route" />
            Routes ({routeCount})
          </a>
        </LinkContainer>
      </Nav.Item>
    </Nav>
  );
}

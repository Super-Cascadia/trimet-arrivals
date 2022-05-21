import { isNumber } from "lodash";
import React from "react";
import { Breadcrumb, Container, Nav } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { LinkContainer } from "react-router-bootstrap";
import { useLocation } from "react-router-dom";

function ServiceNavigation() {
  const location = useLocation();

  const [a, b, routeId] = location.pathname.split("/");
  const value = routeId ? parseInt(routeId, 10) : null;
  const isRoute = value && isNumber(value);

  if (isRoute) {
    return (
      <Container fluid={true}>
        <Breadcrumb>
          <LinkContainer to="/lines">
            <Breadcrumb.Item>Lines</Breadcrumb.Item>
          </LinkContainer>
          <LinkContainer to="/lines/max">
            <Breadcrumb.Item>Max</Breadcrumb.Item>
          </LinkContainer>
          <Breadcrumb.Item active={true}>{routeId}</Breadcrumb.Item>
        </Breadcrumb>
      </Container>
    );
  }

  return (
    <Container fluid={true}>
      <Nav fill={true} variant="tabs">
        <Nav.Item>
          <LinkContainer to="/lines">
            <a className="nav-link">
              <FontAwesome className="route" name="route" />
              All
            </a>
          </LinkContainer>
        </Nav.Item>
        <Nav.Item>
          <LinkContainer to="/lines/max">
            <a className="nav-link">
              <FontAwesome className="train" name="train" />
              Max
            </a>
          </LinkContainer>
        </Nav.Item>
        <Nav.Item>
          <LinkContainer to="/lines/streetcar">
            <a className="nav-link">
              <FontAwesome className="train" name="train" />
              Streetcar
            </a>
          </LinkContainer>
        </Nav.Item>
        <Nav.Item>
          <LinkContainer to="/lines/bus">
            <a className="nav-link">
              <FontAwesome className="bus" name="bus" />
              Bus
            </a>
          </LinkContainer>
        </Nav.Item>
        <Nav.Item>
          <LinkContainer to="/lines/wes">
            <a className="nav-link">
              <FontAwesome className="subway" name="subway" />
              WES
            </a>
          </LinkContainer>
        </Nav.Item>
      </Nav>
      <br />
    </Container>
  );
}

export default ServiceNavigation;

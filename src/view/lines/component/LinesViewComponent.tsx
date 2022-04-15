import React from "react";
import { Container, Nav } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { LinkContainer } from "react-router-bootstrap";
import { LinesViewSubRoutes } from "../../../routes/LinesSubRoutes";
import "./LinesViewComponent.scss";

export default class LinesViewComponent extends React.Component {
  private static getRouteNav() {
    return (
      <Container>
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
      </Container>
    );
  }

  public render() {
    return (
      <div id="lines-view">
        <br />
        {LinesViewComponent.getRouteNav()}
        <br />
        <LinesViewSubRoutes />
      </div>
    );
  }
}

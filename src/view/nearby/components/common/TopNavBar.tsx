import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./TopNavBar.scss";

interface TopNavBarParams {
  id: string;
  shortSign?: string;
  handleRefresh?: () => void;
}

export function TopNavBar({ id, shortSign, handleRefresh }: TopNavBarParams) {
  const title = shortSign ? `${id} to ${shortSign}` : id;
  return (
    <Navbar bg="secondary" variant="dark">
      <Container>
        <Nav>
          <h3>{title}</h3>
        </Nav>
        <Nav>
          {handleRefresh && (
            <a className="nav-link refresh-link" onClick={handleRefresh}>
              Refresh
            </a>
          )}
          <LinkContainer to="/nearby/simple-routes">
            <a className="nav-link">Back</a>
          </LinkContainer>
        </Nav>
      </Container>
    </Navbar>
  );
}

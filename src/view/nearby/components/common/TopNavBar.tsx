import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

interface TopNavBarParams {
  id: string;
  shortSign?: string;
}

export function TopNavBar({ id, shortSign }: TopNavBarParams) {
  const title = shortSign ? `${id} to ${shortSign}` : id;
  return (
    <Navbar bg="secondary" variant="dark">
      <Container>
        <Nav>
          <h3>{title}</h3>
        </Nav>
        <Nav>
          <LinkContainer to="/nearby/simple-routes">
            <a className="nav-link">Back</a>
          </LinkContainer>
        </Nav>
      </Container>
    </Navbar>
  );
}

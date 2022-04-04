import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

interface TopNavBarParams {
  id: string;
}

export function TopNavBar({ id }: TopNavBarParams) {
  return (
    <Navbar bg="secondary" variant="dark">
      <Container>
        <Nav as="h2">{id}</Nav>
        <Nav>
          <LinkContainer to="/nearby/simple-routes">
            <a className="nav-link">Back</a>
          </LinkContainer>
        </Nav>
      </Container>
    </Navbar>
  );
}

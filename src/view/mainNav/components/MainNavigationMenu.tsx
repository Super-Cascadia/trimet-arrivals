import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./MainNavigationMenu.scss";

function bookmarkCount(numberOfBookmarks: number) {
  return <>{numberOfBookmarks > 0 && <span>({numberOfBookmarks})</span>}</>;
}

interface Props {
  numberOfBookmarks: number;
  timeOfLastLoad: string;
}

export default function MainNavigationMenu({
  numberOfBookmarks = 0,
  timeOfLastLoad
}: Props) {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#home">Trimet Arrivals</Navbar.Brand>
        <Nav className="me-auto">
          <LinkContainer to="/">
            <a className="nav-link">Home</a>
          </LinkContainer>
          <LinkContainer to="/nearby/stops">
            <a className="nav-link">Nearby</a>
          </LinkContainer>
          <LinkContainer to="/lines">
            <a className="nav-link">Lines</a>
          </LinkContainer>
          <LinkContainer to="/bookmarks">
            <a className="nav-link">Bookmarks</a>
          </LinkContainer>
        </Nav>
      </Container>
    </Navbar>
  );
}

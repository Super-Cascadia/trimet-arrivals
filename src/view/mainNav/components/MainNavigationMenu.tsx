import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
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
    <Navbar bg="dark" variant="dark" sticky="top">
      <Container fluid={true}>
        <Navbar.Brand href="#home">Go By Transit</Navbar.Brand>
        <Nav className="me-auto">
          <LinkContainer to="/">
            <a className="nav-link">Home</a>
          </LinkContainer>
          <LinkContainer to="/lines/all">
            <a className="nav-link">Lines</a>
          </LinkContainer>
          <LinkContainer to="/bookmarks">
            <a className="nav-link">Bookmarks</a>
          </LinkContainer>
        </Nav>
        <Nav>
          <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">
              Another action
            </NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">
              Separated link
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}

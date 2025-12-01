import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import CurrentTime from "../../../component/buttons/CurrentTime";
import { ThemeToggle } from "../../../component/buttons/ThemeToggle";
import TimeSettingsDropdown from "../../../component/buttons/TimeSettingsDropdown";
import "./MainNavigationMenu.scss";
import trimetLogo from "../../../assets/images/trimet-logo-70s.png";

function bookmarkCount(numberOfBookmarks: number) {
  return <>{numberOfBookmarks > 0 && <span>({numberOfBookmarks})</span>}</>;
}

const TRANSIT_EMOJIS = [
  '🚋', '🚎', '🚈', '🚝',
  <img src={trimetLogo} alt="TriMet Logo" style={{ height: '24px', width: 'auto' }} />
];

interface Props {
  numberOfBookmarks: number;
  timeOfLastLoad: string;
}

export default function MainNavigationMenu({
  numberOfBookmarks = 0,
  timeOfLastLoad
}: Props) {
  const [emojiIndex, setEmojiIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setEmojiIndex((prevIndex) => (prevIndex + 1) % TRANSIT_EMOJIS.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Navbar className="bg-body-tertiary" sticky="top">
      <Container fluid={true}>
        <Navbar.Brand href="#home">
          <span style={{ marginLeft: '8px' }}>{TRANSIT_EMOJIS[emojiIndex]} Go By Transit</span>
        </Navbar.Brand>
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
          <ThemeToggle />
          <NavDropdown title="Settings" id="collasible-nav-dropdown" align="end">
            <TimeSettingsDropdown />
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">
              Other Settings
            </NavDropdown.Item>
          </NavDropdown>
          <CurrentTime />
        </Nav>
      </Container>
    </Navbar>
  );
}

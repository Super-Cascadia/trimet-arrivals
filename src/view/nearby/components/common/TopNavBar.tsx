import React, { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import FontAwesome from "react-fontawesome";
import "./TopNavBar.scss";

interface TopNavBarParams {
  id: string;
  shortSign?: string;
  handleRefresh?: () => void;
}

export function TopNavBar({ id, shortSign, handleRefresh }: TopNavBarParams) {
  const title = shortSign ? `${id} to ${shortSign}` : id;
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const onRefreshClick = async () => {
    if (!handleRefresh || isRefreshing) return;
    setIsRefreshing(true);
    await handleRefresh();
    setIsRefreshing(false);
  };
  
  return (
    <Navbar bg="secondary" variant="dark">
      <Container>
        <Nav>
          <h3>{title}</h3>
        </Nav>
        <Nav>
          {handleRefresh && (
            <a 
              className={`nav-link refresh-link ${isRefreshing ? 'disabled' : ''}`} 
              onClick={onRefreshClick}
              style={{ cursor: isRefreshing ? 'not-allowed' : 'pointer' }}
            >
              <FontAwesome name="refresh" spin={isRefreshing} />
            </a>
          )}
          <LinkContainer to="/nearby/simple-routes">
            <a className="nav-link">
              <FontAwesome name="times" />
            </a>
          </LinkContainer>
        </Nav>
      </Container>
    </Navbar>
  );
}

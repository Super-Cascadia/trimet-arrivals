import React from "react";
import FontAwesome from "react-fontawesome";
import { NavLink } from "react-router-dom";
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
    <nav className="top-navigation view-header">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/nearby/routes">
        <FontAwesome name="map-marker" className="bookmark-icon" />
        Nearby | {timeOfLastLoad}
      </NavLink>
      <NavLink to="/bookmarks">
        <FontAwesome name="bookmark" className="bookmark-icon" />
        Bookmarks {bookmarkCount(numberOfBookmarks)}
      </NavLink>
    </nav>
  );
}

import cx from "classnames";
import React from "react";
import FontAwesome from "react-fontawesome";
import { NavLink } from "react-router-dom";
import "./MainNavigation.scss";

function bookmarkCount(numberOfBookmarks: number) {
  return <>{numberOfBookmarks > 0 && <span>({numberOfBookmarks})</span>}</>;
}

interface Props {
  numberOfBookmarks?: number;
  timeOfLastLoad?: string;
}

export default function MainNavigation({
  numberOfBookmarks = 0,
  timeOfLastLoad
}: Props) {
  const nearbyStopsClass = cx({
    "nearby-stops": true,
    "view-header-menu-item": true
  });

  const bookmarksClass = cx({
    bookmarks: true,
    "view-header-menu-item": true
  });

  return (
    <nav className="top-navigation">
      <ul className="view-header">
        <NavLink to="/" className="view-header-menu-item">
          <FontAwesome name="home" className="bookmark-icon" />
          <span>Home</span>
        </NavLink>
        <NavLink className={nearbyStopsClass} to="/nearby/routes">
          <FontAwesome name="map-marker" className="bookmark-icon" />
          <span>Nearby | {timeOfLastLoad}</span>
        </NavLink>
        <NavLink className={bookmarksClass} to="/bookmarks">
          <FontAwesome name="bookmark" className="bookmark-icon" />
          <span>Bookmarks {bookmarkCount(numberOfBookmarks)}</span>
        </NavLink>
      </ul>
    </nav>
  );
}

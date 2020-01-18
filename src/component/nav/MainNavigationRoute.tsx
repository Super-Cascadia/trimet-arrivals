import cx from "classnames";
import React from "react";
import FontAwesome from "react-fontawesome";
import { Link } from "react-router-dom";
import {
  BOOKMARKS_VIEW,
  NEARBY_STOPS_VIEW
} from "../../store/reducers/viewReducer";
import "./MainNavigation.css";

function bookmarkCount(numberOfBookmarks: number) {
  return <>{numberOfBookmarks > 0 && <span>({numberOfBookmarks})</span>}</>;
}

interface Props {
  activeView: string;
  numberOfBookmarks: number;
  timeOfLastLoad: string;
}

export default function MainNavigationRoute({
  activeView = NEARBY_STOPS_VIEW,
  numberOfBookmarks = 0,
  timeOfLastLoad
}: Props) {
  const nearbyStopsClass = cx({
    active: activeView === NEARBY_STOPS_VIEW,
    "nearby-stops": true,
    "view-header-menu-item": true
  });

  const bookmarksClass = cx({
    active: activeView === BOOKMARKS_VIEW,
    bookmarks: true,
    "view-header-menu-item": true
  });

  return (
    <nav className="top-navigation">
      <ul className="view-header">
        <li className="view-header-menu-item">
          <Link to="/">Home</Link>
        </li>
        <li className={nearbyStopsClass}>
          <Link to="/nearby/routes">
            <FontAwesome name="map-marker" className="bookmark-icon" />
            Nearby | {timeOfLastLoad}
          </Link>
        </li>
        <li className={bookmarksClass}>
          <Link to="/bookmarks">
            <FontAwesome name="bookmark" className="bookmark-icon" />
            Bookmarks {bookmarkCount(numberOfBookmarks)}
          </Link>
        </li>
      </ul>
    </nav>
  );
}

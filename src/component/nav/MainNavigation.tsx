import cx from "classnames";
import React from "react";
import FontAwesome from "react-fontawesome";
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
  updateView: (activeView: string) => void;
  numberOfBookmarks: number;
  timeOfLastLoad: string;
}

const noop = () => {
  return;
};

export default function MainNavigation({
  activeView = NEARBY_STOPS_VIEW,
  numberOfBookmarks = 0,
  updateView = noop,
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
        <li
          className={nearbyStopsClass}
          onClick={updateView.bind(this, NEARBY_STOPS_VIEW)}
        >
          <a>Nearby Stops | {timeOfLastLoad}</a>
        </li>
        <li
          className={bookmarksClass}
          onClick={updateView.bind(this, BOOKMARKS_VIEW)}
        >
          <a>
            <FontAwesome name="bookmark" className="bookmark-icon" />
            Bookmarks {bookmarkCount(numberOfBookmarks)}
          </a>
        </li>
      </ul>
    </nav>
  );
}
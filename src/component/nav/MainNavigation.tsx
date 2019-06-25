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

export default function MainNavigation({
  activeView = NEARBY_STOPS_VIEW,
  numberOfBookmarks = 0,
  updateView,
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

  const updateToBookmarksView =
    updateView && updateView.bind(this, BOOKMARKS_VIEW);
  const updateToNearbyStopsView =
    updateView && updateView.bind(this, NEARBY_STOPS_VIEW);

  return (
    <nav className="top-navigation">
      <ul className="view-header">
        <li className={nearbyStopsClass} onClick={updateToNearbyStopsView}>
          <FontAwesome name="map-marker" className="bookmark-icon" />
          <a>Nearby | {timeOfLastLoad}</a>
        </li>
        <li className={bookmarksClass} onClick={updateToBookmarksView}>
          <a>
            <FontAwesome name="bookmark" className="bookmark-icon" />
            Bookmarks {bookmarkCount(numberOfBookmarks)}
          </a>
        </li>
      </ul>
    </nav>
  );
}

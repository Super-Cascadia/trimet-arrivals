import cx from "classnames";
import React from "react";
import {
  BOOKMARKS_VIEW,
  NEARBY_STOPS_VIEW
} from "../store/reducers/viewReducer";
import BookmarksContainer from "./bookmarks/container/BookmarksContainer";
import "./Header.css";
import StopsContainer from "./stops/containers/StopsContainer";

interface Props {
  activeView: string;
  updateView: (activeView: string) => void;
}

export default class ViewComponent extends React.Component<Props> {
  public getView() {
    switch (this.props.activeView) {
      case NEARBY_STOPS_VIEW:
        return <StopsContainer />;
      case BOOKMARKS_VIEW:
        return <BookmarksContainer />;
      default:
        return <StopsContainer />;
    }
  }

  public getHeader() {
    const { activeView } = this.props;

    const nearbyStopsClass = cx({
      active: activeView === NEARBY_STOPS_VIEW,
      "view-header-menu-item": true
    });

    const bookmarksClass = cx({
      active: activeView === BOOKMARKS_VIEW,
      "view-header-menu-item": true
    });

    return (
      <nav className="top-navigation">
        <ul className="view-header">
          <li
            className={nearbyStopsClass}
            onClick={this.props.updateView.bind(this, NEARBY_STOPS_VIEW)}
          >
            <a>Nearby Stops</a>
          </li>
          <li
            className={bookmarksClass}
            onClick={this.props.updateView.bind(this, BOOKMARKS_VIEW)}
          >
            <a>Bookmarks</a>
          </li>
        </ul>
      </nav>
    );
  }

  public render() {
    return (
      <div>
        {this.getHeader()}
        <main className="main-view">{this.getView()}</main>
      </div>
    );
  }
}

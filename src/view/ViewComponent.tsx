import React from "react";
import {
  BOOKMARKS_VIEW,
  NEARBY_STOPS_VIEW
} from "../store/reducers/viewReducer";
import BookmarksContainer from "./bookmarks/container/BookmarksContainer";
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
    return (
      <nav>
        <ul>
          <li>
            <a onClick={this.props.updateView.bind(this, NEARBY_STOPS_VIEW)}>
              Nearby Stops
            </a>
          </li>
          <li>
            <a onClick={this.props.updateView.bind(this, BOOKMARKS_VIEW)}>
              Bookmarks
            </a>
          </li>
        </ul>
      </nav>
    );
  }

  public render() {
    return (
      <div>
        {this.getHeader()}
        <main>{this.getView()}</main>
      </div>
    );
  }
}

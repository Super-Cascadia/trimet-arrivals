import React from "react";
import MainNavigation from "../component/nav/MainNavigation";
import {
  BOOKMARKS_VIEW,
  NEARBY_STOPS_VIEW
} from "../store/reducers/viewReducer";
import BookmarksViewContainer from "./bookmarks/container/BookmarksViewContainer";
import NearbyStopsViewContainer from "./stops/containers/NearbyStopsViewContainer";

interface Props {
  activeView: string;
  updateView: (activeView: string) => void;
  numberOfBookmarks: number;
}

export default class ViewComponent extends React.Component<Props> {
  public static getView(activeView: string) {
    switch (activeView) {
      case NEARBY_STOPS_VIEW:
        return <NearbyStopsViewContainer />;
      case BOOKMARKS_VIEW:
        return <BookmarksViewContainer />;
      default:
        return <NearbyStopsViewContainer />;
    }
  }

  public render() {
    const { activeView, updateView, numberOfBookmarks } = this.props;

    return (
      <div>
        <MainNavigation
          activeView={activeView}
          updateView={updateView}
          numberOfBookmarks={numberOfBookmarks}
        />
        <main className="main-view">{ViewComponent.getView(activeView)}</main>
      </div>
    );
  }
}

import { isEmpty, map } from "lodash";
import React from "react";
import { StopLocation } from "../../../api/trimet/types";
import StopContainer from "../../stops/containers/StopContainer";
import AddBookmarkSectionControl from "./AddBookmarkSectionControl";

interface Props {
  bookmarks: StopLocation[];
}

const noop = () => {
  return;
};

const notImplemented = () => alert("not implemented");

export default class BookmarksViewComponent extends React.Component<Props> {
  public getBookmarkedStops(bookmarks: StopLocation[]) {
    return map(bookmarks, (stopLocation: StopLocation) => {
      const locationId = stopLocation.locid;

      return (
        <StopContainer
          key={locationId}
          locationId={locationId}
          onRouteIndicatorClick={noop}
          showArrivals={true}
        />
      );
    });
  }

  public getBookmarksView(bookmarks: StopLocation[]) {
    return (
      <div>
        <AddBookmarkSectionControl onClick={notImplemented} />
        {this.getBookmarkedStops(bookmarks)}
      </div>
    );
  }

  public routeBookMarksView(bookmarks: StopLocation[]) {
    if (isEmpty(bookmarks)) {
      return (
        <div className="no-bookmarks-container">
          Bookmark a stop and see it here.
        </div>
      );
    }

    return this.getBookmarksView(bookmarks);
  }

  public render() {
    const { bookmarks } = this.props;

    return <section>{this.routeBookMarksView(bookmarks)}</section>;
  }
}

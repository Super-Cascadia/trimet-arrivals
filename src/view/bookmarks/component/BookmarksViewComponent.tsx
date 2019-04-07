import { isEmpty, map } from "lodash";
import React from "react";
import { StopLocation } from "../../../api/trimet/types";
import StopContainer from "../../stops/containers/StopContainer";

interface Props {
  bookmarks: StopLocation[];
}

const noop = () => {
  return;
};

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

  public routeBookMarksView(bookmarks: StopLocation[]) {
    if (isEmpty(bookmarks)) {
      return (
        <div className="no-bookmarks-container">
          Bookmark a stop and see it here.
        </div>
      );
    }

    return this.getBookmarkedStops(bookmarks);
  }

  public render() {
    const { bookmarks } = this.props;

    return <section>{this.routeBookMarksView(bookmarks)}</section>;
  }
}

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

export default class BookmarksComponent extends React.Component<Props> {
  private static getNoBookmarksMessage() {
    return <div>Bookmark a stop and see it here.</div>;
  }

  public routeBookMarksView() {
    const { bookmarks } = this.props;

    if (!isEmpty(bookmarks)) {
      return this.getBookmarkedStops(bookmarks);
    }

    return BookmarksComponent.getNoBookmarksMessage();
  }

  public render() {
    return <section>{this.routeBookMarksView()}</section>;
  }

  private getBookmarkedStops(bookmarks) {
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
}

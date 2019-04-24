import { isEmpty, map } from "lodash";
import React from "react";
import { StopLocation } from "../../../api/trimet/types";
import StopContainer from "../../stops/containers/StopContainer";
import BookmarkSectionsContainer from "../container/BookmarkSectionsContainer";
import "./BookmarksViewComponent.css";

interface Props {
  bookmarks: StopLocation[];
}

export default class BookmarksViewComponent extends React.Component<Props> {
  public static getBookmarkedStops(bookmarks: StopLocation[]) {
    if (isEmpty(bookmarks)) {
      return (
        <div className="no-bookmarks-container">
          Bookmark a stop and see it here.
        </div>
      );
    }

    return map(bookmarks, (stopLocation: StopLocation) => {
      const locationId = stopLocation.locid;

      return (
        <StopContainer
          key={locationId}
          locationId={locationId}
          showArrivals={false}
        />
      );
    });
  }

  public render() {
    const { bookmarks } = this.props;

    return (
      <section>
        <div>
          <BookmarkSectionsContainer />
          <h1>Uncategorized Bookmarks</h1>
          {BookmarksViewComponent.getBookmarkedStops(bookmarks)}
        </div>
      </section>
    );
  }
}

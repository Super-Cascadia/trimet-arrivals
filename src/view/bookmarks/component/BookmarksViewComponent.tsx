import { isEmpty, map } from "lodash";
import React from "react";
import { StopLocation } from "../../../api/trimet/types";
import MainNavigation from "../../../component/nav/MainNavigation";
import StopContainer from "../../stops/containers/StopContainer";
import BookmarkSectionsContainer from "../container/BookmarkSectionsContainer";
import "./BookmarksViewComponent.scss";

interface Props {
  bookmarks: StopLocation[];
  numberOfBookmarks: number;
  timeOfLastLoad: string;
  onInitialLoad: () => void;
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
        <div className="bookmark-stop-wrapper">
          <StopContainer
            key={locationId}
            locationId={locationId}
            showArrivals={false}
          />
        </div>
      );
    });
  }

  public componentDidMount() {
    this.props.onInitialLoad();
  }

  public render() {
    const { bookmarks, numberOfBookmarks, timeOfLastLoad } = this.props;

    return (
      <div>
        <MainNavigation
          numberOfBookmarks={numberOfBookmarks}
          timeOfLastLoad={timeOfLastLoad}
        />
        <main className="main-view">
          <section id="bookmarks-view-container">
            <div>
              <BookmarkSectionsContainer />
              <h1>Uncategorized Bookmarks</h1>
              {BookmarksViewComponent.getBookmarkedStops(bookmarks)}
            </div>
          </section>
        </main>
      </div>
    );
  }
}

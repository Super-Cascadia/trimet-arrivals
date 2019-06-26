import { isEmpty, map } from "lodash";
import React, { lazy, Suspense } from "react";
import { StopLocation } from "../../../api/trimet/types";
import ComponentLoadIndicator from "../../../component/loadIndicator/ComponentLoadIndicator";
import "./BookmarksViewComponent.scss";

const StopContainer = lazy(() =>
  import(
    /* webpackChunkName: "StopContainer" */ "../../stops/containers/StopContainer"
  )
);
const BookmarkSectionsContainer = lazy(() =>
  import(
    /* webpackChunkName: "BookmarkSectionsContainer" */ "../container/BookmarkSectionsContainer"
  )
);
const MainNavigation = lazy(() =>
  import(
    /* webpackChunkName: "MainNavigation" */ "../../../component/nav/MainNavigation"
  )
);

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
          <Suspense fallback={ComponentLoadIndicator()}>
            <StopContainer
              key={locationId}
              locationId={locationId}
              showArrivals={false}
            />
          </Suspense>
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
              <Suspense fallback={ComponentLoadIndicator()}>
                <BookmarkSectionsContainer />
              </Suspense>
              <h1>Uncategorized Bookmarks</h1>
              {BookmarksViewComponent.getBookmarkedStops(bookmarks)}
            </div>
          </section>
        </main>
      </div>
    );
  }
}

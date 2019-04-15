import { isEmpty, map } from "lodash";
import React from "react";
import { StopLocation } from "../../../api/trimet/types";
import { BookmarkSectionsProps } from "../../../store/reducers/bookmarksReducer";
import StopContainer from "../../stops/containers/StopContainer";
import AddBookmarkSectionControl from "./AddBookmarkSectionControl";
import BookmarkSections from "./BookmarkSections";
import "./BookmarksViewComponent.css";

interface Props {
  bookmarks: StopLocation[];
  onSectionNameUpdate: (name: string) => void;
  bookmarkSectionName: string;
  createBookmarkSection: () => void;
  bookmarkSections: BookmarkSectionsProps;
  removeBookmarkSection: (bookmarkSectionId: number) => void;
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

  public routeBookMarksView(
    bookmarks: StopLocation[],
    bookmarkSectionName: string,
    bookmarkSections: BookmarkSectionsProps
  ) {
    if (isEmpty(bookmarks)) {
      return (
        <div className="no-bookmarks-container">
          Bookmark a stop and see it here.
        </div>
      );
    }

    return (
      <div>
        <AddBookmarkSectionControl
          bookmarkSectionName={bookmarkSectionName}
          createBookmarkSection={this.props.createBookmarkSection}
          onSectionNameUpdate={this.props.onSectionNameUpdate}
        />
        <BookmarkSections
          bookmarkSections={bookmarkSections}
          removeBookmarkSection={this.props.removeBookmarkSection}
        />
        {this.getBookmarkedStops(bookmarks)}
      </div>
    );
  }

  public render() {
    const { bookmarks, bookmarkSectionName, bookmarkSections } = this.props;

    return (
      <section>
        {this.routeBookMarksView(
          bookmarks,
          bookmarkSectionName,
          bookmarkSections
        )}
      </section>
    );
  }
}

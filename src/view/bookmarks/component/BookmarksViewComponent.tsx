import { isEmpty, map } from "lodash";
import React from "react";
import { StopLocation } from "../../../api/trimet/types";
import {
  BookmarkSection,
  BookmarkSections
} from "../../../store/reducers/bookmarksReducer";
import StopContainer from "../../stops/containers/StopContainer";
import AddBookmarkSectionControl from "./AddBookmarkSectionControl";
import "./BookmarksViewComponent.css";

interface Props {
  bookmarks: StopLocation[];
  onSectionNameUpdate: (name: string) => void;
  bookmarkSectionName: string;
  createBookmarkSection: () => void;
  bookmarkSections: BookmarkSections;
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

  public getBookmarksView(
    bookmarks: StopLocation[],
    bookmarkSectionName: string,
    bookmarkSections: BookmarkSections
  ) {
    return (
      <div>
        <AddBookmarkSectionControl
          bookmarkSectionName={bookmarkSectionName}
          createBookmarkSection={this.props.createBookmarkSection}
          onSectionNameUpdate={this.props.onSectionNameUpdate}
        />
        {this.getBookmarkSections(bookmarkSections)}
        {this.getBookmarkedStops(bookmarks)}
      </div>
    );
  }

  public routeBookMarksView(
    bookmarks: StopLocation[],
    bookmarkSectionName: string,
    bookmarkSections: BookmarkSections
  ) {
    if (isEmpty(bookmarks)) {
      return (
        <div className="no-bookmarks-container">
          Bookmark a stop and see it here.
        </div>
      );
    }

    return this.getBookmarksView(
      bookmarks,
      bookmarkSectionName,
      bookmarkSections
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

  public getBookmarkSection(bookmarkSection: BookmarkSection, id: number) {
    return (
      <article className="bookmark-section">
        <h3>{bookmarkSection.name}</h3>
        <button onClick={this.props.removeBookmarkSection.bind(this, id)}>
          Remove Section
        </button>
      </article>
    );
  }

  private getBookmarkSections(bookmarkSections: BookmarkSections) {
    if (isEmpty(bookmarkSections)) {
      return (
        <div className="bookmark-section-message">
          Add a bookmark section to begin organizing bookmarks.
        </div>
      );
    }

    return (
      <div>
        {map(
          bookmarkSections,
          (bookmarkSection: BookmarkSection, id: number) => {
            return this.getBookmarkSection(bookmarkSection, id);
          }
        )}
      </div>
    );
  }
}

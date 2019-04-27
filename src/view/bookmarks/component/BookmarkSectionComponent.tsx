import { isEmpty, map } from "lodash";
import React, { Component } from "react";
import StopContainer from "../../stops/containers/StopContainer";
import "./BookmarkSectionComponent.css";
import { BookmarkSectionNav } from "./BookmarkSectionNav";
import { RemoveBookmarkButton } from "./RemoveBookmarkButton";

interface Props {
  name: string;
  id: number;
  bookmarksInSection: number[];
  removeBookmarkSection: (bookmarkSectionId: number) => void;
  allBookmarks: number[];
  removeBookmarkFromSection: (
    bookmarkSectionId: number,
    stopId: number
  ) => void;
  addBookmarkToBookmarkSection: (
    bookmarkSectionId: number,
    stopId: number
  ) => void;
}

export default class BookmarkSection extends Component<Props> {
  public getBookmarksInSection(bookmarkedStops: number[], id: number) {
    if (isEmpty(bookmarkedStops)) {
      return (
        <p className="bookmark-section-add-more">
          Select bookmarks from the list above to see them here.
        </p>
      );
    }

    return map(bookmarkedStops, stopId => {
      return (
        <li key={stopId}>
          <div className="bookmark-flex-container">
            <div className="bookmark-stop-flex-item">
              <StopContainer
                showArrivals={false}
                locationId={stopId}
                onRouteIndicatorClick={undefined}
              />
            </div>
            <div className="bookmark-remove-flex-item">
              <RemoveBookmarkButton
                stopId={stopId}
                removeBookmarkFromSection={this.props.removeBookmarkFromSection.bind(
                  this,
                  id
                )}
              />
            </div>
          </div>
        </li>
      );
    });
  }

  public render() {
    const { name, bookmarksInSection, id, allBookmarks } = this.props;

    return (
      <article className="bookmark-section" key={id}>
        <BookmarkSectionNav
          bookmarksInSection={bookmarksInSection}
          name={name}
          onReactSelectBookmarkChange={this.onReactSelectBookmarkChange.bind(
            this,
            id
          )}
          removeBookmarkSection={this.removeBookmarkSection.bind(this, id)}
          allBookmarks={allBookmarks}
        />
        <ul className="bookmark-section-bookmarks">
          {this.getBookmarksInSection(bookmarksInSection, id)}
        </ul>
      </article>
    );
  }

  private removeBookmarkSection(id) {
    this.props.removeBookmarkSection(id);
  }

  private onReactSelectBookmarkChange(id, val, event) {
    const REMOVE_VALUE = "remove-value";
    const SELECT_OPTION = "select-option";
    const POP_VALUE = "pop-value";

    switch (event.action) {
      case REMOVE_VALUE:
      case POP_VALUE:
        this.props.removeBookmarkFromSection(id, event.removedValue.value);
        break;
      case SELECT_OPTION:
        this.props.addBookmarkToBookmarkSection(id, event.option.value);
        break;
    }
  }
}

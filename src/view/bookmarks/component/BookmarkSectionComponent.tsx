import { map } from "lodash";
import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import "./BookmarkSections.css";

interface Props {
  name: string;
  id: number;
  bookmarkedStops: number[];
  removeBookmarkSection: (bookmarkSectionId: number) => void;
}

export default class BookmarkSection extends Component<Props> {
  public static getBookmarksInSection(bookmarkedStops: number[]) {
    return map(bookmarkedStops, bookmarkedStopId => {
      return <li key={bookmarkedStopId}>{bookmarkedStopId}</li>;
    });
  }

  public shouldComponentUpdate() {
    return true;
  }

  public render() {
    const { name, removeBookmarkSection, bookmarkedStops, id } = this.props;

    return (
      <article className="bookmark-section" key={id}>
        <nav>
          <h3>{name}</h3>
          <div className="bookmark-section-remove-button">
            <button
              onClick={removeBookmarkSection.bind(this, id)}
              title="Remove Bookmark Section"
            >
              <FontAwesome name="times-circle" />
            </button>
          </div>
        </nav>
        <ul>{BookmarkSection.getBookmarksInSection(bookmarkedStops)}</ul>
      </article>
    );
  }
}

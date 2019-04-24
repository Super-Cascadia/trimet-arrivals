import { map } from "lodash";
import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import "./BookmarkSections.css";

interface Props {
  name: string;
  id: number;
  bookmarkedStops: number[];
  removeBookmarkSection: (bookmarkSectionId: number) => void;
  removeBookmarkFromSection: (
    bookmarkSectionId: number,
    stopId: number
  ) => void;
}

export default class BookmarkSection extends Component<Props> {
  public getBookmarksInSection(bookmarkedStops: number[], id: number) {
    return map(bookmarkedStops, stopId => {
      return (
        <li key={stopId}>
          <span>{stopId}</span>
          <button
            onClick={this.props.removeBookmarkFromSection.bind(
              this,
              id,
              stopId
            )}
          >
            <FontAwesome name="times-circle" />
          </button>
        </li>
      );
    });
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
        <ul>{this.getBookmarksInSection(bookmarkedStops, id)}</ul>
      </article>
    );
  }
}

import { map } from "lodash";
import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import StopContainer from "../../stops/containers/StopContainer";
import "./BookmarkSectionComponent.css";

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
    const RemoveBookmarkButton = ({ stopId }) => {
      const onClick = this.props.removeBookmarkFromSection.bind(
        this,
        id,
        stopId
      );

      return (
        <button
          onClick={onClick}
          className="close-button"
          title="Remove bookmark from Bookmark Section"
        >
          <FontAwesome name="times-circle" />
        </button>
      );
    };

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
              <RemoveBookmarkButton stopId={stopId} />
            </div>
          </div>
        </li>
      );
    });
  }

  public render() {
    const { name, removeBookmarkSection, bookmarkedStops, id } = this.props;

    const RemoveBookmarkSectionButton = () => {
      return (
        <div className="bookmark-section-remove-button ">
          <button
            className="close-button"
            onClick={removeBookmarkSection.bind(this, id)}
            title="Remove Bookmark Section"
          >
            <FontAwesome name="times-circle" />
          </button>
        </div>
      );
    };

    return (
      <article className="bookmark-section" key={id}>
        <nav>
          <h3>{name}</h3>
          <RemoveBookmarkSectionButton />
        </nav>
        <ul className="bookmark-section-bookmarks">
          {this.getBookmarksInSection(bookmarkedStops, id)}
        </ul>
      </article>
    );
  }
}

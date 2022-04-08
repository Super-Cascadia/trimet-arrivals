import { isEmpty, map } from "lodash";
import React, { Component } from "react";
import { Card } from "react-bootstrap";
import { StopLocation } from "../../../../api/trimet/interfaces/types";
import { RemoveBookmarkButton } from "../../../../component/buttons/RemoveBookmarkButton";
import StopContainer from "../../../nearbyStops/containers/StopContainer";
import "./BookmarkSectionComponent.css";
import { BookmarkSectionNav } from "./BookmarkSectionNav";

interface Props {
  name: string;
  id: number;
  bookmarksInSection: StopLocation[];
  removeBookmarkSection: (bookmarkSectionId: number) => void;
  allBookmarks: StopLocation[];
  removeBookmarkFromSection: (
    bookmarkSectionId: number,
    stopId: number
  ) => void;
  updateBookmarkSectionName: (
    bookmarkSectionId: number,
    bookmarkSectionName: string
  ) => void;
}

interface State {
  editMode: boolean;
}

export default class BookmarkSectionComponent extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false
    };

    this.toggleEditMode = this.toggleEditMode.bind(this);
  }

  public getBookmarksInSection(bookmarkedStops: StopLocation[], id: number) {
    if (isEmpty(bookmarkedStops)) {
      return (
        <p className="bookmark-section-add-more">
          Select bookmarks from the list above to see them here.
        </p>
      );
    }
    const { removeBookmarkFromSection } = this.props;
    const onRemoveBookmarkFromSection = removeBookmarkFromSection
      ? removeBookmarkFromSection.bind(this, id)
      : undefined;

    return map(bookmarkedStops, stopLocation => {
      return (
        <li key={stopLocation.locid}>
          <div className="bookmark-stop-wrapper">
            <div className="bookmark-flex-container">
              <div className="bookmark-stop-flex-item">
                <StopContainer
                  showArrivals={false}
                  locationId={stopLocation.locid}
                  onRouteIndicatorClick={undefined}
                />
              </div>
              {this.state.editMode && (
                <div className="bookmark-remove-flex-item">
                  <RemoveBookmarkButton
                    stopId={stopLocation.locid}
                    removeBookmarkFromSection={onRemoveBookmarkFromSection}
                  />
                </div>
              )}
            </div>
          </div>
        </li>
      );
    });
  }

  public render() {
    const {
      name,
      bookmarksInSection,
      id,
      updateBookmarkSectionName,
      removeBookmarkSection
    } = this.props;

    const onUpdateBookmarkSectionName = updateBookmarkSectionName
      ? updateBookmarkSectionName.bind(this, id)
      : undefined;
    const removeSection =
      removeBookmarkSection && removeBookmarkSection.bind(this, id);

    return (
      <Card key={id}>
        <BookmarkSectionNav
          name={name}
          toggleEditMode={this.toggleEditMode}
          editMode={this.state.editMode}
          removeBookmarkSection={removeSection}
          updateBookmarkSectionName={onUpdateBookmarkSectionName}
          bookmarkSectionId={id}
        />
        <ul className="bookmark-section-bookmarks">
          {this.getBookmarksInSection(bookmarksInSection, id)}
        </ul>
      </Card>
    );
  }

  public toggleEditMode() {
    this.setState({
      editMode: !this.state.editMode
    });
  }
}

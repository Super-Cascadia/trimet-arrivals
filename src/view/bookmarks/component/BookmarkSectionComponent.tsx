import { isEmpty, map } from "lodash";
import React, { Component } from "react";
import { StopLocation } from "../../../api/trimet/types";
import { RemoveBookmarkButton } from "../../../component/buttons/RemoveBookmarkButton";
import StopContainer from "../../stops/containers/StopContainer";
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
  addBookmarkToBookmarkSection: (
    bookmarkSectionId: number,
    stopId: number
  ) => void;
  removeAllBookmarksFromSection: (bookmarkSectionId: number) => void;
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
      allBookmarks,
      updateBookmarkSectionName
    } = this.props;

    const onUpdateBookmarkSectionName = updateBookmarkSectionName
      ? updateBookmarkSectionName.bind(this, id)
      : undefined;
    const removeBookmarkSection = this.removeBookmarkSection.bind(this, id);
    const onReactSelectBookmarkChange = this.onReactSelectBookmarkChange.bind(
      this,
      id
    );
    return (
      <article className="bookmark-section" key={id}>
        <BookmarkSectionNav
          bookmarksInSection={bookmarksInSection}
          name={name}
          onReactSelectBookmarkChange={onReactSelectBookmarkChange}
          toggleEditMode={this.toggleEditMode}
          editMode={this.state.editMode}
          removeBookmarkSection={removeBookmarkSection}
          allBookmarks={allBookmarks}
          updateBookmarkSectionName={onUpdateBookmarkSectionName}
        />
        <ul className="bookmark-section-bookmarks">
          {this.getBookmarksInSection(bookmarksInSection, id)}
        </ul>
      </article>
    );
  }

  public toggleEditMode() {
    this.setState({
      editMode: !this.state.editMode
    });
  }

  private removeBookmarkSection(id) {
    this.props.removeBookmarkSection(id);
  }

  private onReactSelectBookmarkChange(id, val, event) {
    const REMOVE_VALUE = "remove-value";
    const SELECT_OPTION = "select-option";
    const POP_VALUE = "pop-value";
    const CLEAR = "clear";

    switch (event.action) {
      case CLEAR:
        this.props.removeAllBookmarksFromSection(id);
        break;
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

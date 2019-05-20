import React, { Component } from "react";
import { StopLocation } from "../../../api/trimet/types";
import BookmarksInSectionSelector from "./BookmarksInSectionSelector";

interface Props {
  bookmarksInSection: StopLocation[];
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
  bookmarkSectionId: number;
}

export default class BookmarksInSectionSelectionHandler extends Component<
  Props
> {
  public render() {
    const { allBookmarks, bookmarksInSection, bookmarkSectionId } = this.props;
    const onReactSelectBookmarkChange = this.onReactSelectBookmarkChange.bind(
      this,
      bookmarkSectionId
    );

    return (
      <BookmarksInSectionSelector
        bookmarksInSection={bookmarksInSection}
        allBookmarks={allBookmarks}
        onReactSelectBookmarkChange={onReactSelectBookmarkChange}
      />
    );
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

import React from "react";
import { BookmarkSectionsProps } from "../../../../store/reducers/bookmarkSectionReducer";
import "../BookmarksViewComponent.scss";
import AddBookmarkSectionControl from "./AddBookmarkSectionControl";
import BookmarkSections from "./BookmarkSections";

interface Props {
  onSectionNameUpdate: (name: string) => void;
  bookmarkSectionName: string;
  createBookmarkSection: () => void;
  bookmarkSections: BookmarkSectionsProps;
}

export default class BookmarksViewComponent extends React.Component<Props> {
  public render() {
    const {
      bookmarkSectionName,
      bookmarkSections,
      createBookmarkSection,
      onSectionNameUpdate
    } = this.props;

    return (
      <div>
        {/* <h1>Bookmark Sections</h1> */}
        <AddBookmarkSectionControl
          bookmarkSectionName={bookmarkSectionName}
          createBookmarkSection={createBookmarkSection}
          onSectionNameUpdate={onSectionNameUpdate}
        />
        <BookmarkSections bookmarkSections={bookmarkSections} />
      </div>
    );
  }
}

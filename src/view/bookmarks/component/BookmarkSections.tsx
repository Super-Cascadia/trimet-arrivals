import { isEmpty, map } from "lodash";
import React from "react";
import {
  BookmarkSectionProps,
  BookmarkSectionsProps
} from "../../../store/reducers/bookmarksReducer";
import BookmarkSectionContainer from "../container/BookmarkSectionContainer";
import "./BookmarkSections.css";

interface Props {
  bookmarkSections: BookmarkSectionsProps;
}

export default function BookmarkSections({ bookmarkSections }: Props) {
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
        (bookmarkSection: BookmarkSectionProps, id: number) => {
          return <BookmarkSectionContainer bookmarkSectionId={id} />;
        }
      )}
    </div>
  );
}

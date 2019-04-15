import { isEmpty, map } from "lodash";
import React from "react";
import {
  BookmarkSection,
  BookmarkSectionsProps
} from "../../../store/reducers/bookmarksReducer";

function getBookmarkSection(
  bookmarkSection: BookmarkSection,
  id: number,
  removeBookmarkSection
) {
  return (
    <article className="bookmark-section" key={id}>
      <h3>{bookmarkSection.name}</h3>
      <button onClick={removeBookmarkSection.bind(this, id)}>
        Remove Section
      </button>
    </article>
  );
}

interface Props {
  bookmarkSections: BookmarkSectionsProps;
  removeBookmarkSection: (bookmarkSectionId: number) => void;
}

export default function BookmarkSections({
  bookmarkSections,
  removeBookmarkSection
}: Props) {
  if (isEmpty(bookmarkSections)) {
    return (
      <div className="bookmark-section-message">
        Add a bookmark section to begin organizing bookmarks.
      </div>
    );
  }

  return (
    <div>
      {map(bookmarkSections, (bookmarkSection: BookmarkSection, id: number) => {
        return getBookmarkSection(bookmarkSection, id, removeBookmarkSection);
      })}
    </div>
  );
}

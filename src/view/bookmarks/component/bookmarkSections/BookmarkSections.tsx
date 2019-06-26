import { isEmpty, map } from "lodash";
import React, { lazy, Suspense } from "react";
import LoadIndicator from "../../../../component/loadIndicator/LoadIndicator";
import {
  BookmarkSectionProps,
  BookmarkSectionsProps
} from "../../../../store/reducers/bookmarkSectionReducer";
import "./BookmarkSections.css";

const BookmarkSectionContainer = lazy(() =>
  import("../../container/BookmarkSectionContainer")
);

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
    <Suspense fallback={LoadIndicator}>
      <div className="bookmark-section-list">
        {map(
          bookmarkSections,
          (bookmarkSection: BookmarkSectionProps, id: number) => {
            return <BookmarkSectionContainer bookmarkSectionId={id} />;
          }
        )}
      </div>
    </Suspense>
  );
}

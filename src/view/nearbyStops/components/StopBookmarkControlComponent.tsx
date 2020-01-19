import React from "react";
import BookmarkButton, {
  BookmarkClick,
  BookmarkSectionClick
} from "../../../component/buttons/BookmarksButton";
import { BookmarkSectionsProps } from "../../../store/reducers/bookmarkSectionReducer";
import { StopLocationWithDistance } from "../../../store/reducers/stopsReducer";

interface Props {
  stopLocation: StopLocationWithDistance;
  onBookmarkClick: BookmarkClick;
  stopIsBookmarked: boolean;
  bookmarkSections: BookmarkSectionsProps;
  onBookmarkSectionSelect: BookmarkSectionClick;
}

export default function StopBookmarkControlComponent(props: Props) {
  const {
    onBookmarkClick,
    stopLocation,
    stopIsBookmarked,
    bookmarkSections,
    onBookmarkSectionSelect
  } = props;

  return (
    <BookmarkButton
      onBookmarkClick={onBookmarkClick}
      stopLocation={stopLocation}
      stopIsBookmarked={stopIsBookmarked}
      bookmarkSections={bookmarkSections}
      onBookmarkSectionSelect={onBookmarkSectionSelect}
    />
  );
}

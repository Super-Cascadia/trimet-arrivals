import React from "react";
import { StopLocation } from "../../../api/trimet/types";
import BookmarkButton from "../../../component/buttons/BookmarksButton";
import { BookmarkSectionsProps } from "../../../store/reducers/bookmarksReducer";

interface Props {
  stopLocation: StopLocation;
  onBookmarkClick: (
    stopLocation: StopLocation,
    stopIsBookmarked: boolean
  ) => void;
  stopIsBookmarked: boolean;
  bookmarkSections: BookmarkSectionsProps;
  onBookmarkSectionSelect: (
    selectedBookmarkSection: number,
    stopLocation: StopLocation
  ) => void;
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

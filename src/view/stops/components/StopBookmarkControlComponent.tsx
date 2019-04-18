import React from "react";
import { StopLocation } from "../../../api/trimet/types";
import BookmarkButton from "../../../component/buttons/BookmarksButton";

interface Props {
  stopLocation: StopLocation;
  onBookmarkClick: (
    stopLocation: StopLocation,
    stopIsBookmarked: boolean
  ) => void;
  stopIsBookmarked: boolean;
}

export default function StopBookmarkControlComponent(props: Props) {
  const { onBookmarkClick, stopLocation, stopIsBookmarked } = props;

  return (
    <BookmarkButton
      onBookmarkClick={onBookmarkClick}
      stopLocation={stopLocation}
      stopIsBookmarked={stopIsBookmarked}
    />
  );
}

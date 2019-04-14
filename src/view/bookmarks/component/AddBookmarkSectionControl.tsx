import React from "react";

interface Props {
  onClick: () => void;
}

export default function AddBookmarkSectionControl({ onClick }: Props) {
  return <button onClick={onClick}>Add Bookmark Section</button>;
}

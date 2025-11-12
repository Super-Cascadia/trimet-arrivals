import cx from "classnames";
import React from "react";
import { Button, Card } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { RemoveBookmarkSectionButton } from "../../../../../component/buttons/RemoveBookmarkSectionButton";
import EditSectionNameInput from "./EditSectionNameInput";

function EditModeToggleButton({ onClick, editMode }) {
  return (
    <Button onClick={onClick}>
      <FontAwesome name="edit" />
    </Button>
  );
}

interface Props {
  editMode: boolean;
  name: string;
  removeBookmarkSection: () => void;
  toggleEditMode: () => void;
  updateBookmarkSectionName: (bookmarkSectionName: string) => void;
}

export default function BookmarkSectionNameControl({
  editMode,
  name,
  removeBookmarkSection,
  toggleEditMode,
  updateBookmarkSectionName
}: Props) {
  return (
    <Card.Header className="d-flex justify-content-between flex-wrap flex-md-nowrap pt-3 pb-2 mb-3">
      {editMode && (
        <EditSectionNameInput
          sectionName={name}
          updateBookmarkSectionName={updateBookmarkSectionName}
        />
      )}
      {!editMode && <h3 className="h6">{name}</h3>}
      {editMode && (
        <RemoveBookmarkSectionButton
          removeBookmarkSection={removeBookmarkSection}
        />
      )}
      <EditModeToggleButton editMode={editMode} onClick={toggleEditMode} />
    </Card.Header>
  );
}

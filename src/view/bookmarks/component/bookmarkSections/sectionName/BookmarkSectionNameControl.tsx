import cx from "classnames";
import React from "react";
import { Button, Card } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { RemoveBookmarkSectionButton } from "../../../../../component/buttons/RemoveBookmarkSectionButton";
import EditSectionNameInput from "./EditSectionNameInput";

function EditModeToggleButton({ onClick, editMode }) {
  const classNames = cx(
    "group-menu-item",
    "float-right",
    "edit-toggle-button",
    {
      enabled: editMode
    }
  );

  return (
    <Button onClick={onClick} className={classNames}>
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
    <Card.Header>
      {editMode && (
        <EditSectionNameInput
          sectionName={name}
          updateBookmarkSectionName={updateBookmarkSectionName}
        />
      )}
      {!editMode && <h3>{name}</h3>}
      {editMode && (
        <RemoveBookmarkSectionButton
          removeBookmarkSection={removeBookmarkSection}
        />
      )}
      <EditModeToggleButton editMode={editMode} onClick={toggleEditMode} />
    </Card.Header>
  );
}

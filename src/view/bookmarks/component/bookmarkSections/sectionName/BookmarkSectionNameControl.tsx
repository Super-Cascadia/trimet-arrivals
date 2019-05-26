import cx from "classnames";
import React from "react";
import FontAwesome from "react-fontawesome";
import { RemoveBookmarkSectionButton } from "../../../../../component/buttons/RemoveBookmarkSectionButton";
import EditSectionNameInput from "./EditSectionNameInput";

function EditModeToggleButton({ onClick, editMode }) {
  const classNames = cx("group-menu-item", "edit-toggle-button", {
    enabled: editMode
  });

  return (
    <button onClick={onClick} className={classNames}>
      <FontAwesome name="edit" />
    </button>
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
    <div className="bookmark-section-control-wrapper">
      <div className="bookmark-section-name-wrapper">
        {editMode && (
          <EditSectionNameInput
            sectionName={name}
            updateBookmarkSectionName={updateBookmarkSectionName}
          />
        )}
        {!editMode && <h3>{name}</h3>}
      </div>
      <div className="bookmark-section-edit-controls-wrapper">
        {editMode && (
          <RemoveBookmarkSectionButton
            removeBookmarkSection={removeBookmarkSection}
          />
        )}
        <EditModeToggleButton editMode={editMode} onClick={toggleEditMode} />
      </div>
    </div>
  );
}

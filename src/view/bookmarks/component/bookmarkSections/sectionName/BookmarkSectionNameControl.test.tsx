import { mount, shallow } from "enzyme";
import React from "react";
import BookmarkSectionNameControl from "./BookmarkSectionNameControl";

describe("BookmarkSectionNameControl", () => {
  describe("by default", () => {
    it("does not error when rendered", () => {
      expect(() => {
        return shallow(
          <BookmarkSectionNameControl
            editMode={undefined}
            name={undefined}
            removeBookmarkSection={undefined}
            toggleEditMode={undefined}
            updateBookmarkSectionName={undefined}
          />
        );
      }).not.toThrow();
    });

    it("has a button for toggling edit mode", () => {
      const subject = shallow(
        <BookmarkSectionNameControl
          editMode={undefined}
          name={undefined}
          removeBookmarkSection={undefined}
          toggleEditMode={undefined}
          updateBookmarkSectionName={undefined}
        />
      );

      const editToggleMode = subject.find("EditModeToggleButton");

      expect(editToggleMode).toExist();
    });
  });

  describe("When not in edit mode", () => {
    describe("and a name is provided", () => {
      it("has a header with the supplied name", () => {
        const subject = shallow(
          <BookmarkSectionNameControl
            editMode={undefined}
            name={"foo"}
            removeBookmarkSection={undefined}
            toggleEditMode={undefined}
            updateBookmarkSectionName={undefined}
          />
        );

        const header = subject.find("h3");

        expect(header).toExist();
        expect(header.text()).toBe("foo");
      });
    });
  });

  describe("When in Edit Mode", () => {
    const subject = mount(
      <BookmarkSectionNameControl
        editMode={true}
        name={undefined}
        removeBookmarkSection={undefined}
        toggleEditMode={undefined}
        updateBookmarkSectionName={undefined}
      />
    );

    it("shows an input for editing the section name", () => {
      const editSectionNameInput = subject.find("EditSectionNameInput");
      expect(editSectionNameInput).toExist();
    });

    it("shows a button for removing the bookmark section", () => {
      const removeBokmarkSectionButton = subject.find(
        "RemoveBookmarkSectionButton"
      );
      expect(removeBokmarkSectionButton).toExist();
    });
  });
});

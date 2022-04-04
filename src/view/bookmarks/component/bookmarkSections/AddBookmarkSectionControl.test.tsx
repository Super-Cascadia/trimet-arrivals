import { shallow } from "enzyme";
import * as React from "react";
import AddBookmarkSectionControl from "./AddBookmarkSectionControl";

describe("AddBookmarkSectionControl", () => {
  // describe("by default", () => {
  //   it("renders without error", () => {
  //     expect(() =>
  //       shallow(
  //         <AddBookmarkSectionControl
  //           onSectionNameUpdate={undefined}
  //           bookmarkSectionName={undefined}
  //           createBookmarkSection={undefined}
  //         />
  //       )
  //     );
  //   });
  //   const subject = shallow(
  //     <AddBookmarkSectionControl
  //       onSectionNameUpdate={undefined}
  //       bookmarkSectionName={undefined}
  //       createBookmarkSection={undefined}
  //     />
  //   );
  //   const input = subject.find("input");
  //   const button = subject.find("button");
  //   it("has an input", () => {
  //     expect(input).toExist();
  //   });
  //   it("has a button", () => {
  //     expect(button).toExist();
  //   });
  //   it("the button is disabled", () => {
  //     expect(button.props().disabled).toBe(true);
  //   });
  //   it("the button has a text label", () => {
  //     expect(button.text()).toBe("Create");
  //   });
  // });
  // describe("when text is entered into the input", () => {
  //   const onSectionNameUpdateSpy = jasmine.createSpy("onSectionNameUpdateSpy");
  //   const subject = shallow(
  //     <AddBookmarkSectionControl
  //       onSectionNameUpdate={onSectionNameUpdateSpy}
  //       bookmarkSectionName={undefined}
  //       createBookmarkSection={undefined}
  //     />
  //   );
  //   const input = subject.find("input");
  //   input.simulate("change", {
  //     target: {
  //       value: "foo"
  //     }
  //   });
  //   it("local state is updated for the input", () => {
  //     expect(subject.state().bookmarkSectionName).toBe("foo");
  //   });
  //   it("the onSectionNameUpdate delegate is called", () => {
  //     expect(onSectionNameUpdateSpy).toHaveBeenCalledWith("foo");
  //   });
  // });
  // describe("when the Create bookmark button is slicked", () => {
  //   const createBookmarkSectionSpy = jasmine.createSpy(
  //     "createBookmarkSectionSpy"
  //   );
  //   const subject = shallow(
  //     <AddBookmarkSectionControl
  //       onSectionNameUpdate={undefined}
  //       bookmarkSectionName={undefined}
  //       createBookmarkSection={createBookmarkSectionSpy}
  //     />
  //   );
  //   const button = subject.find("button");
  //   button.simulate("click", {
  //     preventDefault: () => {
  //       return;
  //     },
  //     stopPropagation: () => {
  //       return;
  //     }
  //   });
  //   it("the createBookmarkSectionSpy delegate is called", () => {
  //     expect(createBookmarkSectionSpy).toHaveBeenCalled();
  //   });
  // });
});

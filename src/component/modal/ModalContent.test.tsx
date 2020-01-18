import { shallow } from "enzyme";
import React from "react";
import { TrimetRoute } from "../../api/trimet/types";
import ModalContent from "./ModalContent";

describe("ModalContent", () => {
  describe("by default", () => {
    it("renders without errors", () => {
      expect(() =>
        shallow(<ModalContent route={undefined} closeModal={undefined} />)
      ).not.toThrow();
    });

    const subject = shallow(
      <ModalContent route={undefined} closeModal={undefined} />
    );

    it("has a header", () => {
      expect(subject.find("header")).toExist();
    });

    it("does not have an info section", () => {
      expect(subject.find("section")).not.toExist();
    });
  });

  describe("when route information is provided", () => {
    it("shows the route data in the section", () => {
      const route: TrimetRoute = {
        desc: "string",
        dir: [
          {
            desc: "string",
            dir: 123
          }
        ],
        route: 123,
        type: "B"
      };

      const subject = shallow(
        <ModalContent route={route} closeModal={undefined} />
      );

      expect(subject.find("section")).toExist();
    });
  });

  describe("when the close button is clicked", () => {
    it("fires the closeModal delegate", () => {
      const closeModal = jasmine.createSpy("closeModal");
      const subject = shallow(
        <ModalContent route={undefined} closeModal={closeModal} />
      );

      const header = subject.find("header");
      const closeButton = header.find("button");

      closeButton.simulate("click");

      expect(closeModal).toHaveBeenCalled();
    });
  });
});

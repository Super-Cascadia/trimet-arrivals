import { mount, shallow } from "enzyme";
import React from "react";
import Modal from "./Modal";

describe("Modal", () => {
  describe("by default", () => {
    it("renders without crashing", () => {
      expect(() =>
        shallow(
          <div>
            <div id="modal-root" />
            <Modal>
              <div>Hello world</div>
            </Modal>
          </div>
        )
      ).not.toThrow();
    });
  });

  describe("when rendered", () => {
    it("renders the modal children", () => {
      const subject = mount(
        <div>
          <div id="modal-root" />
          <Modal>
            <div className="modal-content">Hello world</div>
          </Modal>
        </div>,
        { attachTo: document.body }
      );

      const modalContent = subject.find(".modal-content");
      expect(modalContent).toExist();
      expect(modalContent.text()).toBe("Hello world");
    });
  });

  describe("when unmounted", () => {
    it("removes the modal", () => {
      const subject = mount(
        <div>
          <div id="modal-root" />
          <Modal>
            <div className="modal-content">Hello world</div>
          </Modal>
        </div>,
        { attachTo: document.body }
      );

      subject.unmount();

      const modalContent = subject.find(".modal-content");
      expect(modalContent).not.toExist();
    });
  });
});

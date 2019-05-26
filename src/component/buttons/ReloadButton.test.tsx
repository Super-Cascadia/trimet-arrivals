import { shallow } from "enzyme";
import React from "react";
import ReloadButton from "./ReloadButton";

describe("ReloadButton", () => {
  describe("by default", () => {
    it("renders without crashing", () => {
      shallow(<ReloadButton disabled={undefined} onClick={undefined} />);
    });

    const subject = shallow(
      <ReloadButton disabled={undefined} onClick={undefined} />
    );

    const button = subject.find("button");

    it("has a button", () => {
      // @ts-ignore
      expect(button).toExist();
    });

    it("the button contains an icon", () => {
      const icon = button.find("FontAwesome");
      // @ts-ignore
      expect(icon).toExist();
      expect(icon.props().name).toBe("refresh");
      expect(icon.props().size).toBe("2x");
      expect(icon.props().spin).not.toBeDefined();
    });

    it("the button has reload classes", () => {
      expect(button.props().className).toBe("reload-button");
    });

    it("the button has title text", () => {
      expect(button.props().title).toBe("Reload arrivals for stop");
    });
  });

  describe("when loading", () => {
    const subject = shallow(
      <ReloadButton disabled={true} onClick={undefined} />
    );

    const button = subject.find("button");

    it("the button icon is spinning", () => {
      const icon = button.find("FontAwesome");
      expect(icon.props().name).toBe("refresh");
      expect(icon.props().size).toBe("2x");
      expect(icon.props().spin).toBeDefined();
    });
  });

  describe("suite provided a class", () => {
    const subject = shallow(
      <ReloadButton disabled={true} onClick={undefined} className="foo" />
    );

    it("the button icon is spinning", () => {
      const button = subject.find("button");
      expect(button.props().className).toBe("reload-button foo");
    });
  });

  describe("when provided children", () => {
    const subject = shallow(
      <ReloadButton disabled={true} onClick={undefined}>
        <div>Foo</div>
      </ReloadButton>
    );

    it("renders them inside of the button", () => {
      const button = subject.find("button");
      // @ts-ignore
      expect(button.find("div")).toExist();
    });
  });

  describe("when clicked", () => {
    const onClickSpy = jasmine.createSpy("onClickSpy");
    const subject = shallow(
      <ReloadButton disabled={true} onClick={onClickSpy}>
        <div>Foo</div>
      </ReloadButton>
    );

    it("renders them inside of the button", () => {
      const button = subject.find("button");
      button.simulate("click");
      expect(onClickSpy).toHaveBeenCalled();
    });
  });
});

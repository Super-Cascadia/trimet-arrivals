import { mount } from "enzyme";
import React from "react";
import App from "./App";

it("renders without crashing", () => {
  expect(() => mount(<App />)).not.toThrow();
});

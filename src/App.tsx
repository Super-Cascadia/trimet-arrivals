import React from "react";
import { Provider } from "react-redux";
import "./App.css";
import appStore from "./store/store";
import ViewContainer from "./view/ViewContainer";

const store = appStore();

export default class App extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <div>
          <ViewContainer />
        </div>
      </Provider>
    );
  }
}

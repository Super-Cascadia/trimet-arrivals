import React from "react";
import { Provider } from "react-redux";
import "./App.css";
import Routes from "./routes/Routes";
import appStore from "./store/store";
import ViewContainer from "./view/ViewContainer";

const store = appStore();

export default class App extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <div>
          {/*<ViewContainer />*/}
          <Routes />
        </div>
      </Provider>
    );
  }
}

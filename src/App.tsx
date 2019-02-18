import React from "react";
import { Provider } from "react-redux";
import "./App.css";
import appStore from "./store/store";
import StopsContainer from "./view/stops/StopsContainer";

const store = appStore();

class App extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <div>
          <StopsContainer />
        </div>
      </Provider>
    );
  }
}

export default App;

import React from "react";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import RootAppRoutes from "./routes/RootAppRoutes";
import appStore from "./store/store";

const store = appStore();

export default class App extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <div>
          <RootAppRoutes />
          <ToastContainer />
        </div>
      </Provider>
    );
  }
}

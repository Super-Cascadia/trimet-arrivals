import React from "react";
import ReactDOM from "react-dom";
import "typeface-roboto";
import "../node_modules/font-awesome/css/font-awesome.css";
import App from "./App";
import "./index.scss";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
registerServiceWorker();

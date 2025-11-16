import React from "react";
import ReactDOM from "react-dom";
import "typeface-roboto";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/font-awesome/css/font-awesome.css";
import App from "./App";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";

// Global unhandled promise rejection logging to surface silent failures
window.addEventListener("unhandledrejection", e => {
	const reason = e.reason;
	if (reason === undefined) {
		// Provide more diagnostic information when rejection reason is undefined
		console.error("Unhandled promise rejected with undefined reason. Attach explicit Error objects when rejecting.");
	} else {
		console.error("Unhandled promise rejection:", reason);
	}
});

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
registerServiceWorker();

import React from "react";
import ReactDOM from "react-dom";
import "typeface-roboto";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/font-awesome/css/font-awesome.css";
import App from "./App";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";

// Global unhandled promise rejection logging to surface silent failures
// Must be registered before any other code runs
window.addEventListener("unhandledrejection", e => {
	const reason = e.reason;
	
	// Null rejections from webpack HMR/React refresh during development - suppress these
	if ((reason === undefined || reason === null) && process.env.NODE_ENV === 'development') {
		console.warn("Suppressed null/undefined promise rejection (likely from HMR/React refresh)");
		// Prevent the default error handling
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
		// Handle the promise to mark it as handled
		if (e.promise && typeof e.promise.catch === 'function') {
			e.promise.catch(() => {});
		}
		return;
	}
	
	console.error("=== Unhandled Promise Rejection ===");
	console.error("Reason type:", typeof reason);
	console.error("Reason value:", reason);
	console.error("Reason is null:", reason === null);
	console.error("Reason is undefined:", reason === undefined);
	console.error("Promise:", e.promise);
	console.error("Full event:", e);
	
	if (reason === undefined || reason === null) {
		console.error("CRITICAL: Promise rejected with null/undefined reason. Attach explicit Error objects when rejecting.");
		console.trace("Stack trace at rejection handler:");
	} else if (reason instanceof Error) {
		console.error("Error message:", reason.message);
		console.error("Error stack:", reason.stack);
	}
}, true);

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
registerServiceWorker();

import { h, render } from "preact";
import App from "./App";

function start_app() {
    render(<App />, document.body, document.getElementById("root"));
    if (process.env.NODE_ENV !== "production") {
        console.log("Preact + FuseBox + TypeScript Example started");
    }
}

window.setTimeout(start_app, 1000);

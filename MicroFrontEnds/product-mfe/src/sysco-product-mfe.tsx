import React from "react";
import ReactDOMClient from "react-dom/client";
import singleSpaReact from "single-spa-react";
import Root from "./root.component";
import 'regenerator-runtime/runtime';

const lifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: Root,
  errorBoundary(err, info, props) {
    return (
      <div style={{ padding: "24px", fontFamily: "Segoe UI, Arial, sans-serif", color: "#7f1d1d" }}>
        <h2 style={{ margin: "0 0 8px" }}>Product page failed to render</h2>
        <p style={{ margin: "0 0 8px", color: "#444" }}>
          Please refresh the page. If the issue persists, share this error with the team.
        </p>
        <pre style={{ whiteSpace: "pre-wrap", background: "#fff1f2", border: "1px solid #fecdd3", padding: "12px", borderRadius: "8px" }}>
          {String(err?.message || err)}
        </pre>
      </div>
    );
  },
});

export const { bootstrap, mount, unmount } = lifecycles;

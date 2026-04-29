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
      <div style={{ padding: "24px", fontFamily: "system-ui, sans-serif" }}>
        <h2>Cart Page Failed To Render</h2>
        <p>Please refresh and try again.</p>
        <pre style={{ whiteSpace: "pre-wrap", background: "#f5f5f5", padding: "12px", borderRadius: "8px" }}>
          {String(err?.message || err || "Unknown error")}
        </pre>
      </div>
    );
  },
});

export const { bootstrap, mount, unmount } = lifecycles;

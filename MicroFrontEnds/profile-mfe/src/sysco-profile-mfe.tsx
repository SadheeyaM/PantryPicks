import React from "react";
import ReactDOMClient from "react-dom/client";
import singleSpaReact from "single-spa-react";
import Root from "./root.component";

const lifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: Root,
  errorBoundary(err, info, props) {
    console.error("[Profile MFE Error]", err, info);
    return (
      <div style={{ padding: "20px", color: "red", fontSize: "14px" }}>
        <h3>Profile MFE Error</h3>
        <pre>{err?.toString()}</pre>
        <pre>{info?.componentStack}</pre>
      </div>
    );
  },
});

export const { bootstrap, mount, unmount } = lifecycles;

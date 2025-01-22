import React from "react";
import { BrowserRouter } from "react-router";

import App from "./page";

import("react-dom/client").then(({ createRoot }) => {
  const root = document.getElementById("root");
  if (root) {
    createRoot(root).render(
      <React.StrictMode>
        <BrowserRouter basename="/index.html">
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
  }
});

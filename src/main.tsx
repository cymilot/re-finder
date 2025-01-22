import React from "react";

import App from "./page/App";

import("react-dom/client").then(({ createRoot }) => {
  const root = document.getElementById("root");
  if (root) {
    createRoot(root).render(<App />);
  }
});

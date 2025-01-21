import React from "react";

import App from "./page/App";

import("react-dom/client").then(({ createRoot }) => {
  const injectPoint = document.getElementById("root");
  if (injectPoint) {
    createRoot(injectPoint).render(<App />);
  }
});

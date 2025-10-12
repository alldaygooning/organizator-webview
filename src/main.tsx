import { createRoot } from "react-dom/client";
import App from "./App";
import React from "react";

const container = document.getElementById("root");
if (!container) throw new Error("Root element not found");

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

import { createRoot } from "react-dom/client";
import React from "react";
import AppRouter from "./AppRouter";

const container = document.getElementById("root");
if (!container) throw new Error("Root element not found");

createRoot(container).render(
    <React.StrictMode>
        <AppRouter />
    </React.StrictMode>
);

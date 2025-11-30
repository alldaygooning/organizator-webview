import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import ConflictResolutionPage from "./pages/ConflictResolutionPage";

const AppRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route
                    path="/admin/conflicts"
                    element={<ConflictResolutionPage />}
                />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;

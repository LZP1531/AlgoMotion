import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./layouts/AppShell";
import { CategoryPage } from "./features/categories/CategoryPage";
import { ProblemPage } from "./features/problems/ProblemPage";
import { categories } from "./data/categories";
import "./styles/global.css";
import "./styles/highlight.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to={`/category/${categories[0].id}`} replace />} />
          <Route path="category/:categoryId" element={<CategoryPage />} />
          <Route path="problem/:slug" element={<ProblemPage />} />
          <Route path="*" element={<Navigate to={`/category/${categories[0].id}`} replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);

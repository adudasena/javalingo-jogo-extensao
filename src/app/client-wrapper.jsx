"use client";

import React from "react";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

export default function ClientWrapper() {
  if (typeof window === "undefined") return null;
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

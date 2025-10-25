"use client";
import dynamic from "next/dynamic";
import { BrowserRouter } from "react-router-dom";

const App = dynamic(() => import("./App.jsx"), { ssr: false });

export default function Page() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

"use client";
import { BrowserRouter } from "react-router-dom";
import loadDynamic from "next/dynamic"; 

export const dynamic = "force-dynamic"; // agora não conflita com o import acima

const App = loadDynamic(() => import("./App.jsx"), { ssr: false });

export default function Page() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

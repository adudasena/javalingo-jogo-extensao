// src/pages/_app.js
import { BrowserRouter } from "react-router-dom";
import App from "../App";
import "../globals.css";
import "../styles.css";
import "../NivelamentoPopup.css";

export default function MyApp() {
  if (typeof window === "undefined") return null; // evita SSR
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

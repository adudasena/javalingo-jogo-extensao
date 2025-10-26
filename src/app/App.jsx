// src/App.jsx
import React, { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, Navigate, NavLink } from "react-router-dom";
import { getState } from "./lib/storage";
import BackgroundFX from "./components/BackgroundFX";

const Login     = lazy(() => import("./pages/Login"));
const Home      = lazy(() => import("./pages/Home.jsx"));
const LevelTest = lazy(() => import("./pages/LevelTest"));
const Quiz      = lazy(() => import("./pages/Quiz"));
const Shop      = lazy(() => import("./pages/Shop"));
const Profile   = lazy(() => import("./pages/Profile.jsx"));
const Missions  = lazy(() => import("./pages/Missions"));
const Signup    = lazy(() => import("./pages/Signup"));

// Hook reativo para refletir login/logout sem recarregar a página
//ultima atualização, pela incompatibilidade na vm
function useAuthLive() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAuth(Boolean(getState().user));

      const update = () => setIsAuth(Boolean(getState().user));
      window.addEventListener("javalingo:state", update);
      window.addEventListener("storage", update);

      return () => {
        window.removeEventListener("javalingo:state", update);
        window.removeEventListener("storage", update);
      };
    }
  }, []);

  return isAuth;
}

function Footer() {
  return (
    <footer className="footer">
      <small>JavaLingo © 2025 <span className="dot">•</span> ™</small>
    </footer>
  );
}

export default function App() {
  const isAuth = useAuthLive(); // <<< usa o estado ao vivo

  return (
    <div className="page">
      <BackgroundFX />

      {isAuth && (
        <header className="header">
          <div className="header-inner">
            <nav className="nav">
              <NavLink to="/home">Início</NavLink>
              <NavLink to="/missions">Jogar</NavLink>
              <NavLink to="/shop">Loja</NavLink>
              <NavLink to="/profile">Perfil</NavLink>
            </nav>
          </div>
        </header>
      )}

      <div className="page-content">
        <Suspense fallback={<div style={{ padding: 16 }}>Carregando…</div>}>
          <Routes>
            <Route path="/" element={isAuth ? <Navigate to="/home" /> : <Login />} />
            <Route path="/login" element={<Login />} />

           <Route path="/leveltest" element={<Guard><LevelTest /></Guard>} />

            <Route path="/home" element={<Guard><Home /></Guard>} />
            <Route path="/missions" element={<Guard><Missions /></Guard>} />
            <Route path="/quiz" element={<Guard><Quiz /></Guard>} />
            <Route path="/shop" element={<Guard><Shop /></Guard>} />
            <Route path="/profile" element={<Guard><Profile /></Guard>} />

            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}

function Guard({ children }) {
  const s = getState();
  if (!s.user) return <Navigate to="/login" replace />;
  return children;
}

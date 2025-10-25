import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Mascot from "../components/Mascot";
import CoinCounter from "../components/CoinCounter";
import ProgressBar from "../components/ProgressBar";
import { getState } from "../lib/storage";
import { levelToLabel } from "../state/levels";
import Ticker from "../components/Ticker";
import NivelamentoPopup from "../components/NivelamentoPopup";
import "../NivelamentoPopup.css";
import "../styles.css";

export default function Home() {
  const [state, setLocalState] = useState(getState());
  const s = state;
  const name = s.user?.name || "aluno(a)";
  const level = s.level ?? "beginner";
  const levelLabel = levelToLabel(level);
  const xpToNext = 100;
  const currentXP = s.xp ?? 0;
  const pct = Math.min(100, Math.round(((currentXP % xpToNext) / xpToNext) * 100));

  const [showPopup, setShowPopup] = useState(false);

  // Saudação dinâmica
  const saudacao = () => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia ☀️";
    if (h < 18) return "Boa tarde 🌤️";
    return "Boa noite 🌙";
  };

  useEffect(() => {
    const username = s.user?.name || "demo";
    const testeFeito = localStorage.getItem(`testeFeito_${username}`);
    const jaFez = s.levelTestDone || testeFeito;

    if (!jaFez) setTimeout(() => setShowPopup(true), 600);
    else setShowPopup(false);
  }, [s.user?.name, s.levelTestDone]);

  const featured = useMemo(
    () => [
      { id: "loops", title: "Laços & Loops", tag: "Básico", xp: 20, to: "/missions?m=loops" },
      { id: "oo", title: "POO: Classes", tag: "Intermediário", xp: 30, to: "/missions?m=poo" },
      { id: "streams", title: "Streams & Map", tag: "Avançado", xp: 40, to: "/missions?m=streams" },
    ],
    []
  );

  return (
    <div className="home-wrap">
      {/* ===== HERO ===== */}
      <motion.section
        className="card hero-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="hero-left">
          <h1 className="hero-title sparkle">
            {saudacao()}, <span className="hero-name">{name}</span>!
          </h1>
          <p className="hero-sub">Aprender Java nunca foi tão divertido! ✨</p>

          <div className="hero-cta-row">
            <Link className="btn-rocket" to="/missions">
              <span className="icon">🚀</span> Começar a jogar
              <span className="shine"></span>
            </Link>
            <Link className="btn btn-ghost" to="/shop">
              Loja
            </Link>
          </div>

          <div className="hero-progress">
            <span className="label">Rumo ao próximo nível</span>
            <ProgressBar value={pct} />
            <span className="small">{pct}% até o próximo nível</span>
          </div>
        </div>

        <div className="hero-right">
          {/* Anel animado do mascote */}
          <motion.div
            className="mascot-orb"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="orb glow"></div>
            <Mascot skin={s.activeSkin} size={180} />
            <div className="shine"></div>
          </motion.div>

          <div className="hero-stats">
            <div className="pill">
              Nível: <b>{levelLabel}</b>
            </div>
            <div className="pill">
              <CoinCounter coins={s.coins ?? 0} />
            </div>
          </div>
        </div>
      </motion.section>

      {/* ===== SEÇÃO PRINCIPAL ===== */}
      <motion.section
        className="home-grid"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {/* 🧭 Trilhas de Aprendizado */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3>🧭 Trilhas de Aprendizado</h3>
          <p className="small" style={{ opacity: 0.8, marginBottom: 10 }}>
            Escolha sua jornada e avance nos módulos de Java. Cada trilha libera novos temas!
          </p>

          <motion.div
            className="trilhas-grid"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {[
              {
                icon: "🪜",
                title: "Básico",
                desc: "Fundamentos e Lógica",
                range: "Níveis 1 – 10",
                color: "#4ade80",
              },
              {
                icon: "⚙️",
                title: "Intermediário I",
                desc: "Sintaxe e Estruturas Java",
                range: "Níveis 11 – 20",
                color: "#60a5fa",
              },
              {
                icon: "🧩",
                title: "Intermediário II",
                desc: "POO, Métodos e Coleções",
                range: "Níveis 21 – 30",
                color: "#a78bfa",
              },
              {
                icon: "🚀",
                title: "Avançado I",
                desc: "Streams, Threads e Design Patterns",
                range: "Níveis 31 – 40",
                color: "#f472b6",
              },
              {
                icon: "🧠",
                title: "Avançado II",
                desc: "SOLID, JVM e Padrões Modernos",
                range: "Níveis 41 – 50",
                color: "#facc15",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: `0 0 24px ${t.color}50`,
                }}
                transition={{ type: "spring", stiffness: 180 }}
              >
                <Link
                  to={`/missions?track=${t.title.toLowerCase().replace(/\s+/g, "-")}`}
                  className="mission-card"
                  style={{
                    border: `1px solid ${t.color}40`,
                    boxShadow: `0 0 14px ${t.color}20`,
                    transition: "transform .25s, box-shadow .25s",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {/* Brilho dinâmico */}
                  <div
                    className="shine"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.12) 40%, transparent 80%)",
                      transform: "translateX(-150%)",
                      animation: "shineMove 3.5s ease-in-out infinite",
                      pointerEvents: "none",
                    }}
                  ></div>

                  <div style={{ fontSize: "1.8rem", marginBottom: 6 }}>{t.icon}</div>
                  <div className="title" style={{ color: t.color }}>
                    {t.title}
                  </div>
                  <div className="small" style={{ opacity: 0.9 }}>
                    {t.desc}
                  </div>
                  <div className="small" style={{ marginTop: 6, opacity: 0.7 }}>
                    {t.range}
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* 🔥 Missões em destaque */}
        <div className="card featured-card">
          <h3>🔥 Missões em destaque</h3>
          <div className="featured-grid">
            {featured.map((m) => (
              <Link key={m.id} to={m.to} className="mission-card">
                <div className="tag">{m.tag}</div>
                <div className="title">{m.title}</div>
                <div className="xp">+{m.xp} XP</div>
              </Link>
            ))}
          </div>
        </div>

        {/* 🏆 Conquistas */}
        <div className="card">
          <h3>🏆 Conquistas</h3>
          <div className="badges-grid">
            <div className="badge-tile on">
              <div className="icon">🥇</div>
              <div className="small">Primeira missão</div>
            </div>
            <div className="badge-tile off">
              <div className="icon">⚡</div>
              <div className="small">10 acertos seguidos</div>
            </div>
            <div className="badge-tile off">
              <div className="icon">💎</div>
              <div className="small">Primeira skin</div>
            </div>
          </div>
        </div>
      </motion.section>

      <Ticker />

      {showPopup && <NivelamentoPopup user={name} onClose={() => setShowPopup(false)} />}
    </div>
  );
}

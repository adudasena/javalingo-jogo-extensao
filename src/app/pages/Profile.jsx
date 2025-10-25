// src/pages/Profile.jsx
import React, { useMemo, useState, useEffect } from "react";
import Mascot from "../components/Mascot";
import ProgressBar from "../components/ProgressBar";
import { getState, setState } from "../lib/storage";
import { levelToLabel } from "../state/levels";
import { syncUserProgress } from "../lib/syncUser";

export default function Profile() {
  const [state, setLocalState] = useState(getState());
  const s = state;

  const name = s.user?.name || "Aluno(a)";
  const level = s.level || 1;
  const coins = s.coins ?? 0;
  const currentXP = s.xp || 0;

  const xpToNext = 100;
  const pct = Math.min(100, Math.round(((currentXP % xpToNext) / xpToNext) * 100));

  const [showEdit, setShowEdit] = useState(false);
  const [newName, setNewName] = useState(name);
  const [skinIdx, setSkinIdx] = useState(0);

  // ✅ mantém o perfil atualizado em tempo real
  useEffect(() => {
    const update = () => setLocalState(getState());
    window.addEventListener("javalingo:state", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("javalingo:state", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  const skins = useMemo(
    () => s.ownedSkins || ["javali_classic", "javali_space", "javali_steampunk"],
    [s.ownedSkins]
  );

  async function setActiveSkin(idx) {
    const skin = skins[(idx + skins.length) % skins.length];
    setState({ activeSkin: skin });
    await syncUserProgress();
    window.dispatchEvent(new Event("javalingo:state"));
    document.documentElement.style.setProperty("--ring", "rgba(255,255,255,.6)");
    setTimeout(
      () => document.documentElement.style.setProperty("--ring", "rgba(124,58,237,.45)"),
      600
    );
  }

  function prevSkin() {
    const next = (skinIdx - 1 + skins.length) % skins.length;
    setSkinIdx(next);
    setActiveSkin(next);
  }

  function nextSkin() {
    const next = (skinIdx + 1) % skins.length;
    setSkinIdx(next);
    setActiveSkin(next);
  }

  function logout() {
    setState({ user: null });
    location.href = "/";
  }

  async function handleNameSave() {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setState({ user: { ...(s.user || {}), name: trimmed } });
    await syncUserProgress();
    setShowEdit(false);
  }

  // 🏆 conquistas atualizadas
  const achievements = [
    { id: "first_steps", label: "Primeiros Passos", unlocked: currentXP >= 10 },
    { id: "coins100", label: "100 JavaCoins", unlocked: coins >= 100 },
    { id: "coins1000", label: "1000 JavaCoins", unlocked: coins >= 1000 },
    { id: "buy_skin", label: "Primeira Skin Comprada", unlocked: (s.ownedSkins?.length ?? 0) > 1 },
    { id: "missions10", label: "10 Missões", unlocked: s.missionsDone >= 10 },
    { id: "missions30", label: "30 Missões", unlocked: s.missionsDone >= 30 },
  ];

  return (
    <div className="container">
      <div className="card profile-hero">
        <div className="hero-left">
          <h2 className="profile-title">
            <span className="sparkle">Perfil 🚀</span>
          </h2>

          <div className="profile-name-row">
            <span className="profile-name">{name}</span>
            <span className="badge">
              Nível {level} · {levelToLabel?.(level) || "Iniciante"}
            </span>
          </div>

          <div className="stats-grid">
            <div className="stat">
              <span className="label">JavaCoins</span>
              <strong>{coins}</strong>
            </div>
            <div className="stat">
              <span className="label">XP</span>
              <strong>{currentXP}</strong>
            </div>
          </div>

          <div className="status-bar">
            <span className="label">Progresso até o próximo nível</span>
            <ProgressBar value={pct} />
          </div>

          <div
            className="actions-row"
            style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}
          >
            <button className="btn btn-primary" onClick={() => setShowEdit(true)}>
              Editar perfil
            </button>
          </div>
        </div>

        <div className="hero-right">
          <div className="avatar-ring">
            <svg className="ring" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" className="ring-bg" />
              <circle
                cx="60"
                cy="60"
                r="52"
                className="ring-fg"
                style={{
                  strokeDasharray: `${(pct / 100) * 2 * Math.PI * 52} ${2 * Math.PI * 52}`,
                }}
              />
            </svg>
            <Mascot skin={s.activeSkin} />
          </div>

          <div className="skin-switch">
            <button className="btn btn-ghost" onClick={prevSkin}>
              ◀
            </button>
            <span className="small">
              Skin: <b>{s.activeSkin || skins[skinIdx]}</b>
            </span>
            <button className="btn btn-ghost" onClick={nextSkin}>
              ▶
            </button>
          </div>
        </div>
      </div>

      <div className="grid-3">
        <div className="card section-card">
          <h3>Conquistas</h3>
          <div className="badges-grid">
            {achievements.map((a) => (
              <div key={a.id} className={`badge-tile ${a.unlocked ? "on" : "off"}`}>
                <div className="icon">{a.unlocked ? "🏆" : "🔒"}</div>
                <div className="label">{a.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card actions-footer">
        <div className="right" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn btn-accent" onClick={logout}>
            Sair
          </button>
        </div>
      </div>

      {showEdit && (
        <div className="popup-overlay" onClick={() => setShowEdit(false)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <h3>Editar perfil</h3>
            <div className="input-row" style={{ marginTop: 12 }}>
              <label className="small">Nome</label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Digite seu nome"
              />
            </div>
            <div className="popup-actions">
              <button className="btn btn-primary" onClick={handleNameSave}>
                Salvar
              </button>
              <button className="btn btn-ghost" onClick={() => setShowEdit(false)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

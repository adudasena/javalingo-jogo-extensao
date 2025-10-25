import React from "react";
import { useNavigate } from "react-router-dom";
import { getProgress } from "../state/progress.js";
import { getState } from "../lib/storage";

const TOTAL = 50;

export default function Missions() {
  const nav = useNavigate();
  const s = getState();
  const user = s.user?.name || "demo";
  const { highestUnlocked, completed } = getProgress(user);

  const completedSet = new Set(completed || []);

  function getPhase(n) {
    if (n <= 10) return "beginner";
    if (n <= 30) return "intermediate";
    return "advanced";
  }

  return (
    <div className="container">
      <div className="card section-card">
        <h2>Missões</h2>
        <p className="small">Conclua níveis para liberar os próximos.</p>

        <div className="levels-grid">
          {Array.from({ length: TOTAL }, (_, i) => i + 1).map((n) => {
            const locked = n > highestUnlocked;        // trava apenas acima do maior liberado
            const done = completedSet.has(n);          // ✓ só quando realmente concluído
            const milestone = [10, 20, 30, 40, 50].includes(n);
            const phase = getPhase(n);

            return (
              <button
                key={n}
                className={`level-card ${phase} ${locked ? "locked" : ""} ${done ? "done" : ""} ${milestone ? "milestone" : ""}`}
                onClick={() => !locked && nav(`/quiz?level=${n}`)}
                title={locked ? "Complete o nível anterior para liberar" : `Entrar no nível ${n}`}
              >
                <div className="level-number">
                  Nível {n} {milestone ? "⭐" : ""}
                </div>
                {locked ? <span className="lock">🔒</span> : done ? <span className="check">✓</span> : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

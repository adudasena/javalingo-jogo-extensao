// src/components/NextLevelButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function NextLevelButton({ nextLevel }) {
  const nav = useNavigate();

  return (
    <div className="next-level-container">
      {/* Javali orbitando o botão */}
      <img
        src="/assets/javalingo-no-foguete.png"
        alt="Javali no foguete"
        className="javali-foguete"
        draggable="false"
      />

      {/* Botão funcional */}
<button
  type="button"
  className="btn-rocket"
  onClick={() => {
    // força o scroll pro topo
    window.scrollTo(0, 0);

    // força o React Router a navegar
    nav(`/quiz?level=${nextLevel}`, { replace: false });

    // fallback de segurança caso o React Router não reaja
    setTimeout(() => {
      if (window.location.pathname !== "/quiz" || !window.location.search.includes(`level=${nextLevel}`)) {
        window.location.href = `/quiz?level=${nextLevel}`;
      }
    }, 150);
  }}
>
  🚀 Próximo Nível ({nextLevel})
  <span className="shine" />
</button>
    </div>
  );
}

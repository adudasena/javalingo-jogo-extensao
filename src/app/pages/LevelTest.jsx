import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import placement from "../data/placement.json";
import { getState, setState } from "../lib/storage";
import QuestionCard from "../components/QuestionCard";
import { completeLevel } from "../state/progress";
import Toast from "../components/Toast";
import "../styles.css";

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function LevelTest() {
  const nav = useNavigate();

  const qs = useMemo(() => {
    try {
      const arr = Array.isArray(placement) ? placement : [];
      return shuffle(arr).slice(0, 7);
    } catch (e) {
      console.error("Erro carregando placement.json", e);
      return [];
    }
  }, []);

  const [idx, setIdx] = useState(-1);
  const [score, setScore] = useState(0);
  const [toast, setToast] = useState(null);
  const s = getState();

  useEffect(() => {
    if (s.levelTestDone) nav("/home");
  }, [s.levelTestDone, nav]);

  function onAnswer(i) {
    const cur = qs[idx];
    if (!cur) return;
    if (i === cur.answerIndex) setScore((v) => v + 1);
    if (idx + 1 < qs.length) setIdx(idx + 1);
    else finish();
  }

  function finish() {
    let level = "beginner";
    if (score >= 6) level = "advanced";
    else if (score >= 3) level = "intermediate";

    const user = s?.user?.name || "demo";
    let end = 1;
    let message = "";

    if (level === "intermediate") {
      end = 10;
      message =
        "Você pode praticar até o nível 10 (iniciante). Seu nível inicial é o 11 (intermediário).";
    } else if (level === "advanced") {
      end = 30;
      message =
        "Você pode praticar até o nível 30 (intermediário). Seu nível inicial é o 31 (avançado).";
    } else {
      message = "Seu nível inicial é o 1 (iniciante). Treine para evoluir!";
    }

    for (let n = 1; n <= end; n++) {
      try {
        completeLevel(n, user);
      } catch (e) {
        console.warn("Erro liberando nível", e);
      }
    }

    setState({ ...s, level, levelTestDone: true });
    localStorage.setItem(`testeFeito_${user}`, "true");
    window.dispatchEvent(new Event("javalingo:state"));

    setToast({
      title: "Nível definido 🎯",
      message,
      variant: "center",
    });

    setTimeout(() => nav("/home"), 2500);
  }

  if (!qs.length)
    return (
      <div className="leveltest-container">
        <div className="card start-card">
          <h2>Erro ao carregar teste</h2>
          <p className="small" style={{ color: "#ef4444" }}>
            Não foi possível carregar as perguntas.
          </p>
        </div>
      </div>
    );

  return (
    <div className="leveltest-container">
      <AnimatePresence mode="wait">
        {idx === -1 ? (
          // ======== TELA DE INTRODUÇÃO ========
          <motion.div
            key="intro"
            className="card start-card"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2
              className="sparkle"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Teste de Nivelamento
            </motion.h2>

            <p className="small" style={{ marginBottom: 12 }}>
              Responda 7 perguntas. No final, definiremos seu nível e liberaremos níveis iniciais.
            </p>

            <ul className="nivelamento-info">
              <li>✔️ 1 pergunta por vez</li>
              <li>⏱️ Sem tempo máximo</li>
              <li>🎯 Melhor desempenho → mais níveis liberados</li>
            </ul>

            <motion.button
              className="btn-rocket"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIdx(0)}
            >
              🚀 Começar agora
              <span className="shine"></span>
            </motion.button>
          </motion.div>
        ) : (
          // ======== TELA DE PERGUNTAS ========
          <motion.div
            key={`question-${idx}`}
            className="card quiz-card"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4 }}
          >
            {qs[idx] && <QuestionCard q={qs[idx]} onAnswer={onAnswer} />}
            <p className="small" style={{ textAlign: "center", opacity: 0.8 }}>
              Progresso: {idx + 1} / {qs.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {toast && (
        <Toast
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
          variant={toast.variant}
        />
      )}
    </div>
  );
}

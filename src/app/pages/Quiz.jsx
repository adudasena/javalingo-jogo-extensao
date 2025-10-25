import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import data from '../data/questions.json';
import QuestionCard from '../components/QuestionCard';
import { getState, setState } from '../lib/storage';
import { completeLevel } from '../state/progress.js';
import { syncUserProgress } from '../lib/syncUser';
import NextLevelButton from "../components/NextLevelButton";

function getQueryLevel(search) {
  const params = new URLSearchParams(search);
  const n = Number(params.get('level'));
  return Number.isFinite(n) && n >= 1 && n <= 50 ? n : 1;
}

export default function Quiz() {
  const location = useLocation();
  const s = getState();
  const [currentLevel, setCurrentLevel] = useState(getQueryLevel(location.search));
  const user = s.user?.name || 'demo';

  // 🔁 Atualiza o nível quando a URL muda
  useEffect(() => {
    setCurrentLevel(getQueryLevel(location.search));
  }, [location.search]);

  const bank = useMemo(() => {
    const byLevel = data.filter(q => q.levelId === currentLevel);
    const fallback = data.filter(q => q.levelId == null);
    return [...byLevel, ...fallback].slice(0, 5);
  }, [currentLevel]);

  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [win, setWin] = useState(0);

  useEffect(() => {
    // 🔁 Reinicia quando muda o nível
    setIdx(0);
    setDone(false);
    setWin(0);
  }, [currentLevel]);

  async function onAnswer(i) {
    const q = bank[idx];
    const wasCorrect = i === q.answerIndex;

    if (wasCorrect) {
      const next = setState({
        coins: s.coins + (q.coins ?? 10),
        xp: s.xp + (q.xp ?? 15),
      });
      s.coins = next.coins;
      s.xp = next.xp;
      await syncUserProgress();
      setWin(w => w + 1);
    }

    const isLast = idx + 1 === bank.length;
    if (!isLast) return setIdx(idx + 1);

    const finalWins = wasCorrect ? win + 1 : win;
    const ratio = finalWins / bank.length;
    const aprovado = ratio >= 0.7;

    if (aprovado) completeLevel(currentLevel, user);
    setDone(true);
  }

  if (done) {
    const ratio = win / bank.length;
    const aprovado = ratio >= 0.7;
    return (
      <div className="container">
        <div className="card quiz-finish-card">
          <h2>Nível {currentLevel} {aprovado ? 'concluído!' : 'não concluído'}</h2>
          <p>Acertos: {win}/{bank.length} ({Math.round(ratio * 100)}%)</p>
          {aprovado ? (
            <>
              <p className="small">Recompensas aplicadas 🎉</p>
              <div className="next-actions">
                <a className="btn btn-ghost" href="/missions">Voltar às missões</a>
                <NextLevelButton nextLevel={currentLevel + 1} />
              </div>
            </>
          ) : (
            <>
              <p className="small">É preciso 70% para passar.</p>
              <a className="btn" href={`/quiz?level=${currentLevel}`}>Tentar novamente</a>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card section-card">
        <h2>Jogar — Nível {currentLevel}</h2>
        <QuestionCard q={bank[idx]} onAnswer={onAnswer} />
        <p className="small">Pergunta {idx + 1} de {bank.length}</p>
      </div>
    </div>
  );
}

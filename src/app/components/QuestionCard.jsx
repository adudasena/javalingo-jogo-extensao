import React, { useState, useEffect } from 'react'

export default function QuestionCard({ q, onAnswer }) {
  const [picked, setPicked] = useState(null)

  //sempre que a pergunta mudar, zera a seleção
  useEffect(() => {
    setPicked(null)
  }, [q])

  if (!q) return null

  function choose(idx) {
    if (picked != null) return
    setPicked(idx)
    setTimeout(() => onAnswer(idx), 450) // dá tempo da animação
  }

  return (
    <div className="question-card">
      <div className="quiz-header">
        <h3 style={{ margin: 0 }}>{q.q}</h3>
      </div>

      <div className="answer-grid">
        {q.options.map((opt, idx) => {
          const isPicked = picked === idx
          const correct = picked != null && idx === q.answerIndex
          const wrong = isPicked && picked !== q.answerIndex
          const cls = [
            'answer-btn',
            correct ? 'correct' : '',
            wrong ? 'wrong' : ''
          ].join(' ').trim()

          return (
            <button
              key={idx}
              className={cls}
              onClick={() => choose(idx)}
              disabled={picked != null}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

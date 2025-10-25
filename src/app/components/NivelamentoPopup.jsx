import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../NivelamentoPopup.css'

export default function NivelamentoPopup({ user, onClose }) {
  const nav = useNavigate()

  function handleStartTest() {
    localStorage.setItem(`testeFeito_${user}`, 'true')
    nav('/leveltest')
  }

  return (
    <div className="nivelamento-popup-backdrop">
      <div className="nivelamento-popup">
        <h2>Antes de começar…</h2>
        <p>Você precisa fazer o teste de nivelamento do JavaLingo!</p>
        <div className="popup-buttons">
          <button className="btn btn-accent" onClick={handleStartTest}>Começar teste</button>
          <button className="btn btn-ghost" onClick={onClose}>Agora não</button>
        </div>
      </div>
    </div>
  )
}

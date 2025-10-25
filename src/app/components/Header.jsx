import React from 'react'
import { Link } from 'react-router-dom'
import CoinCounter from './CoinCounter'
import { getState } from '../lib/storage'
import { levelToLabel } from '../state/levels'

export default function Header(){
  const s = getState()
  const levelLabel = levelToLabel(s.level)

  return (
    <header className="header">
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '8px 20px',
        display:'flex', alignItems:'center', justifyContent:'space-between', gap:12
      }}>
        <nav className="nav nav-centered" style={{flex:1}}>
          <Link to="/home">Início</Link>
          <Link to="/missions">Jogar as missões</Link>
          <Link to="/shop">Loja De Skins</Link>
          <Link to="/profile">Meu Perfil</Link>
        </nav>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <span className="badge">Nível: {levelLabel}</span>
          <CoinCounter coins={s.coins ?? 0} />
        </div>
      </div>
    </header>
  )
}
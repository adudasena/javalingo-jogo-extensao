import React from 'react'
import skins from '../data/skins.json'

// mapeia ids
const SKIN_ASSETS = {
  classic: 'assets/javalingoimagem.png',
  flamejante: 'assets/javali-fogo-mascote.png',
  comp_unifil: 'assets/javalingo-compunifil.png',
  unifil: 'assets/javalingo-unifil.png',
  hacker: 'assets/javalingo-hacker.png',
  console_log_magic:'assets/javalingo-console.log.magic.png',
  suporte_tecnico:'assets/javalingo-suporte-tecnico.png',
  javali_404:'assets/javalingo-404.png',
  maromba:'assets/javalingo-maromba.png',
  dev_senior: 'assets/javalingo-devsenior.png',
  universitario: 'assets/javalingo-universitario.png' ,
  malandro: 'assets/javalingo-malandro.png'
}

export default function Mascot({ skin = 'classic', size = 120 }) {
  const src = SKIN_ASSETS[skin] || SKIN_ASSETS.classic
  const skinData = Array.isArray(skins) ? skins.find(sk => sk.id === skin) : null
  const displayName = skinData ? skinData.name : `Mascote ${skin}`

  return (
    <div style={{ textAlign: 'center' }}>
      <img
        src={src}
        alt={displayName}
        onError={(e) => {
          console.warn('Imagem não encontrada para', skin, '→ usando classic')
          e.currentTarget.src = SKIN_ASSETS.classic
        }}
        style={{ width: size, height: size, objectFit: 'contain' }}
      />
    </div>
  )
}

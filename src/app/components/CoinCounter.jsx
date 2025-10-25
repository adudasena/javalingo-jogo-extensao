import React from 'react'

export default function CoinCounter({ coins = 0, size = 22 }) {
  return (
    <span
      className="coin-badge"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 10px',
        borderRadius: 999,
        background: 'rgba(255,255,255,.06)',
        border: '1px solid rgba(255,255,255,.12)',
        fontWeight: 900
      }}
    >
      <img
        src="/assets/coin.png"
        alt="Moeda JavaLingo"
        width={size}
        height={size}
        style={{ display: 'block' }}
        onError={(e) => { e.currentTarget.src = '/coin.png' }}
      />
      {coins} JavaCoins
    </span>
  )
}
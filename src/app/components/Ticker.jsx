import React from "react";

export default function Ticker() {
  return (
    <div className="ticker">
      <div className="track">
        <span>
          💡 Dica: pratique todos os dias · 🏆 Complete missões para ganhar XP ·
          <img
            alt="JavaCoin"
            width="16"
            height="16"
            className="coin-inline"
            src="/assets/coin.png"
          />
          Troque JavaCoins por skins · 🚀 Continue evoluindo no JavaLingo!
        </span>
      </div>
    </div>
  );
}

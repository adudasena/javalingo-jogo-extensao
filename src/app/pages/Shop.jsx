// src/pages/Shop.jsx
import React, { useState } from "react";
import skins from "../data/skins.json";
import Mascot from "../components/Mascot";
import { getState, setState } from "../lib/storage";
import { syncUserProgress } from "../lib/syncUser";

export default function Shop() {
  const [session, setSession] = useState(getState());
  const items = Array.isArray(skins) ? skins : [];
  const [toast, setToast] = useState(null);
  const [busy, setBusy] = useState(false);

  function refresh() {
    setSession(getState());
    window.dispatchEvent(new Event("javalingo:state"));
  }

  function showToast(title, body) {
    setToast({ title, body });
    setTimeout(() => setToast(null), 3000);
  }

  async function buy(id, price) {
    if (busy) return;
    setBusy(true);

    try {
      const s = getState();
      const ownedSkins = s.ownedSkins ?? [];

      // já tenho? só ativa
      if (ownedSkins.includes(id)) {
        await setActive(id);
        showToast("Skin ativada!", "Você já possuía essa skin, ativamos pra você.");
        return;
      }

      // saldo insuficiente
      if ((s.coins ?? 0) < price) {
        showToast("Moedas insuficientes 💰", "Jogue para ganhar mais!");
        return;
      }

      // 💾 Atualiza localmente e mantém user
      const newData = {
        user: s.user, // 👈 mantém referência do usuário
        coins: (s.coins ?? 0) - price,
        ownedSkins: [...ownedSkins, id],
        activeSkin: id,
      };

      setState(newData);
      refresh();

      // 🔄 Sincroniza com Firestore
      await syncUserProgress();

      const sk = items.find((x) => x.id === id);
      showToast("Compra concluída 🎉", `Você conquistou: ${sk?.name || id}!`);
    } catch (err) {
      console.error("Erro ao comprar skin:", err);
      showToast("Erro", "Falha ao processar a compra.");
    } finally {
      setBusy(false);
    }
  }

  async function setActive(id) {
    if (session.activeSkin === id) return;

    try {
      const s = getState();
      setState({ user: s.user, activeSkin: id });
      refresh();
      await syncUserProgress();

      const sk = items.find((x) => x.id === id);
      showToast("Skin ativada", `${sk?.name || id} agora está ativa.`);
    } catch (err) {
      console.error("Erro ao ativar skin:", err);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Loja de Skins</h2>

        <p
          className="small"
          style={{ display: "flex", alignItems: "center", gap: 6 }}
        >
          <img
            src="/assets/coin.png"
            alt="Moeda JavaLingo"
            width="18"
            height="18"
          />
          {session.coins ?? 0}
        </p>

        {items.length === 0 ? (
          <div className="card" style={{ marginTop: 12 }}>
            <p>Nenhum item encontrado.</p>
            <p className="small">
              Verifique se <code>src/data/skins.json</code> é um array válido e
              se os PNGs estão em <code>/public/assets/</code>.
            </p>
          </div>
        ) : (
          <div className="list">
            {items.map((sk) => {
              const owned = session.ownedSkins?.includes(sk.id);
              const active = session.activeSkin === sk.id;
              const canBuy = (session.coins ?? 0) >= sk.price;

              return (
                <div className="card" key={sk.id}>
                  <div className="skin-header">
                    <Mascot skin={sk.id} size={140} />
                    <h3>{sk.name}</h3>
                    <p className="small">{sk.description}</p>
                  </div>

                  <div className="skin-price-row">
                    <img
                      src="/assets/coin.png"
                      alt="Moeda JavaLingo"
                      width="18"
                      height="18"
                    />
                    <span>{sk.price}</span>
                  </div>

                  {owned ? (
                    <button
                      className="btn"
                      onClick={() => setActive(sk.id)}
                      disabled={active || busy}
                      title={active ? "Já está ativa" : "Ativar esta skin"}
                    >
                      {active ? "Ativo" : "Ativar"}
                    </button>
                  ) : (
                    <button
                      className="btn btn-accent"
                      onClick={() => buy(sk.id, sk.price)}
                      disabled={!canBuy || busy}
                      title={
                        canBuy
                          ? "Comprar esta skin"
                          : "Moedas insuficientes"
                      }
                    >
                      {canBuy ? "Comprar" : "Sem moedas"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {toast && (
        <div
          style={{
            position: "fixed",
            right: 16,
            bottom: 16,
            zIndex: 99,
            maxWidth: 340,
          }}
        >
          <div
            className="card"
            style={{
              padding: 14,
              border: "1px solid rgba(255,255,255,.18)",
              boxShadow: "0 14px 34px rgba(0,0,0,.35)",
            }}
          >
            <strong style={{ display: "block", marginBottom: 6 }}>
              {toast.title}
            </strong>
            <span className="small">{toast.body}</span>
            <div style={{ marginTop: 10, textAlign: "right" }}>
              <button className="btn btn-ghost" onClick={() => setToast(null)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

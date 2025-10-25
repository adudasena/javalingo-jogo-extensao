import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import Mascot from "../components/Mascot";
import Toast from "../components/Toast";

export default function Signup() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [toast, setToast] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    if (!name.trim()) return setErr("Informe seu nome.");
    if (!email.trim() || !email.includes("@")) return setErr("Informe um e-mail válido.");
    if (pass.length < 6) return setErr("A senha precisa ter pelo menos 6 caracteres.");
    if (pass !== confirm) return setErr("As senhas não conferem.");

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);

      await updateProfile(cred.user, { displayName: name });

      await setDoc(doc(db, "users", cred.user.uid), {
        name,
        email,
        xp: 0,
        coins: 0,
        level: 1,
        skins: ["classic"],
        createdAt: new Date(),
      });

      // ✅ Toast centralizado e com duração maior
      setToast({
        title: "Conta criada 🎉",
        message: "Agora faça login para começar sua jornada!",
        variant: "center",
      });

      // Espera o aviso aparecer antes de ir pro login
      setTimeout(() => nav("/login"), 2000);
    } catch (error) {
      console.error("Erro Firebase:", error.code, error.message);

      switch (error.code) {
        case "auth/email-already-in-use":
          setErr("Este e-mail já está em uso.");
          break;
        case "auth/invalid-email":
          setErr("E-mail inválido.");
          break;
        case "auth/weak-password":
          setErr("A senha é muito fraca.");
          break;
        default:
          setErr("Erro ao criar conta. Tente novamente.");
      }
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 420, margin: "20px auto" }}>
        <h1 className="header-title">Criar conta</h1>
        <div style={{ display: "grid", placeItems: "center", margin: "14px 0 18px" }}>
          <div className="avatar">
            <Mascot skin="classic" size={140} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="input-row">
          {err && (
            <p className="small" style={{ color: "crimson", textAlign: "center", marginBottom: 8 }}>
              {err}
            </p>
          )}
          <input
            className="input"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input"
            placeholder="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input"
            placeholder="Senha (mín. 6)"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          <input
            className="input"
            placeholder="Confirmar senha"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <button
            className="btn btn-primary btn-full btn-lg"
            disabled={!name.trim() || !email.trim() || !pass || !confirm}
          >
            Cadastrar
          </button>
          <p className="small" style={{ textAlign: "center", marginTop: 12 }}>
            Já tem conta? <Link to="/login">Entrar</Link>
          </p>
        </form>
      </div>

      {/* ✅ Renderização correta do Toast com variant */}
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

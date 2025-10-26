// src/app/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, loadOrCreateUserData } from "../lib/firebase";
import { fetchUserProgress } from "../lib/syncUser";
import { setState, getState } from "../lib/storage";
import Mascot from "../components/Mascot";
import BackgroundFX from "../components/BackgroundFX";
import { resetPassword } from "../lib/firebase";
import PopupMessage from "../components/PopupMessage";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      console.log("🔹 Tentando login com:", email);

      // 🔐 Login no Firebase Auth
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const user = cred.user;
      console.log("✅ Usuário autenticado:", user.uid);

      // 🔄 Carrega ou cria dados no Firestore
      await loadOrCreateUserData(user);

      // 🩵 FORÇA o UID no estado local e localStorage (garantia extra)
      const s = getState();
      if (!s.user?.uid) {
        setState({
          user: {
            uid: user.uid,
            name: s.user?.name || user.displayName || user.email.split("@")[0],
            email: user.email,
          },
        });
        localStorage.setItem(
          "javalingoUser",
          JSON.stringify({
            ...s,
            user: {
              uid: user.uid,
              name: s.user?.name || user.displayName || user.email.split("@")[0],
              email: user.email,
            },
          })
        );
        console.log("✅ UID forçado no estado:", user.uid);
      }

      // 🔁 Sincroniza progresso (agora com UID garantido)
      await fetchUserProgress();

      // 🚀 Redireciona após sincronizar tudo
      nav("/home");
    } catch (error) {
      console.error("🔥 Erro Firebase:", error.code, error.message);

      switch (error.code) {
        case "auth/user-not-found":
          setErr("Usuário não encontrado.");
          break;
        case "auth/wrong-password":
          setErr("Senha incorreta.");
          break;
        case "auth/invalid-credential":
        case "auth/invalid-login-credentials":
          setErr("E-mail ou senha incorretos.");
          break;
        case "auth/too-many-requests":
          setErr("Muitas tentativas. Tente novamente mais tarde.");
          break;
        case "auth/network-request-failed":
          setErr("Erro de conexão. Verifique sua internet.");
          break;
        default:
          setErr("Erro ao fazer login. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
  if (!email.trim()) {
    setPopup("Digite seu e-mail no campo acima antes de redefinir a senha.");
    return;
  }
  try {
    await resetPassword(email);
    setPopup(`📩 Um link de redefinição foi enviado para ${email}. Verifique sua caixa de entrada.`);
  } catch (err) {
    console.error("Erro ao enviar e-mail de redefinição:", err);
    setPopup("Erro ao enviar o e-mail. Verifique se o e-mail está correto.");
  }
}

  return (
    <div className="page login-page">
      <BackgroundFX variant="login" />
      <div className="container">
        <div className="card login-card" style={{ maxWidth: 420, margin: "40px auto" }}>
          <h1 className="header-title" style={{ textAlign: "center" }}>JavaLingo</h1>

          <div style={{ display: "grid", placeItems: "center", margin: "18px 0 22px" }}>
            <div className="avatar"><Mascot skin="classic" size={160} /></div>
          </div>

          <form onSubmit={handleSubmit} className="input-row">
            {err && (
              <p className="small" style={{ color: "crimson", textAlign: "center", marginBottom: 8 }}>
                {err}
              </p>
            )}

            <input
              className="input"
              placeholder="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <input
              className="input"
              placeholder="Senha"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              autoComplete="current-password"
              required
            />

            <button
              className="btn btn-accent btn-full btn-lg"
              disabled={!email.trim() || !pass || loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

<p className="small" style={{ textAlign: "center", marginTop: 8 }}>
  <button className="btn btn-link" type="button" onClick={handleResetPassword}>
    Esqueci minha senha
  </button>
</p>

            <p className="small" style={{ textAlign: "center", marginTop: 10 }}>
              <Link to="/signup" className="btn btn-ghost">Cadastrar-se</Link>
            </p>
          </form>
          {popup && <PopupMessage message={popup} onClose={() => setPopup("")} />}
        </div>
      </div>
    </div>
  );
}

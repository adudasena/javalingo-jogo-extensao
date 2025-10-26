// src/app/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { setState } from "./storage";
import { sendPasswordResetEmail } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 🔹 Inicializa Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
auth.languageCode = "pt-BR";

export async function loadOrCreateUserData(user) {
  if (!user?.uid) {
    console.error("❌ Nenhum usuário recebido no loadOrCreateUserData()");
    return;
  }

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  let data;

  if (!snap.exists()) {
    // 🆕 Cria o documento com estrutura inicial
    data = {
      uid: user.uid,
      name: user.displayName || user.email.split("@")[0],
      email: user.email,
      coins: 0,
      xp: 0,
      level: 1,
      ownedSkins: ["classic"],
      activeSkin: "classic",
      levelTestDone: false,
      createdAt: new Date(),
    };

    await setDoc(ref, data);
    console.log("🆕 Documento criado para:", user.email);
  } else {
    // 📦 Documento existente
    data = snap.data();

    // 👇 Corrige eventuais campos ausentes
    data.coins ??= 0;
    data.xp ??= 0;
    data.level ??= 1;
    data.ownedSkins ??= ["classic"];
    data.activeSkin ??= "classic";
    data.levelTestDone ??= false;

    // Atualiza se tiver algo faltando
    await setDoc(ref, data, { merge: true });
    console.log("📥 Documento existente carregado e atualizado:", data);
  }

  // 💾 Atualiza o estado global com UID incluso
  const fullUser = {
    uid: user.uid,
    name: data.name,
    email: data.email,
    loggedIn: true,
  };

  setState({
    user: fullUser,
    coins: data.coins,
    xp: data.xp,
    level: data.level,
    ownedSkins: data.ownedSkins,
    activeSkin: data.activeSkin,
    levelTestDone: data.levelTestDone,
  });

  localStorage.setItem("javalingoUser", JSON.stringify({
    ...data,
    uid: user.uid, // 🔥 garante o UID salvo localmente
  }));

  window.dispatchEvent(new Event("javalingo:state"));
  console.log("✅ Estado global atualizado com UID:", user.uid);
}

export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("❌ Erro ao redefinir senha:", error.code, error.message);

    switch (error.code) {
      case "auth/user-not-found":
        alert("Usuário não encontrado. Verifique o e-mail digitado.");
        break;
      case "auth/invalid-email":
        alert("E-mail inválido. Digite um e-mail válido.");
        break;
      default:
        alert("Erro ao enviar e-mail de redefinição. Tente novamente mais tarde.");
    }
  }
}

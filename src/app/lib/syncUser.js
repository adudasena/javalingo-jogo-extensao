// src/app/lib/syncUser.js
import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getState, setState } from "./storage";

/**
 * 🔁 Envia o progresso local do usuário para o Firestore
 */
export async function syncUserProgress() {
  const s = getState();
  const user = s.user;

  console.log("📡 Tentando sincronizar progresso para:", user);

  // 🚨 Verifica se há UID válido
  if (!user || !user.uid) {
    console.warn("⚠️ Nenhum UID encontrado — abortando sincronização.");
    return;
  }

  try {
    const ref = doc(db, "users", user.uid);

    // 🔹 Campos que podem mudar durante o jogo
    const dataToSave = {
      coins: s.coins ?? 0,
      xp: s.xp ?? 0,
      level: s.level ?? 1,
      ownedSkins: s.ownedSkins ?? ["classic"],
      activeSkin: s.activeSkin ?? "classic",
      levelTestDone: s.levelTestDone ?? false,
      updatedAt: new Date(),
    };

    // 🔥 Atualiza apenas campos mutáveis (sem sobrescrever o documento todo)
    await updateDoc(ref, dataToSave);
    console.log("✅ Progresso sincronizado com sucesso:", dataToSave);
  } catch (err) {
    // 🆕 Se o documento ainda não existe, cria
    if (err.code === "not-found" || err.message?.includes("No document to update")) {
      const ref = doc(db, "users", user.uid);
      const newData = {
        uid: user.uid,
        email: user.email,
        name: user.name,
        coins: s.coins ?? 0,
        xp: s.xp ?? 0,
        level: s.level ?? 1,
        ownedSkins: s.ownedSkins ?? ["classic"],
        activeSkin: s.activeSkin ?? "classic",
        levelTestDone: s.levelTestDone ?? false,
        createdAt: new Date(),
      };
      await setDoc(ref, newData);
      console.log("🆕 Documento criado com progresso inicial:", newData);
    } else {
      console.error("❌ Erro ao sincronizar progresso:", err);
    }
  }
}

/**
 * 📥 Recupera o progresso salvo do usuário e aplica ao estado global
 */
export async function fetchUserProgress() {
  const s = getState();
  const user = s.user;

  console.log("📥 Buscando progresso do usuário:", user);

  if (!user || !user.uid) {
    console.warn("⚠️ Nenhum UID encontrado ao buscar progresso — cancelando.");
    return;
  }

  try {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();

      // ✅ Garante que todos os campos obrigatórios existam
      data.coins ??= 0;
      data.xp ??= 0;
      data.level ??= 1;
      data.ownedSkins ??= ["classic"];
      data.activeSkin ??= "classic";
      data.levelTestDone ??= false;

      // 💾 Atualiza estado e localStorage
      setState({
        user: { uid: data.uid, name: data.name, email: data.email },
        coins: data.coins,
        xp: data.xp,
        level: data.level,
        ownedSkins: data.ownedSkins,
        activeSkin: data.activeSkin,
        levelTestDone: data.levelTestDone,
      });

      localStorage.setItem("javalingoUser", JSON.stringify(data));
      window.dispatchEvent(new Event("javalingo:state"));

      console.log("✅ Progresso carregado e aplicado:", data);
    } else {
      console.log("⚠️ Nenhum progresso encontrado no Firestore para:", user.email);
    }
  } catch (err) {
    console.error("❌ Erro ao buscar progresso:", err);
  }
}

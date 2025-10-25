const KEY = 'javalingo_v1';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
  catch { return {}; }
}

function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getState(){
  const s = load();
  return {
    user: s.user || null,
    level: s.level || null,
    coins: s.coins ?? 0,
    xp: s.xp ?? 0,
    ownedSkins: s.ownedSkins || ['classic'],
    activeSkin: s.activeSkin || 'classic',
    progress: s.progress || { beginner: 0, intermediate: 0, advanced: 0 },
  };
}

export function setState(patch) {
  const current = getState();

  // 🔹 Se o patch traz user, preserva o UID anterior
  if (patch.user) {
    patch.user = {
      ...current.user,
      ...patch.user,
      uid: patch.user.uid || current.user?.uid || null,
    };
  }

  const merged = { ...current, ...patch };
  localStorage.setItem(KEY, JSON.stringify(merged));
  window.dispatchEvent(new Event("javalingo:state"));
  return merged;
}

// 🔄 Reseta todo o progresso local (para logout ou reinício completo)
export function reset() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("javalingo:state"));
}
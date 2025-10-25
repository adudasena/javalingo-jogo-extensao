const KEY = "javalingo_progress_v1";

function loadAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

function saveAll(all) {
  localStorage.setItem(KEY, JSON.stringify(all));
}

/**
 * 📊 Retorna o progresso do usuário (níveis concluídos e maior desbloqueado)
 */
export function getProgress(user = "demo") {
  const all = loadAll();
  if (!all[user]) {
    all[user] = { highestUnlocked: 1, completed: [] }; // começa no nível 1
    saveAll(all);
  }
  return all[user];
}

/**
 * 🏆 Marca um nível como concluído e libera o próximo
 */
export function completeLevel(level, user = "demo") {
  const all = loadAll();
  const p = getProgress(user);

  // Garante que não repete nível concluído
  if (!p.completed.includes(level)) {
    p.completed.push(level);
  }

  // 🔓 Libera o próximo nível sempre que o atual for o mais alto alcançado
  if (p.highestUnlocked <= level && level < 50) {
    p.highestUnlocked = level + 1;
  }

  // 🔁 Salva e retorna
  all[user] = p;
  saveAll(all);
  console.log(`✅ ${user} concluiu nível ${level}, agora liberado até ${p.highestUnlocked}`);
  return p;
}

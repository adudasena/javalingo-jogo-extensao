// src/lib/api.js

// ---- Mock no localStorage ----
const KEY = 'mockUsers';

function loadUsers() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}
function saveUsers(arr) { localStorage.setItem(KEY, JSON.stringify(arr)); }

// garante usuário demo
function ensureDemo() {
  const users = loadUsers();
  const hasDemo = users.some(u =>
    u.name?.toLowerCase() === 'demo' || u.email?.toLowerCase() === 'demo@demo'
  );
  if (!hasDemo) {
    users.push({
      id: users.length ? Math.max(...users.map(x => x.id)) + 1 : 1,
      name: 'demo',
      email: 'demo@demo',
      pass_hash: '123456',
      created_at: new Date().toISOString()
    });
    saveUsers(users);
  }
}

function mockSignup({ name, email, pass } = {}) {
  ensureDemo();
  const users = loadUsers();

  if (!name?.trim() || !email?.trim() || !pass?.trim()) { throw new Error('Dados inválidos.'); }
  if (pass.length < 6) { throw new Error('Senha curta.'); }
  if (users.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) { throw new Error('E-mail já cadastrado.'); }
  if (users.some(u => u.name.toLowerCase() === name.trim().toLowerCase())) { throw new Error('Nome já cadastrado.'); }

  const u = {
    id: users.length ? Math.max(...users.map(x => x.id)) + 1 : 1,
    name: name.trim(),
    email: email.trim(),
    pass_hash: pass,
    created_at: new Date().toISOString()
  };
  users.push(u); saveUsers(users);
  const pub = (({ id, name, email, created_at }) => ({ id, name, email, created_at }))(u);
  return { ok: true, user: pub };
}

function mockLogin(payload = {}) {
  ensureDemo();
  const { email, name, nameOrEmail, pass } = payload;
  const ident = (email || name || nameOrEmail || '').trim().toLowerCase();
  if (!ident || !pass) throw new Error('Informe usuário/e-mail e senha.');

  const users = loadUsers();
  const u = users.find(x =>
    x.email.toLowerCase() === ident || x.name.toLowerCase() === ident
  );
  if (!u || u.pass_hash !== pass) throw new Error('Credenciais inválidas.');

  const pub = (({ id, name, email, created_at }) => ({ id, name, email, created_at }))(u);
  return { ok: true, user: pub };
}

// ---- API só com mock ----
async function request(method, path, body) {
  if (path.includes('/api/signup') && method.toUpperCase() === 'POST') {
    return mockSignup(body || {});
  }
  if (path.includes('/api/login') && method.toUpperCase() === 'POST') {
    return mockLogin(body || {});
  }
  throw new Error(`Rota ${method} ${path} não suportada no modo mock.`);
}

export const Api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
};

const BASE_URL = 'http://192.168.0.5:8080/api';

export const api = {
  login: async (telefone, senha) => {
    const res = await fetch(`${BASE_URL}/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telefone, senha }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.erro || 'Erro ao fazer login');
    return data;
  },

  cadastrar: async (usuario) => {
    const res = await fetch(`${BASE_URL}/usuarios/cadastrar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.erro || 'Erro ao cadastrar');
    return data;
  },

  atualizarAnamnese: async (id, dados) => {
    const res = await fetch(`${BASE_URL}/usuarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
    return res.json();
  },

  listarExercicios: async () => {
    const res = await fetch(`${BASE_URL}/exercicios`);
    return res.json();
  },

  gerarTreinoIA: async (usuarioId) => {
    const res = await fetch(`${BASE_URL}/treinos/gerar/${usuarioId}`, {
      method: 'POST',
    });
    return res.json();
  },

  buscarTreinoHoje: async (usuarioId) => {
    const res = await fetch(`${BASE_URL}/treinos/hoje/${usuarioId}`);
    return res.json();
  },

  concluirTreino: async (treinoId) => {
    const res = await fetch(`${BASE_URL}/treinos/${treinoId}/concluir`, {
      method: 'PATCH',
    });
    return res.json();
  },
};
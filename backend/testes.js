import http from 'k6/http';
import { sleep, check } from 'k6';

// Configuração das fases do teste (Carga e Estresse)
export const options = {
    stages: [
        // 1. FASE DE CARGA (Load Test) - Sobe gradualmente até 20 usuários
        { duration: '30s', target: 20 },
        { duration: '1m', target: 20 },  // Mantém 20 usuários por 1 minuto

        // 2. FASE DE ESTRESSE (Stress Test) - Pico repentino de 100 usuários
        { duration: '30s', target: 100 },
        { duration: '1m', target: 100 }, // Segura o pico por 1 minuto

        // 3. RECUPERAÇÃO - Zera os usuários
        { duration: '30s', target: 0 },
    ],
};

// Ação que cada usuário virtual vai executar
export default function () {
    const url = 'http://localhost:8080/api/usuarios/cadastrar';

    // Gera um email dinâmico usando o ID do usuário virtual (__VU) e a iteração (__ITER)
    // Isso evita erro de "email duplicado" caso você coloque validações no banco depois
    const payload = JSON.stringify({
        nome: 'Cauã Teste',
        email: `caua.performance.${__VU}.${__ITER}@uninassau.com`,
        senha: 'senha_segura123'
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(url, payload, params);

    // Valida se o Spring Boot respondeu com sucesso (HTTP 200)
    check(res, {
        'Cadastro realizado (status 200)': (r) => r.status === 200,
    });

    sleep(1);
}
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 30 },  // Carga inicial: sobe para 30 usuários simultâneos
        { duration: '1m',  target: 100 }, // Estresse máximo: mantém 100 usuários gravando no MySQL
        { duration: '30s', target: 100 }, // Sustentação no pico de estresse
        { duration: '30s', target: 0 },   // Desaceleração (Ramp-down)
    ],
    thresholds: {
        http_req_failed: ['rate<0.01'],   // Taxa de erro abaixo de 1%
        http_req_duration: ['p(95)<200'], // 95% das requisições respondidas em menos de 200ms
    },
};

const URL = 'http://localhost:8080/api/usuarios/cadastrar';
const params = {
    headers: { 'Content-Type': 'application/json' },
};

export default function () {
    // Gera telefone único por VU e iteração para respeitar a constraint UNIQUE do MySQL
    const rand = Math.floor(Math.random() * 1000000);
    const telefone = `799${String(__VU).padStart(2, '0')}${String(rand).padStart(6, '0')}`;

    const payload = JSON.stringify({
        nome: `Aluno 50+ Estresse ${__VU}-${__ITER}`,
        telefone: telefone,
        dataNascimento: '1965-08-20',
        sexo: 'Feminino',
        senha: 'Senha@123',
    });

    const res = http.post(URL, payload, params);

    check(res, {
        'Cadastro persistido no MySQL (status 200)': (r) => r.status === 200,
    });

    sleep(0.2);
}
import http from 'k6/http';
import { check, group } from 'k6';

export const options = {
    vus: 1,
    iterations: 1, // Executa 1 jornada completa passo a passo para validar integração entre módulos
    thresholds: {
        checks: ['rate==1.00'], // Exige 100% de aprovação em todas as etapas integradas
    },
};

const BASE_URL = 'http://localhost:8080/api';
const params = { headers: { 'Content-Type': 'application/json' } };

export default function () {
    const uniqueSuffix = Date.now();
    const telefone = `799${String(uniqueSuffix).slice(-8)}`;
    const senha = 'SenhaSegura@50';
    let usuarioId;
    let treinoId;

    group('1. Módulo de Usuários (Cadastro e Login)', () => {
        const resCadastro = http.post(
            `${BASE_URL}/usuarios/cadastrar`,
            JSON.stringify({
                nome: 'Carlos Alberto',
                telefone: telefone,
                dataNascimento: '1962-04-12',
                sexo: 'Masculino',
                senha: senha,
            }),
            params
        );

        check(resCadastro, {
            'Cadastro retorna 200 e gera ID': (r) => r.status === 200 && r.json('id') !== undefined,
        });
        usuarioId = resCadastro.json('id');

        const resLogin = http.post(
            `${BASE_URL}/usuarios/login`,
            JSON.stringify({ telefone: telefone, senha: senha }),
            params
        );

        check(resLogin, {
            'Login autentica usuário recém-cadastrado': (r) => r.status === 200 && r.json('id') === usuarioId,
        });
    });

    group('2. Módulo de Anamnese (Persistência de Limitação Física)', () => {
        const resAnamnese = http.put(
            `${BASE_URL}/usuarios/${usuarioId}`,
            JSON.stringify({
                peso: 82.0,
                altura: 1.75,
                objetivo: 'Fortalecimento e Equilíbrio',
                nivelExperiencia: 'Iniciante',
                diasSemana: '3 dias',
                tempoDisponivel: '30 minutos',
                tipoExercicio: 'Funcional Leve',
                limitacao: 'joelho',
                observacao: 'Sensibilidade no joelho direito',
            }),
            params
        );

        check(resAnamnese, {
            'Anamnese salva limitação no MySQL': (r) => r.status === 200 && r.json('limitacao') === 'joelho',
        });
    });

    group('3. Módulo de Catálogo de Exercícios', () => {
        const resExercicios = http.get(`${BASE_URL}/exercicios`);
        check(resExercicios, {
            'Catálogo retorna lista populada pelo DataInitializer': (r) => r.status === 200 && r.json().length >= 6,
        });
    });

    group('4. Módulo de Treinos IA (Integração Anamnese + Catálogo)', () => {
        const resGerar = http.post(`${BASE_URL}/treinos/gerar/${usuarioId}`, null, params);
        const treino = resGerar.json();
        treinoId = treino.id;

        // Verifica se nenhum exercício contraindicado para "joelho" foi incluído
        const temContraIndicacao = treino.exercicios.some(
            (ex) => ex.contraIndicacao && ex.contraIndicacao.toLowerCase().includes('joelho')
        );

        check(resGerar, {
            'Treino gerado com sucesso (status 200)': (r) => r.status === 200,
            'Filtro de segurança excluiu exercícios para joelho': () => !temContraIndicacao,
        });

        const resHoje = http.get(`${BASE_URL}/treinos/hoje/${usuarioId}`);
        check(resHoje, {
            'Endpoint /hoje retorna o treino recém-criado': (r) => r.status === 200 && r.json('id') === treinoId,
        });

        const resConcluir = http.patch(`${BASE_URL}/treinos/${treinoId}/concluir`, null, params);
        check(resConcluir, {
            'Conclusão de treino atualiza status para true': (r) => r.status === 200 && r.json('concluido') === true,
        });
    });
}
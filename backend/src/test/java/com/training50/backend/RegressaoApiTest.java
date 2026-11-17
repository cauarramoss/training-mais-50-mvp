package com.training50.backend;

import com.training50.backend.model.Usuario;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class RegressaoApiTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Regressão 01: Deve impedir cadastro com telefone duplicado (HTTP 400)")
    void deveBloquearTelefoneDuplicado() throws Exception {
        Usuario u1 = new Usuario();
        u1.setNome("Teste Regressão");
        u1.setTelefone("79988887777");
        u1.setSenha("123456");

        mockMvc.perform(post("/api/usuarios/cadastrar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(u1)))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/usuarios/cadastrar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(u1)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro", is("Telefone já cadastrado!")));
    }

    @Test
    @DisplayName("Regressão 02: Deve bloquear login com senha incorreta (HTTP 401)")
    void deveBloquearLoginInvalido() throws Exception {
        Map<String, String> loginInvalido = Map.of(
                "telefone", "79900000000",
                "senha", "senhaErrada"
        );

        mockMvc.perform(post("/api/usuarios/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginInvalido)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.erro", is("Telefone ou senha inválidos!")));
    }

    @Test
    @DisplayName("Regressão 03: Catálogo de exercícios deve manter carga inicial ativa")
    void deveManterCatalogoExerciciosCarregado() throws Exception {
        mockMvc.perform(get("/api/exercicios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(6))));
    }

    @Test
    @DisplayName("Regressão 04: Geração de treino deve filtrar contraindicações da anamnese")
    void deveFiltrarContraindicacoesAoGerarTreino() throws Exception {
        Usuario u = new Usuario();
        u.setNome("Dona Helena");
        u.setTelefone("79977776666");
        u.setSenha("123");
        u.setObjetivo("Mobilidade");
        u.setLimitacao("joelho");

        String responseJson = mockMvc.perform(post("/api/usuarios/cadastrar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(u)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        Long idCriado = objectMapper.readTree(responseJson).get("id").asLong();

        mockMvc.perform(post("/api/treinos/gerar/" + idCriado))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.exercicios[*].contraIndicacao", not(hasItem("joelho"))));
    }
}
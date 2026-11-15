package com.training50.backend.controller;

import com.training50.backend.model.Exercicio;
import com.training50.backend.model.Treino;
import com.training50.backend.model.Usuario;
import com.training50.backend.repository.ExercicioRepository;
import com.training50.backend.repository.TreinoRepository;
import com.training50.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/treinos")
@CrossOrigin(origins = "*")
public class TreinoController {

    @Autowired
    private TreinoRepository treinoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ExercicioRepository exercicioRepository;

    // 1. Gerar Treino Personalizado com base na Anamnese do Usuário ("Criar Treino com IA")
    @PostMapping("/gerar/{usuarioId}")
    public ResponseEntity<?> gerarTreinoIA(@PathVariable Long usuarioId) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(usuarioId);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Usuário não encontrado."));
        }

        Usuario usuario = usuarioOpt.get();
        String limitacao = usuario.getLimitacao() != null ? usuario.getLimitacao().toLowerCase() : "";
        String objetivo = usuario.getObjetivo() != null ? usuario.getObjetivo() : "Mobilidade e Saúde";

        // Busca todos os exercícios e filtra os que possuem contraindicação compatível com a limitação do usuário
        List<Exercicio> todosExercicios = exercicioRepository.findAll();
        List<Exercicio> seguros = todosExercicios.stream()
                .filter(ex -> {
                    String contra = ex.getContraIndicacao() != null ? ex.getContraIndicacao().toLowerCase() : "nenhuma";
                    if (contra.equals("nenhuma") || limitacao.isEmpty()) return true;
                    return !limitacao.contains(contra);
                })
                .limit(4) // Seleciona 4 exercícios seguros para a sessão do dia
                .collect(Collectors.toList());

        Treino novoTreino = new Treino();
        novoTreino.setUsuario(usuario);
        novoTreino.setTitulo("Treino Adaptado - " + objetivo);
        novoTreino.setFoco(objetivo);
        novoTreino.setDataCriacao(LocalDate.now());
        novoTreino.setConcluido(false);
        novoTreino.setExercicios(seguros);

        Treino salvo = treinoRepository.save(novoTreino);
        return ResponseEntity.ok(salvo);
    }

    // 2. Buscar "Meu Treino de Hoje" (último treino gerado para o usuário)
    @GetMapping("/hoje/{usuarioId}")
    public ResponseEntity<?> buscarTreinoDeHoje(@PathVariable Long usuarioId) {
        return treinoRepository.findFirstByUsuarioIdOrderByIdDesc(usuarioId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.ok(Map.of("mensagem", "Nenhum treino gerado ainda.")));
    }

    // 3. Listar histórico de treinos do usuário
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Treino>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(treinoRepository.findByUsuarioIdOrderByIdDesc(usuarioId));
    }

    // 4. Botão "Finalizar Treino" da tela de Vídeos
    @PatchMapping("/{treinoId}/concluir")
    public ResponseEntity<?> concluirTreino(@PathVariable Long treinoId) {
        return treinoRepository.findById(treinoId).map(treino -> {
            treino.setConcluido(true);
            return ResponseEntity.ok(treinoRepository.save(treino));
        }).orElse(ResponseEntity.notFound().build());
    }
}

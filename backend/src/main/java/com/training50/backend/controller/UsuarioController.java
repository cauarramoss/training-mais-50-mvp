package com.training50.backend.controller;

import com.training50.backend.model.Usuario;
import com.training50.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;

    // 1. Cadastrar novo usuário
    @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastrarUsuario(@RequestBody Usuario usuario) {
        if (repository.findByTelefone(usuario.getTelefone()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("erro", "Telefone já cadastrado!"));
        }
        Usuario salvo = repository.save(usuario);
        return ResponseEntity.ok(salvo);
    }

    // 2. Login com Telefone e Senha
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciais) {
        String telefone = credenciais.get("telefone");
        String senha = credenciais.get("senha");

        Optional<Usuario> usuarioOpt = repository.findByTelefone(telefone);

        if (usuarioOpt.isPresent() && usuarioOpt.get().getSenha().equals(senha)) {
            return ResponseEntity.ok(usuarioOpt.get());
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("erro", "Telefone ou senha inválidos!"));
    }

    // 3. Atualizar dados (Anamnese ou Perfil)
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarUsuario(@PathVariable Long id, @RequestBody Usuario dadosAtualizados) {
        return repository.findById(id).map(usuario -> {
            if (dadosAtualizados.getNome() != null) usuario.setNome(dadosAtualizados.getNome());
            if (dadosAtualizados.getPeso() != null) usuario.setPeso(dadosAtualizados.getPeso());
            if (dadosAtualizados.getAltura() != null) usuario.setAltura(dadosAtualizados.getAltura());
            if (dadosAtualizados.getObjetivo() != null) usuario.setObjetivo(dadosAtualizados.getObjetivo());
            if (dadosAtualizados.getNivelExperiencia() != null) usuario.setNivelExperiencia(dadosAtualizados.getNivelExperiencia());
            if (dadosAtualizados.getDiasSemana() != null) usuario.setDiasSemana(dadosAtualizados.getDiasSemana());
            if (dadosAtualizados.getTempoDisponivel() != null) usuario.setTempoDisponivel(dadosAtualizados.getTempoDisponivel());
            if (dadosAtualizados.getTipoExercicio() != null) usuario.setTipoExercicio(dadosAtualizados.getTipoExercicio());
            if (dadosAtualizados.getLimitacao() != null) usuario.setLimitacao(dadosAtualizados.getLimitacao());
            if (dadosAtualizados.getObservacao() != null) usuario.setObservacao(dadosAtualizados.getObservacao());

            return ResponseEntity.ok(repository.save(usuario));
        }).orElse(ResponseEntity.notFound().build());
    }
}
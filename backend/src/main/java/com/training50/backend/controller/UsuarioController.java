package com.training50.backend.controller;

import com.training50.backend.model.Usuario;
import com.training50.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;

    @PostMapping("/cadastrar")
    public Usuario cadastrarUsuario(@RequestBody Usuario usuario) {
        // Pega o usuário que chegou na requisição e manda o repository salvar no banco
        return repository.save(usuario);
    }
}
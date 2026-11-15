package com.training50.backend.controller;

import com.training50.backend.model.Exercicio;
import com.training50.backend.repository.ExercicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exercicios")
@CrossOrigin(origins = "*")
public class ExercicioController {

    @Autowired
    private ExercicioRepository exercicioRepository;

    // Listar todos os vídeos de exercícios
    @GetMapping
    public ResponseEntity<List<Exercicio>> listarTodos() {
        return ResponseEntity.ok(exercicioRepository.findAll());
    }

    // Filtrar por categoria (ex: Mobilidade, Pernas, Articulações)
    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<Exercicio>> listarPorCategoria(@PathVariable String categoria) {
        return ResponseEntity.ok(exercicioRepository.findByCategoriaIgnoreCase(categoria));
    }

    // Cadastrar novo vídeo de exercício (caso necessário)
    @PostMapping
    public ResponseEntity<Exercicio> cadastrar(@RequestBody Exercicio exercicio) {
        return ResponseEntity.ok(exercicioRepository.save(exercicio));
    }
}
package com.training50.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "exercicios")
public class Exercicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;             // Ex: "Agachamento na Cadeira"
    private String series;           // Ex: "3 x 10"
    private String categoria;        // Ex: "Pernas", "Mobilidade", "Articulações"
    private String nivel;            // Ex: "Iniciante", "Intermediário"
    private String contraIndicacao;  // Ex: "joelho", "ombro", "punho", "nenhuma"
    private String videoUrl;         // Link do vídeo demonstrativo

    @Column(length = 500)
    private String instrucoes;       // Dica de execução segura para público 50+
}
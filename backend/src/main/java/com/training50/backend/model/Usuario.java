package com.training50.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Dados do Cadastro
    private String nome;

    @Column(unique = true, nullable = false)
    private String telefone;

    private String dataNascimento;
    private String sexo;
    private String senha;

    // Dados da Anamnese
    private Double peso;
    private Double altura;
    private String objetivo;
    private String nivelExperiencia;
    private String diasSemana;
    private String tempoDisponivel;
    private String tipoExercicio;
    private String limitacao;

    @Column(length = 500)
    private String observacao;
}
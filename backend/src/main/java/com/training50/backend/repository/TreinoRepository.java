package com.training50.backend.repository;

import com.training50.backend.model.Treino;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TreinoRepository extends JpaRepository<Treino, Long> {
    List<Treino> findByUsuarioIdOrderByIdDesc(Long usuarioId);
    Optional<Treino> findFirstByUsuarioIdOrderByIdDesc(Long usuarioId);
}
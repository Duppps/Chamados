package com.chamados.api.Repositories;

import com.chamados.api.Entities.Cargo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CargoRepository extends JpaRepository<Cargo, Long> {
    Cargo findByName(String name);
    Optional<Cargo> findById(Long id);
}

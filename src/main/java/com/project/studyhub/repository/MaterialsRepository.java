package com.project.studyhub.repository;

import com.project.studyhub.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MaterialsRepository extends JpaRepository<Material, Long> {
    Optional<Material> findByData(String data);
}

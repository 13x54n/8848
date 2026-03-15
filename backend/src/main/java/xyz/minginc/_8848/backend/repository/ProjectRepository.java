package xyz.minginc._8848.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import xyz.minginc._8848.backend.entity.Project;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Project> findByIdAndUserId(Long id, Long userId);

    Optional<Project> findTopByOrderByIdDesc();
}

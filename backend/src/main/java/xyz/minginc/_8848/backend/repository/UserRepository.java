package xyz.minginc._8848.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import xyz.minginc._8848.backend.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByGithubId(String githubId);

    boolean existsByEmail(String email);

    boolean existsByGithubId(String githubId);
}

package xyz.minginc._8848.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import xyz.minginc._8848.backend.repository.UserRepository;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> me(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return userRepository.findByEmail(userDetails.getUsername())
                .map(user -> ResponseEntity.ok(Map.<String, Object>of(
                        "email", user.getEmail(),
                        "githubConnected", user.getGithubId() != null && !user.getGithubId().isBlank()
                )))
                .orElse(ResponseEntity.status(404).build());
    }
}

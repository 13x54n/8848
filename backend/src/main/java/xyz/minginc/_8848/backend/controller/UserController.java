package xyz.minginc._8848.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import xyz.minginc._8848.backend.entity.User;
import xyz.minginc._8848.backend.repository.UserRepository;
import xyz.minginc._8848.backend.service.GithubRepoService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserRepository userRepository;
    private final GithubRepoService githubRepoService;

    public UserController(UserRepository userRepository, GithubRepoService githubRepoService) {
        this.userRepository = userRepository;
        this.githubRepoService = githubRepoService;
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> me(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return userRepository.findByEmail(userDetails.getUsername())
                .map(user -> {
                    Map<String, Object> body = new HashMap<>();
                    body.put("email", user.getEmail());
                    body.put("name", user.getName());
                    body.put("avatarUrl", user.getAvatarUrl());
                    body.put("githubConnected", user.getGithubId() != null && !user.getGithubId().isBlank());
                    return ResponseEntity.ok(body);
                })
                .orElse(ResponseEntity.status(404).build());
    }

    @GetMapping("/repos")
    public ResponseEntity<List<GithubRepoService.RepoInfo>> repos(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String q) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        if (q != null && !q.isBlank()) {
            return githubRepoService.searchReposForUser(userDetails.getUsername(), q)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> githubRepoService.getRecentReposForUser(userDetails.getUsername())
                            .map(ResponseEntity::ok)
                            .orElse(ResponseEntity.status(403).build()));
        }
        return githubRepoService.getRecentReposForUser(userDetails.getUsername())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(403).build());
    }
}

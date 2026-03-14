package xyz.minginc._8848.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import xyz.minginc._8848.backend.entity.User;
import xyz.minginc._8848.backend.repository.UserRepository;

import java.util.*;

@Service
public class GithubRepoService {

    private final UserRepository userRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GithubRepoService(UserRepository userRepository,
                             RestTemplate restTemplate,
                             ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    private static final int TOP_REPOS_LIMIT = 5;

    public Optional<List<RepoInfo>> getRecentReposForUser(String email) {
        return userRepository.findByEmail(email)
                .filter(u -> u.getGithubAccessToken() != null && !u.getGithubAccessToken().isBlank())
                .map(this::fetchTopRepos);
    }

    public Optional<List<RepoInfo>> searchReposForUser(String email, String query) {
        if (query == null || query.isBlank()) {
            return getRecentReposForUser(email);
        }
        return userRepository.findByEmail(email)
                .filter(u -> u.getGithubAccessToken() != null && !u.getGithubAccessToken().isBlank())
                .filter(u -> u.getGithubUsername() != null && !u.getGithubUsername().isBlank())
                .map(u -> searchRepos(u, query.trim()));
    }

    private List<RepoInfo> fetchTopRepos(User user) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(user.getGithubAccessToken());
            headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));

            String url = "https://api.github.com/user/repos?per_page=50&page=1&sort=updated&direction=desc";
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    String.class);

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                return List.of();
            }

            JsonNode repos = objectMapper.readTree(response.getBody());
            if (!repos.isArray()) return List.of();

            List<RepoInfo> all = parseRepoNodes(repos);
            return all.stream()
                    .sorted((a, b) -> Long.compare(b.stargazersCount(), a.stargazersCount()))
                    .limit(TOP_REPOS_LIMIT)
                    .toList();
        } catch (Exception e) {
            return List.of();
        }
    }

    private List<RepoInfo> searchRepos(User user, String query) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(user.getGithubAccessToken());
            headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));

            String searchQ = query + " user:" + user.getGithubUsername();
            String url = "https://api.github.com/search/repositories?q=" + java.net.URLEncoder.encode(searchQ, java.nio.charset.StandardCharsets.UTF_8) + "&per_page=30";
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    String.class);

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                return List.of();
            }

            JsonNode body = objectMapper.readTree(response.getBody());
            JsonNode items = body.has("items") ? body.get("items") : null;
            if (items == null || !items.isArray()) return List.of();

            return parseRepoNodes(items);
        } catch (Exception e) {
            return List.of();
        }
    }

    private List<RepoInfo> parseRepoNodes(JsonNode repos) {
        List<RepoInfo> result = new ArrayList<>();
        for (JsonNode repo : repos) {
            String language = repo.has("language") && !repo.get("language").isNull() ? repo.get("language").asText() : null;
            String name = repo.has("name") ? repo.get("name").asText() : "";
            String desc = repo.has("description") && !repo.get("description").isNull() ? repo.get("description").asText() : "";
            String projectType = detectProjectType(language, name, desc);
            String updatedAt = repo.has("updated_at") && !repo.get("updated_at").isNull() ? repo.get("updated_at").asText() : null;
            long stargazersCount = repo.has("stargazers_count") ? repo.get("stargazers_count").asLong() : 0;
            result.add(new RepoInfo(
                    repo.has("id") ? repo.get("id").asLong() : 0,
                    name,
                    repo.has("full_name") ? repo.get("full_name").asText() : "",
                    repo.has("private") ? repo.get("private").asBoolean() : false,
                    repo.has("html_url") ? repo.get("html_url").asText() : null,
                    repo.has("clone_url") ? repo.get("clone_url").asText() : null,
                    desc.isEmpty() ? null : desc,
                    repo.has("default_branch") ? repo.get("default_branch").asText() : "main",
                    projectType,
                    updatedAt,
                    stargazersCount
            ));
        }
        return result;
    }

    private String detectProjectType(String language, String name, String description) {
        String combined = (name + " " + description).toLowerCase();
        if (combined.contains("next.js") || combined.contains("nextjs")) return "Next.js";
        if (combined.contains("angular")) return "Angular";
        if (combined.contains("react")) return "React";
        if (combined.contains("vue")) return "Vue";
        if (combined.contains("svelte")) return "Svelte";
        if (combined.contains("nuxt")) return "Nuxt";
        if (combined.contains("remix")) return "Remix";
        if (combined.contains("express")) return "Express";
        if (combined.contains("fastapi") || combined.contains("django") || combined.contains("flask")) return "Python";
        if (language != null) {
            switch (language) {
                case "TypeScript", "JavaScript" -> { return "Node.js"; }
                case "Python" -> { return "Python"; }
                case "Java" -> { return "Java"; }
                case "Go" -> { return "Go"; }
                case "Rust" -> { return "Rust"; }
                case "Ruby" -> { return "Ruby"; }
                case "PHP" -> { return "PHP"; }
                case "C#" -> { return "C#"; }
                case "Swift" -> { return "Swift"; }
                case "Kotlin" -> { return "Kotlin"; }
                default -> { return language; }
            }
        }
        return "Other";
    }

    public record RepoInfo(long id, String name, String fullName, boolean isPrivate, String htmlUrl, String cloneUrl, String description, String defaultBranch, String projectType, String updatedAt, long stargazersCount) {}
}

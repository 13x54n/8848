package xyz.minginc._8848.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import xyz.minginc._8848.backend.entity.User;
import xyz.minginc._8848.backend.repository.UserRepository;
import xyz.minginc._8848.backend.security.JwtService;

import java.util.Optional;

@Service
public class GithubOAuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${github.client-id}")
    private String clientId;

    @Value("${github.client-secret}")
    private String clientSecret;

    @Value("${github.redirect-uri}")
    private String redirectUri;

    public GithubOAuthService(UserRepository userRepository, JwtService jwtService,
                             RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public String getAuthorizationUrl(String state) {
        if (clientId == null || clientId.isBlank()) {
            return null;
        }
        return "https://github.com/login/oauth/authorize?client_id=" + clientId
                + "&redirect_uri=" + redirectUri
                + "&scope=user:email,read:user"
                + "&state=" + state;
    }

    public Optional<GithubAuthResult> exchangeCodeForUser(String code) {
        if (clientId == null || clientId.isBlank() || clientSecret == null || clientSecret.isBlank()) {
            return Optional.empty();
        }

        String accessToken = exchangeCodeForToken(code);
        if (accessToken == null) return Optional.empty();

        String email = fetchEmail(accessToken);
        String githubId = fetchGithubId(accessToken);
        if (email == null || githubId == null) return Optional.empty();

        return Optional.of(new GithubAuthResult(email, githubId, accessToken));
    }

    private String exchangeCodeForToken(String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("code", code);
        params.add("redirect_uri", redirectUri);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(
                "https://github.com/login/oauth/access_token", request, String.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            try {
                JsonNode node = objectMapper.readTree(response.getBody());
                return node.has("access_token") ? node.get("access_token").asText() : null;
            } catch (Exception e) {
                return null;
            }
        }
        return null;
    }

    private String fetchEmail(String accessToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));

            ResponseEntity<String> userResponse = restTemplate.exchange(
                    "https://api.github.com/user",
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    String.class);

            if (userResponse.getStatusCode().is2xxSuccessful() && userResponse.getBody() != null) {
                JsonNode user = objectMapper.readTree(userResponse.getBody());
                if (user.has("email") && !user.get("email").isNull()) {
                    return user.get("email").asText();
                }
            }

            ResponseEntity<String> emailsResponse = restTemplate.exchange(
                    "https://api.github.com/user/emails",
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    String.class);

            if (emailsResponse.getStatusCode().is2xxSuccessful() && emailsResponse.getBody() != null) {
                JsonNode emails = objectMapper.readTree(emailsResponse.getBody());
                for (JsonNode emailNode : emails) {
                    if (emailNode.has("primary") && emailNode.get("primary").asBoolean()) {
                        return emailNode.get("email").asText();
                    }
                }
                if (emails.isArray() && emails.size() > 0) {
                    return emails.get(0).get("email").asText();
                }
            }
        } catch (Exception e) {
            // fall through
        }
        return null;
    }

    private String fetchGithubId(String accessToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));

            ResponseEntity<String> response = restTemplate.exchange(
                    "https://api.github.com/user",
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode user = objectMapper.readTree(response.getBody());
                return user.has("id") ? String.valueOf(user.get("id").asLong()) : null;
            }
        } catch (Exception e) {
            // fall through
        }
        return null;
    }

    public User findOrCreateUser(GithubAuthResult result) {
        Optional<User> byGithub = userRepository.findByGithubId(result.githubId());
        if (byGithub.isPresent()) {
            User user = byGithub.get();
            user.setGithubAccessToken(result.accessToken());
            return userRepository.save(user);
        }

        Optional<User> byEmail = userRepository.findByEmail(result.email());
        if (byEmail.isPresent()) {
            User user = byEmail.get();
            user.setGithubId(result.githubId());
            user.setGithubAccessToken(result.accessToken());
            return userRepository.save(user);
        }

        User user = new User();
        user.setEmail(result.email());
        user.setGithubId(result.githubId());
        user.setGithubAccessToken(result.accessToken());
        user.setPassword(""); // GitHub-only users; placeholder for UserDetails
        return userRepository.save(user);
    }

    public void linkGithubToUser(User user, GithubAuthResult result) {
        user.setGithubId(result.githubId());
        user.setGithubAccessToken(result.accessToken());
        userRepository.save(user);
    }

    public record GithubAuthResult(String email, String githubId, String accessToken) {}
}

package xyz.minginc._8848.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import xyz.minginc._8848.backend.dto.AuthResponse;
import xyz.minginc._8848.backend.dto.LoginRequest;
import xyz.minginc._8848.backend.dto.SignupRequest;
import xyz.minginc._8848.backend.entity.User;
import xyz.minginc._8848.backend.repository.UserRepository;
import xyz.minginc._8848.backend.security.JwtService;
import xyz.minginc._8848.backend.service.GithubOAuthService;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final GithubOAuthService githubOAuthService;

    @Value("${frontend.url:http://localhost:4200}")
    private String frontendUrl;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService,
                          AuthenticationManager authenticationManager,
                          GithubOAuthService githubOAuthService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.githubOAuthService = githubOAuthService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    new AuthResponse(null, null, "Email already registered"));
        }

        User user = new User();
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new AuthResponse(token, user.getEmail(), "Signup successful"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));

        String email = authentication.getName();
        String token = jwtService.generateToken(email);

        return ResponseEntity.ok(new AuthResponse(token, email, "Login successful"));
    }

    @GetMapping("/github")
    public void githubAuth(@RequestParam(defaultValue = "login") String state,
                           HttpServletResponse response) throws IOException {
        String url = githubOAuthService.getAuthorizationUrl(state);
        if (url == null) {
            response.sendRedirect(frontendUrl + "/login?error=github_not_configured");
            return;
        }
        response.sendRedirect(url);
    }

    @GetMapping("/github/connect")
    public void githubConnect(@RequestParam String token,
                              HttpServletResponse response) throws IOException {
        try {
            String email = jwtService.extractEmail(token);
            if (email != null && userRepository.existsByEmail(email)) {
                String connectToken = jwtService.generateToken(email, 5 * 60 * 1000); // 5 min
                jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie("github_connect", connectToken);
                cookie.setMaxAge(300);
                cookie.setPath("/");
                cookie.setHttpOnly(true);
                cookie.setSecure(false);
                response.addCookie(cookie);
            }
        } catch (Exception ignored) {}
        String url = githubOAuthService.getAuthorizationUrl("connect");
        if (url == null) {
            response.sendRedirect(frontendUrl + "/dashboard/new-project?error=github_not_configured");
            return;
        }
        response.sendRedirect(url);
    }

    @GetMapping("/github/callback")
    public void githubCallback(@RequestParam String code,
                               @RequestParam(required = false) String state,
                               HttpServletRequest request,
                               HttpServletResponse response) throws IOException {
        Optional<GithubOAuthService.GithubAuthResult> resultOpt = githubOAuthService.exchangeCodeForUser(code);
        if (resultOpt.isEmpty()) {
            response.sendRedirect(frontendUrl + "/login?error=github_auth_failed");
            return;
        }

        GithubOAuthService.GithubAuthResult result = resultOpt.get();

        if ("connect".equals(state)) {
            String connectToken = getConnectTokenFromCookie(request);
            if (connectToken != null) {
                try {
                    String email = jwtService.extractEmail(connectToken);
                    userRepository.findByEmail(email).ifPresent(user ->
                            githubOAuthService.linkGithubToUser(user, result));
                } catch (Exception ignored) {}
            }
            clearConnectCookie(response);
            response.sendRedirect(frontendUrl + "/dashboard/new-project?github=connected");
            return;
        }

        User user = githubOAuthService.findOrCreateUser(result);
        String token = jwtService.generateToken(user.getEmail());

        response.sendRedirect(frontendUrl + "/auth/callback?token=" + token + "&email=" + user.getEmail());
    }

    private String getConnectTokenFromCookie(jakarta.servlet.http.HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        for (jakarta.servlet.http.Cookie c : request.getCookies()) {
            if ("github_connect".equals(c.getName())) return c.getValue();
        }
        return null;
    }

    private void clearConnectCookie(HttpServletResponse response) {
        jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie("github_connect", "");
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);
    }
}

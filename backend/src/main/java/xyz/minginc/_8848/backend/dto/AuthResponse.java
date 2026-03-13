package xyz.minginc._8848.backend.dto;

public record AuthResponse(
        String token,
        String email,
        String message
) {}

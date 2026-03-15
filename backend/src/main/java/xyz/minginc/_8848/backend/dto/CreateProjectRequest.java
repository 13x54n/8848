package xyz.minginc._8848.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateProjectRequest(
        @NotBlank(message = "Project name is required")
        @Size(max = 255)
        String name,

        @NotBlank(message = "Repository URL is required")
        @Size(max = 1024)
        String repoUrl,

        @Size(max = 512)
        String rootDir
) {}

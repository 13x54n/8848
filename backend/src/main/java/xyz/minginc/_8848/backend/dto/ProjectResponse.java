package xyz.minginc._8848.backend.dto;

import xyz.minginc._8848.backend.entity.Project;

import java.time.Instant;

public record ProjectResponse(
        Long id,
        String name,
        String repoUrl,
        String rootDir,
        String projectType,
        String status,
        Integer port,
        Long userId,
        Instant createdAt
) {
    public static ProjectResponse from(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getName(),
                project.getRepoUrl(),
                project.getRootDir(),
                project.getProjectType(),
                project.getStatus(),
                project.getPort(),
                project.getUserId(),
                project.getCreatedAt()
        );
    }
}

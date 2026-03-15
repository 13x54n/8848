package xyz.minginc._8848.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.transport.UsernamePasswordCredentialsProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import xyz.minginc._8848.backend.dto.CreateProjectRequest;
import xyz.minginc._8848.backend.entity.Project;
import xyz.minginc._8848.backend.entity.User;
import xyz.minginc._8848.backend.repository.ProjectRepository;
import xyz.minginc._8848.backend.repository.UserRepository;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.management.ManagementFactory;
import java.net.InetAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import com.sun.management.OperatingSystemMXBean;

@Service
public class ProjectService {

    private static final int PORT_START = 3000;
    private static final int PORT_END = 3999;

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectLogBroadcaster logBroadcaster;
    private final ObjectMapper objectMapper;

    @Value("${projects.base-dir:./data/projects}")
    private String projectsBaseDir;

    @Value("${build.location:Local}")
    private String buildLocation;

    public ProjectService(ProjectRepository projectRepository,
                          UserRepository userRepository,
                          ProjectLogBroadcaster logBroadcaster,
                          ObjectMapper objectMapper) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.logBroadcaster = logBroadcaster;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public Project createProject(CreateProjectRequest request, Long userId) {
        Project project = new Project();
        project.setName(request.name());
        project.setRepoUrl(request.repoUrl());
        project.setRootDir(request.rootDir() != null && !request.rootDir().isBlank() ? request.rootDir() : "");
        project.setStatus("PENDING");
        project.setUserId(userId);
        project.setProjectType("UNKNOWN");

        project = projectRepository.save(project);

        int port = allocatePort();
        project.setPort(port);
        String storageDir = resolveStorageDir(project.getId(), request.name());
        String appRootDir = request.rootDir() != null && !request.rootDir().isBlank()
                ? storageDir + "/" + request.rootDir().trim()
                : storageDir;
        project.setRootDir(appRootDir);
        project = projectRepository.save(project);

        logBroadcaster.registerProject(project.getId());

        Long projectId = project.getId();
        new Thread(() -> runBuildPipeline(projectId)).start();

        return project;
    }

    public Optional<Project> findByIdAndUserId(Long id, Long userId) {
        return projectRepository.findByIdAndUserId(id, userId);
    }

    public List<Project> findByUserId(Long userId) {
        return projectRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    private void runBuildPipeline(Long projectId) {
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project == null) return;

        try {
            emitHostInfo(projectId);
            logBroadcaster.emitLog(projectId, "Starting project setup...");
            project.setStatus("CLONING");
            projectRepository.save(project);

            String rootDir = project.getRootDir();
            String storageDir = rootDir.contains("/") ? rootDir.substring(0, rootDir.indexOf("/")) : rootDir;
            Path cloneTarget = Path.of(projectsBaseDir).resolve(storageDir).normalize();
            Path projectPath = Path.of(projectsBaseDir).resolve(rootDir).normalize();
            Files.createDirectories(cloneTarget.getParent());

            cloneRepo(project.getRepoUrl(), cloneTarget, project.getUserId(), projectId);
            logBroadcaster.emitLog(projectId, "Clone completed.");

            Path packageJsonPath = findPackageJson(projectPath);
            String projectType = identifyProjectType(packageJsonPath, projectId);
            project.setProjectType(projectType);
            project.setStatus("BUILDING");
            projectRepository.save(project);

            logBroadcaster.emitLog(projectId, "Project type: " + projectType);

            runNpmInstall(projectPath, projectId);
            buildAndServe(project, projectPath, projectType, projectId);

            project.setStatus("RUNNING");
            projectRepository.save(project);
            logBroadcaster.emitLog(projectId, "Project is running on port " + project.getPort());
            logBroadcaster.complete(projectId);

        } catch (Exception e) {
            project.setStatus("FAILED");
            projectRepository.save(project);
            logBroadcaster.emitLog(projectId, "Error: " + e.getMessage());
            logBroadcaster.error(projectId, e.getMessage());
        }
    }

    private void cloneRepo(String repoUrl, Path targetPath, Long userId, Long projectId) throws Exception {
        logBroadcaster.emitLog(projectId, "Cloning " + repoUrl + " ...");

        User user = userRepository.findById(userId).orElse(null);
        String token = user != null && user.getGithubAccessToken() != null && !user.getGithubAccessToken().isBlank()
                ? user.getGithubAccessToken()
                : null;

        if (Files.exists(targetPath)) {
            org.eclipse.jgit.util.FileUtils.delete(targetPath.toFile(), org.eclipse.jgit.util.FileUtils.RECURSIVE);
        }

        Git.cloneRepository()
                .setURI(repoUrl)
                .setDirectory(targetPath.toFile())
                .setCredentialsProvider(token != null
                        ? new UsernamePasswordCredentialsProvider(token, "")
                        : null)
                .call()
                .close();
    }

    private Path findPackageJson(Path projectPath) throws IOException {
        Path root = projectPath;
        Path pkg = root.resolve("package.json");
        if (Files.exists(pkg)) return pkg;

        String rootDir = "";
        for (Path child : Files.list(root).filter(Files::isDirectory).toList()) {
            Path candidate = child.resolve("package.json");
            if (Files.exists(candidate)) {
                return candidate;
            }
        }
        return pkg;
    }

    private String identifyProjectType(Path packageJsonPath, Long projectId) {
        if (!Files.exists(packageJsonPath)) {
            logBroadcaster.emitLog(projectId, "No package.json found, assuming Node.js");
            return "Node.js";
        }

        try {
            String content = Files.readString(packageJsonPath, StandardCharsets.UTF_8);
            JsonNode root = objectMapper.readTree(content);
            JsonNode deps = root.has("dependencies") ? root.get("dependencies") : null;
            JsonNode devDeps = root.has("devDependencies") ? root.get("devDependencies") : null;

            if (deps != null) {
                if (deps.has("react-scripts") || deps.has("react-dom")) return "React.js";
                if (deps.has("next")) return "Next.js";
                if (deps.has("vue") || deps.has("@vue/cli-service")) return "Vue.js";
                if (deps.has("@angular/core")) return "Angular";
                if (deps.has("express") || deps.has("fastify") || deps.has("koa")) return "Node.js";
            }
            if (devDeps != null) {
                if (devDeps.has("vite") && (deps != null && (deps.has("react") || deps.has("vue")))) {
                    if (deps.has("react")) return "React.js";
                    if (deps.has("vue")) return "Vue.js";
                }
            }

            return "Node.js";
        } catch (Exception e) {
            logBroadcaster.emitLog(projectId, "Could not parse package.json: " + e.getMessage());
            return "Node.js";
        }
    }

    private void runNpmInstall(Path projectPath, Long projectId) throws IOException, InterruptedException {
        logBroadcaster.emitLog(projectId, "Running npm install...");
        runProcess(projectPath, new String[]{"npm", "install"}, projectId);
    }

    private void buildAndServe(Project project, Path projectPath, String projectType, Long projectId) throws IOException, InterruptedException {
        Path pkgPath = findPackageJson(projectPath);
        Path workDir = pkgPath.getParent();
        JsonNode scripts = readScripts(pkgPath);

        boolean hasBuild = scripts != null && scripts.has("build");
        boolean hasStart = scripts != null && scripts.has("start");
        boolean hasDev = scripts != null && scripts.has("dev");
        boolean isTypeScript = hasTsConfig(workDir);

        switch (projectType) {
            case "React.js", "Next.js", "Vue.js", "Angular" -> {
                if (hasBuild) {
                    runProcess(workDir, new String[]{"npm", "run", "build"}, projectId);
                }
                String serveScript = hasStart ? "start" : (hasDev ? "dev" : null);
                if (serveScript != null) {
                    runServeProcess(workDir, new String[]{"npm", "run", serveScript}, project.getPort(), projectId);
                }
            }
            case "Node.js" -> {
                if (isTypeScript && hasBuild) {
                    runProcess(workDir, new String[]{"npm", "run", "build"}, projectId);
                }
                String serveScript = hasStart ? "start" : (hasDev ? "dev" : null);
                if (serveScript != null) {
                    runServeProcess(workDir, new String[]{"npm", "run", serveScript}, project.getPort(), projectId);
                } else {
                    runServeProcess(workDir, new String[]{"node", "index.js"}, project.getPort(), projectId);
                }
            }
            default -> {
                if (hasBuild) runProcess(workDir, new String[]{"npm", "run", "build"}, projectId);
                if (hasStart) runServeProcess(workDir, new String[]{"npm", "run", "start"}, project.getPort(), projectId);
            }
        }
    }

    private JsonNode readScripts(Path packageJsonPath) {
        try {
            String content = Files.readString(packageJsonPath, StandardCharsets.UTF_8);
            JsonNode root = objectMapper.readTree(content);
            return root.has("scripts") ? root.get("scripts") : null;
        } catch (Exception e) {
            return null;
        }
    }

    private boolean hasTsConfig(Path workDir) {
        return Files.exists(workDir.resolve("tsconfig.json"));
    }

    private void runProcess(Path workDir, String[] command, Long projectId) throws IOException, InterruptedException {
        ProcessBuilder pb = new ProcessBuilder(command);
        pb.directory(workDir.toFile());
        pb.redirectErrorStream(true);
        Process process = pb.start();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                logBroadcaster.emitLog(projectId, line);
            }
        }
        int exit = process.waitFor();
        if (exit != 0) {
            throw new RuntimeException("Command failed with exit code " + exit + ": " + String.join(" ", command));
        }
    }

    private void runServeProcess(Path workDir, String[] command, int port, Long projectId) throws IOException {
        ProcessBuilder pb = new ProcessBuilder(command);
        pb.directory(workDir.toFile());
        pb.environment().put("PORT", String.valueOf(port));
        pb.redirectErrorStream(true);
        Process process = pb.start();

        new Thread(() -> {
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    logBroadcaster.emitLog(projectId, line);
                }
            } catch (IOException ignored) {}
        }).start();
    }

    private String resolveStorageDir(Long projectId, String name) {
        String safeName = name.replaceAll("[^a-zA-Z0-9_-]", "_");
        return projectId + "_" + safeName;
    }

    private void emitHostInfo(Long projectId) {
        try {
            String hostname = InetAddress.getLocalHost().getHostName();
            int cores = Runtime.getRuntime().availableProcessors();
            String memory = "unknown";
            try {
                var osBean = ManagementFactory.getOperatingSystemMXBean();
                if (osBean instanceof OperatingSystemMXBean sunOs) {
                    long totalBytes = sunOs.getTotalPhysicalMemorySize();
                    memory = (totalBytes / (1024L * 1024 * 1024)) + " GB";
                }
            } catch (Exception ignored) {}
            logBroadcaster.emitLog(projectId, "Running build on " + hostname + " (" + buildLocation + ")");
            logBroadcaster.emitLog(projectId, "Build machine configuration: " + cores + " cores, " + memory);
        } catch (Exception e) {
            logBroadcaster.emitLog(projectId, "Build host: " + buildLocation);
        }
    }

    private int allocatePort() {
        Set<Integer> used = new HashSet<>();
        projectRepository.findAll().forEach(p -> {
            if (p.getPort() != null) used.add(p.getPort());
        });
        for (int p = PORT_START; p <= PORT_END; p++) {
            if (!used.contains(p)) return p;
        }
        throw new IllegalStateException("No available ports in range " + PORT_START + "-" + PORT_END);
    }
}

package xyz.minginc._8848.backend.service;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.LinkedBlockingQueue;

@Component
public class ProjectLogBroadcaster {

    private static final String SENTINEL_COMPLETE = "__BUILD_COMPLETE__";
    private static final String SENTINEL_ERROR = "__BUILD_ERROR__";

    private final Map<Long, BlockingQueue<String>> projectLogQueues = new ConcurrentHashMap<>();

    public void registerProject(Long projectId) {
        projectLogQueues.put(projectId, new LinkedBlockingQueue<>());
    }

    public void emitLog(Long projectId, String line) {
        BlockingQueue<String> queue = projectLogQueues.get(projectId);
        if (queue != null) {
            String timestamp = java.time.LocalTime.now().format(java.time.format.DateTimeFormatter.ofPattern("HH:mm:ss.SSS"));
            queue.offer(timestamp + " " + line);
        }
    }

    public void complete(Long projectId) {
        BlockingQueue<String> queue = projectLogQueues.get(projectId);
        if (queue != null) {
            queue.offer(SENTINEL_COMPLETE);
        }
    }

    public void error(Long projectId, String message) {
        BlockingQueue<String> queue = projectLogQueues.get(projectId);
        if (queue != null) {
            queue.offer(SENTINEL_ERROR + ":" + message);
        }
    }

    public void streamLogs(Long projectId, SseEmitter emitter) {
        BlockingQueue<String> queue = projectLogQueues.get(projectId);
        if (queue == null) {
            try {
                emitter.send(SseEmitter.event().name("log").data("Project build not started or already completed."));
                emitter.send(SseEmitter.event().name("complete").data(""));
                emitter.complete();
            } catch (IOException e) {
                emitter.completeWithError(e);
            }
            return;
        }

        emitter.onCompletion(() -> {});
        emitter.onTimeout(() -> emitter.complete());
        emitter.onError(e -> emitter.complete());

        new Thread(() -> {
            try {
                while (true) {
                    String line = queue.take();
                    if (SENTINEL_COMPLETE.equals(line)) {
                        emitter.send(SseEmitter.event().name("complete").data(""));
                        emitter.complete();
                        break;
                    }
                    if (line.startsWith(SENTINEL_ERROR)) {
                        String msg = line.substring(SENTINEL_ERROR.length() + 1);
                        emitter.send(SseEmitter.event().name("error").data(msg));
                        emitter.send(SseEmitter.event().name("complete").data(""));
                        emitter.complete();
                        break;
                    }
                    emitter.send(SseEmitter.event().name("log").data(line));
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                emitter.completeWithError(e);
            } catch (IOException e) {
                emitter.completeWithError(e);
            } finally {
                projectLogQueues.remove(projectId);
            }
        }).start();
    }

    public void cleanup(Long projectId) {
        projectLogQueues.remove(projectId);
    }
}

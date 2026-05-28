package com.project.TaskManagement.controller;



import com.project.TaskManagement.dto.TaskFilterRequest;
import com.project.TaskManagement.dto.TaskRequest;
import com.project.TaskManagement.model.*;
import com.project.TaskManagement.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    // POST /api/tasks
    @PostMapping
    public Task createTask(@RequestBody TaskRequest req) {
        return taskService.createTask(req);
    }

    // GET /api/tasks/by-status?status=TODO
    @GetMapping("/by-status")
    public List<Task> getByStatus(@RequestParam Status status) {
        return taskService.getByStatus(status);
    }

    // GET /api/tasks/search?keyword=fix
    @GetMapping("/search")
    public List<Task> search(@RequestParam String keyword) {
        return taskService.search(keyword);
    }

    // GET /api/tasks/with-assignee?status=IN_PROGRESS
    @GetMapping("/with-assignee")
    public List<Task> getWithAssignee(@RequestParam Status status) {
        return taskService.getWithAssignee(status);
    }

    // GET /api/tasks/paged?status=TODO&page=0&size=5
    @GetMapping("/paged")
    public Page<Task> getPaged(
        @RequestParam Status status,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "dueDate") String sortBy,
        @RequestParam(defaultValue = "ASC") String sortDir
    ) {
        return taskService.getByStatusPaged(status, page, size, sortBy, sortDir);
    }

    // GET /api/tasks/by-statuses?statuses=TODO&statuses=IN_PROGRESS
    @GetMapping("/by-statuses")
    public List<Task> getByStatuses(@RequestParam List<Status> statuses) {
        return taskService.getByStatuses(statuses);
    }

    // GET /api/tasks/overdue
    @GetMapping("/overdue")
    public List<Task> getOverdue() {
        return taskService.getOverdue();
    }

    // GET /api/tasks/filter?status=TODO&priority=HIGH&keyword=auth&assigneeId=1
    // All params optional — pass any combination
    @GetMapping("/filter")
    public List<Task> filter(
        @RequestParam(required = false) Status status,
        @RequestParam(required = false) Priority priority,
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) Long assigneeId
    ) {
        TaskFilterRequest req = TaskFilterRequest.builder()
            .status(status)
            .priority(priority)
            .keyword(keyword)
            .assigneeId(assigneeId)
            .build();
        return taskService.filter(req);
    }

    // PATCH /api/tasks/1/close
    @PatchMapping("/{id}/close")
    public ResponseEntity<String> close(@PathVariable Long id) {
        int updated = taskService.closeTask(id);
        return updated > 0
            ? ResponseEntity.ok("Task " + id + " closed")
            : ResponseEntity.notFound().build();
    }

    // DELETE /api/tasks/cleanup?before=2024-01-01
    @DeleteMapping("/cleanup")
    public ResponseEntity<String> cleanup(@RequestParam LocalDate before) {
        int deleted = taskService.cleanup(before);
        return ResponseEntity.ok("Deleted " + deleted + " tasks");
    }
}
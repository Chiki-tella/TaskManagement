package com.project.TaskManagement.service;



import com.project.TaskManagement.dto.TaskFilterRequest;
import com.project.TaskManagement.dto.TaskRequest;
import com.project.TaskManagement.model.*;
import com.project.TaskManagement.repository.TaskRepository;
import com.project.TaskManagement.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;



@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;   // ← added

    @Transactional
    public Task createTask(TaskRequest req, String userEmail) {
        User assignee = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("Logged in user not found"));

        Task task = Task.builder()
            .title(req.getTitle())
            .description(req.getDescription())
            .status(req.getStatus() != null ? req.getStatus() : Status.TODO)
            .priority(req.getPriority() != null ? req.getPriority() : Priority.MEDIUM)
            .dueDate(req.getDueDate())
            .assignee(assignee)
            .build();

        return taskRepository.save(task);
    }

    public List<Task> getByStatus(Status status) {
        return taskRepository.findByStatus(status);
    }

    public List<Task> search(String keyword) {
        return taskRepository.searchByKeyword(keyword);
    }

    public List<Task> getByStatuses(List<Status> statuses) {
        return taskRepository.findByStatuses(statuses);
    }

    public Page<Task> getByStatusPaged(Status status, int page, int size, String sortBy, String sortDir, String userEmail) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return taskRepository.findByStatusAndAssigneeEmailPaged(status, userEmail, pageable);
    }

    public List<Task> getWithAssignee(Status status) {
        return taskRepository.findByStatusWithAssignee(status);
    }

    public List<Task> filter(TaskFilterRequest req) {
        return taskRepository.findWithFilters(req);
    }

    public List<Task> getOverdue() {
        return taskRepository.findOverdueTasks(LocalDateTime.now(), Status.DONE.name());
    }

    @Transactional
    public int closeTask(Long id, String userEmail) {
        return taskRepository.updateTaskStatusOwned(id, Status.DONE, userEmail);
    }

    @Transactional
    public int cleanup(LocalDateTime before) {
        return taskRepository.deleteCompletedTasksBefore(Status.DONE, before);
    }

    public List<Task> getDueOrOverdueTasksForUser(String email) {
        LocalDateTime todayEnd = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);
        return taskRepository.findDueOrOverdueTasksByUserEmail(todayEnd, email);
    }
}
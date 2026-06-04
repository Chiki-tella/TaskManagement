package com.project.TaskManagement.dto;



import com.project.TaskManagement.model.Priority;
import com.project.TaskManagement.model.Status;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskRequest {
    private String title;
    private String description;
    private Status status;
    private Priority priority;
    private LocalDateTime dueDate;
    private Long assigneeId;   // optional — the user ID to assign this task to
}
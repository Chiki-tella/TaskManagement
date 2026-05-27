package com.project.TaskManagement.dto;

import com.project.TaskManagement.model.Priority;
import com.project.TaskManagement.model.Status;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data                    // generates getters, setters, equals, hashCode, toString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskFilterRequest {
    private Status status;       // nullable — if null, don't filter by status
    private Priority priority;   // nullable
    private String keyword;      // nullable — search in title
    private Long assigneeId;     // nullable
}
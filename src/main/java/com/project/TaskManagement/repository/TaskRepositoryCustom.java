package com.project.TaskManagement.repository;

import com.project.TaskManagement.dto.TaskFilterRequest;
import com.project.TaskManagement.model.Task;
import java.util.List;

public interface TaskRepositoryCustom {
    List<Task> findWithFilters(TaskFilterRequest filter);
}

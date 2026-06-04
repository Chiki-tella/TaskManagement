package com.project.TaskManagement.service;

import com.project.TaskManagement.dto.TaskRequest;
import com.project.TaskManagement.model.Priority;
import com.project.TaskManagement.model.Status;
import com.project.TaskManagement.model.Task;
import com.project.TaskManagement.model.User;
import com.project.TaskManagement.repository.TaskRepository;
import com.project.TaskManagement.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDateTime;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TaskService taskService;

    private User mockUser;
    private Task mockTask;

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("test@example.com");
        mockUser.setName("Test User");
        mockUser.setXp(0);
        mockUser.setLevel(1);
        mockUser.setStreak(0);

        mockTask = new Task();
        mockTask.setId(1L);
        mockTask.setTitle("Test Task");
        mockTask.setDescription("Test Description");
        mockTask.setStatus(Status.TODO);
        mockTask.setPriority(Priority.MEDIUM);
        mockTask.setAssignee(mockUser);
    }

    @Test
    void testCreateTask_Success() {
        TaskRequest request = new TaskRequest();
        request.setTitle("New Task");
        request.setDescription("New Description");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> {
            Task t = invocation.getArgument(0);
            t.setId(2L);
            return t;
        });

        Task result = taskService.createTask(request, "test@example.com");

        assertNotNull(result);
        assertEquals("New Task", result.getTitle());
        assertEquals("test@example.com", result.getAssignee().getEmail());
        assertEquals(Status.TODO, result.getStatus());
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void testCreateTask_UserNotFound() {
        TaskRequest request = new TaskRequest();
        
        when(userRepository.findByEmail("unknown@example.com")).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            taskService.createTask(request, "unknown@example.com");
        });
        
        assertEquals("Logged in user not found", exception.getMessage());
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void testCloseTask_Success() {
        when(taskRepository.updateTaskStatusOwned(1L, Status.DONE, "test@example.com")).thenReturn(1);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));

        int updated = taskService.closeTask(1L, "test@example.com");

        assertEquals(1, updated);
        assertEquals(10, mockUser.getXp()); // XP should be added
        assertEquals(1, mockUser.getStreak()); // Streak should be initialized
        assertNotNull(mockUser.getLastTaskCompletedDate());
        verify(userRepository, times(1)).save(mockUser);
    }
}

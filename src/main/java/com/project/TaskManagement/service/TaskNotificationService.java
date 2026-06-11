package com.project.TaskManagement.service;

import com.project.TaskManagement.model.Task;
import com.project.TaskManagement.model.User;
import com.project.TaskManagement.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskNotificationService {

    private final TaskRepository taskRepository;
    private final EmailService emailService;

    public void sendNotification() {
        System.out.println("Running daily task notification job at 9 AM...");
        
        LocalDateTime todayEnd = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);
        List<Task> dueTasks = taskRepository.findDueOrOverdueTasksWithAssignees(todayEnd);
        
        if (dueTasks.isEmpty()) {
            System.out.println("No due tasks found. Skipping emails.");
            return;
        }

        // Group tasks by assignee
        Map<User, List<Task>> tasksByUser = dueTasks.stream()
                .collect(Collectors.groupingBy(Task::getAssignee));

        for (Map.Entry<User, List<Task>> entry : tasksByUser.entrySet()) {
            User user = entry.getKey();
            List<Task> userTasks = entry.getValue();

            String subject = "Reminder: You have " + userTasks.size() + " tasks due soon!";
            StringBuilder body = new StringBuilder();
            body.append("Hello ").append(user.getName()).append(",\n\n");
            body.append("This is a reminder that you have the following tasks due today or overdue:\n\n");
            
            for (Task task : userTasks) {
                body.append("- ").append(task.getTitle())
                    .append(" (Due: ").append(task.getDueDate()).append(")\n");
            }
            
            body.append("\nPlease log in to TaskFlow to complete them.\n");

            emailService.sendEmail(user.getEmail(), subject, body.toString());
        }
        
        System.out.println("Finished daily task notification job.");
    }
}

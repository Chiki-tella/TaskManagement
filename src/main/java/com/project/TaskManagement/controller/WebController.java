package com.project.TaskManagement.controller;

import com.project.TaskManagement.model.Status;
import com.project.TaskManagement.model.Task;
import com.project.TaskManagement.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

import com.project.TaskManagement.model.User;
import com.project.TaskManagement.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
@RequiredArgsConstructor
public class WebController {

    private final TaskService taskService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/register")
    public String showRegistrationForm() {
        return "register";
    }

    @PostMapping("/register")
    public String processRegistration(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String password) {
        
        // Save the new user with hashed password
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRoles("ROLE_USER");
        userRepository.save(user);

        // Redirect to the login page after successful registration
        return "redirect:/login?registered=true";
    }

    @GetMapping("/")
    public String index(
            @RequestParam(required = false) Status status,
            Model model) {
        
        List<Task> tasks;
        
        // If a status filter is provided, fetch by status. Otherwise fetch all (for simplicity, we'll fetch a page or use an existing method).
        // Since we don't have a "findAll" without pagination exposed in TaskService yet, 
        // we can either add one or use the paged endpoint. Let's use the paged endpoint for simplicity.
        if (status != null) {
            tasks = taskService.getByStatus(status);
            model.addAttribute("currentStatus", status.name());
        } else {
            // Fetching a default page of tasks, since we have getByStatusPaged but not findAll.
            // Wait, actually I will just use taskService.getByStatus(Status.TODO) by default if null, 
            // or I can create a small new method inside TaskService to find all, or use repository directly. 
            // Let's just use the paged API but return the content.
            tasks = taskService.getByStatusPaged(Status.TODO, 0, 50, "dueDate", "ASC").getContent();
            model.addAttribute("currentStatus", "TODO (Default)");
        }

        model.addAttribute("tasks", tasks);
        return "index"; // This will resolve to /WEB-INF/jsp/index.jsp
    }
}

package com.project.TaskManagement.controller;

import com.project.TaskManagement.model.User;
import com.project.TaskManagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    // POST /api/users
    @PostMapping
    public User createUser(@RequestBody User user) {
        if (user.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        if (user.getRoles() == null) {
            user.setRoles("ROLE_USER");
        }
        return userRepository.save(user);
    }

    // GET /api/users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // GET /api/users/me
    @GetMapping("/me")
    public User getCurrentUser(java.security.Principal principal) {
        if (principal == null) throw new RuntimeException("Unauthorized");
        return userRepository.findByEmail(principal.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
}

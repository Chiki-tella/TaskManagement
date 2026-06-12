package com.project.TaskManagement.controller;

import com.project.TaskManagement.model.User;
import com.project.TaskManagement.repository.TaskRepository;
import com.project.TaskManagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
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
    public ResponseEntity<?> getAllUsers(java.security.Principal principal) {
        if (principal == null) return ResponseEntity.status(401).body("Unauthorized");
        User currentUser = userRepository.findByEmail(principal.getName()).orElse(null);
        if (currentUser == null || !currentUser.getRoles().contains("ROLE_ADMIN")) {
            return ResponseEntity.status(403).body("Forbidden");
        }
        return ResponseEntity.ok(userRepository.findAll());
    }

    // GET /api/users/me
    @GetMapping("/me")
    public User getCurrentUser(java.security.Principal principal) {
        if (principal == null) throw new RuntimeException("Unauthorized");
        return userRepository.findByEmail(principal.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // DELETE /api/users/{id}
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteUser(@PathVariable Long id, java.security.Principal principal) {
        if (principal == null) return ResponseEntity.status(401).body("Unauthorized");
        User currentUser = userRepository.findByEmail(principal.getName()).orElse(null);
        if (currentUser == null || !currentUser.getRoles().contains("ROLE_ADMIN")) {
            return ResponseEntity.status(403).body("Forbidden");
        }
        
        User targetUser = userRepository.findById(id).orElse(null);
        if (targetUser == null) return ResponseEntity.notFound().build();
        
        if (targetUser.getRoles().contains("ROLE_ADMIN")) {
            return ResponseEntity.status(403).body("Cannot delete another admin");
        }
        
        taskRepository.deleteByAssigneeId(id);
        userRepository.delete(targetUser);
        return ResponseEntity.ok("User deleted");
    }
}

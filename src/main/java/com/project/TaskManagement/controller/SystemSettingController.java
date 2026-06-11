package com.project.TaskManagement.controller;

import com.project.TaskManagement.model.SystemSetting;
import com.project.TaskManagement.model.User;
import com.project.TaskManagement.repository.UserRepository;
import com.project.TaskManagement.service.SystemSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SystemSettingController {

    private final SystemSettingService service;
    private final UserRepository userRepository;

    @GetMapping
    public List<SystemSetting> getAllSettings() {
        // Initialize defaults if they don't exist yet
        service.getSetting("NOTIFICATION_CRON", "0 0 9 * * *");
        service.getSetting("FRONTEND_POLL_INTERVAL", "60000");
        return service.getAllSettings();
    }

    @PostMapping
    public ResponseEntity<String> updateSettings(@RequestBody Map<String, String> settings, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user == null || !user.getRoles().contains("ROLE_ADMIN")) {
            return ResponseEntity.status(403).body("Forbidden: Admin access required");
        }

        settings.forEach(service::setSetting);
        return ResponseEntity.ok("Settings updated");
    }
}

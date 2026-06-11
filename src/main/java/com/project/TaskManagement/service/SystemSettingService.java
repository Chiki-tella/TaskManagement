package com.project.TaskManagement.service;

import com.project.TaskManagement.model.SystemSetting;
import com.project.TaskManagement.repository.SystemSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SystemSettingService {

    private final SystemSettingRepository repository;

    @Transactional
    public String getSetting(String key, String defaultValue) {
        return repository.findById(key)
                .map(SystemSetting::getSettingValue)
                .orElseGet(() -> {
                    SystemSetting newSetting = new SystemSetting(key, defaultValue);
                    repository.save(newSetting);
                    return defaultValue;
                });
    }

    @Transactional
    public void setSetting(String key, String value) {
        repository.save(new SystemSetting(key, value));
    }

    @Transactional(readOnly = true)
    public List<SystemSetting> getAllSettings() {
        return repository.findAll();
    }
}

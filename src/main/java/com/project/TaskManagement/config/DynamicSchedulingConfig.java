package com.project.TaskManagement.config;

import com.project.TaskManagement.service.SystemSettingService;
import com.project.TaskManagement.service.TaskNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.SchedulingConfigurer;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;
import org.springframework.scheduling.support.CronTrigger;

import java.util.TimeZone;

@Configuration
@EnableScheduling
@RequiredArgsConstructor
public class DynamicSchedulingConfig implements SchedulingConfigurer {

    private final TaskNotificationService taskNotificationService;
    private final SystemSettingService systemSettingService;

    @Override
    public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {
        taskRegistrar.addTriggerTask(
            () -> taskNotificationService.sendNotification(),
            triggerContext -> {
                String cron = systemSettingService.getSetting("NOTIFICATION_CRON", "0 0 9 * * *");
                CronTrigger trigger = new CronTrigger(cron, TimeZone.getDefault());
                return trigger.nextExecution(triggerContext);
            }
        );
    }
}

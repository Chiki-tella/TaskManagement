package com.project.TaskManagement.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

	@Service
	public class TaskNotificationService {

	    @Scheduled(fixedRate = 5000)
	    public void sendNotification() {
	        System.out.println("Notification sent every 5 seconds");
	    }
	}


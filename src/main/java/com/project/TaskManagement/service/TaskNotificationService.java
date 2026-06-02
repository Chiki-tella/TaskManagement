package com.project.TaskManagement.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

	@Service
	public class TaskNotificationService {

	    @Scheduled(fixedRate = 15000)
	    public void sendNotification() {
	        System.out.println("Notification sent every 15 seconds");
	    }
	}


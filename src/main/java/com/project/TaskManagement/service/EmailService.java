package com.project.TaskManagement.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    public void sendEmail(String to, String subject, String body) {
        System.out.println("=========================================");
        System.out.println("MOCK EMAIL SENT");
        System.out.println("To: " + to);
        System.out.println("Subject: " + subject);
        System.out.println("Body: ");
        System.out.println(body);
        System.out.println("=========================================");
    }
}

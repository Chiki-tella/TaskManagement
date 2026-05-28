package com.project.TaskManagement.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    
    @com.fasterxml.jackson.annotation.JsonIgnore
    private String password;
    
    @Builder.Default
    private String roles = "ROLE_USER";

    @OneToMany(mappedBy = "assignee")
    @Builder.Default 
    private List<Task> tasks = new ArrayList<>();
}
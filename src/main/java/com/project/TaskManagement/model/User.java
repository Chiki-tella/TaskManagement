package com.project.TaskManagement.model;

import java.util.ArrayList;
import java.util.List;

import java.time.LocalDate;

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
    
    @com.fasterxml.jackson.annotation.JsonProperty(access = com.fasterxml.jackson.annotation.JsonProperty.Access.WRITE_ONLY)
    private String password;
    
    @Builder.Default
    private String roles = "ROLE_USER";

    @Builder.Default
    private Integer xp = 0;

    @Builder.Default
    private Integer level = 1;

    @Builder.Default
    private Integer streak = 0;

    private LocalDate lastTaskCompletedDate;

    public Integer getXp() { return xp == null ? 0 : xp; }
    public Integer getLevel() { return level == null ? 1 : level; }
    public Integer getStreak() { return streak == null ? 0 : streak; }

    @OneToMany(mappedBy = "assignee")
    @Builder.Default 
    private List<Task> tasks = new ArrayList<>();
}
package com.project.TaskManagement.repository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.project.TaskManagement.dto.TaskFilterRequest;
import com.project.TaskManagement.model.Task;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

@Repository
public class TaskRepositoryCustomImpl implements TaskRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    public List<Task> findWithFilters(TaskFilterRequest filter) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Task> query = cb.createQuery(Task.class);
        Root<Task> root = query.from(Task.class);

        // Start with an empty list of conditions
        List<Predicate> predicates = new ArrayList<>();

        // Add each condition only if its filter value was provided
        if (filter.getStatus() != null) {
            predicates.add(cb.equal(root.get("status"), filter.getStatus()));
        }

        if (filter.getPriority() != null) {
            predicates.add(cb.equal(root.get("priority"), filter.getPriority()));
        }

        if (filter.getKeyword() != null && !filter.getKeyword().isBlank()) {
            predicates.add(cb.like(
                cb.lower(root.get("title")),
                "%" + filter.getKeyword().toLowerCase() + "%"
            ));
        }

        if (filter.getAssigneeId() != null) {
            predicates.add(cb.equal(root.get("assignee").get("id"), filter.getAssigneeId()));
        }

        // Combine all active conditions with AND
        query.where(cb.and(predicates.toArray(new Predicate[0])));
        query.orderBy(cb.desc(root.get("createdAt")));

        return entityManager.createQuery(query).getResultList();
    }
}
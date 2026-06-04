package com.project.TaskManagement.repository;



import com.project.TaskManagement.model.*;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>, TaskRepositoryCustom {

    // ─────────────────────────────────────────
    // SELECT — JPQL
    // "Task" = class name, "status" = field name (not the DB table/column)
    // ─────────────────────────────────────────

    @Query("SELECT t FROM Task t WHERE t.status = :status")
    List<Task> findByStatus(@Param("status") Status status);

    @Query("SELECT t FROM Task t WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Task> searchByKeyword(@Param("keyword") String keyword);

    // ─────────────────────────────────────────
    // SELECT — Native SQL
    // "tasks" = actual DB table, "status" = actual DB column
    // ─────────────────────────────────────────

    @Query(value = "SELECT * FROM tasks WHERE status = :status", nativeQuery = true)
    List<Task> findByStatusNative(@Param("status") String status);

    // ─────────────────────────────────────────
    // ORDER — Derived method (no @Query needed)
    // Spring reads the method name and generates the query automatically
    // ─────────────────────────────────────────

    List<Task> findByStatusOrderByDueDateAsc(Status status);
    List<Task> findByStatusOrderByPriorityDescDueDateAsc(Status status);

    // ─────────────────────────────────────────
    // ORDER — JPQL
    // ─────────────────────────────────────────

    @Query("SELECT t FROM Task t WHERE t.assignee.id = :userId ORDER BY t.priority DESC")
    List<Task> findByUserOrderedByPriority(@Param("userId") Long userId);

    // ─────────────────────────────────────────
    // JOIN — JPQL JOIN FETCH
    // Loads User in the SAME query as Task — prevents N+1 queries
    // ─────────────────────────────────────────

    @Query("SELECT t FROM Task t LEFT JOIN FETCH t.assignee WHERE t.status = :status")
    List<Task> findByStatusWithAssignee(@Param("status") Status status);

    @Query("SELECT t FROM Task t JOIN FETCH t.assignee a WHERE a.email = :email")
    List<Task> findByAssigneeEmail(@Param("email") String email);

    // ─────────────────────────────────────────
    // PAGINATION
    // Pageable controls page number, size, and sort
    // ─────────────────────────────────────────

    @Query("SELECT t FROM Task t WHERE t.status = :status")
    Page<Task> findByStatusPaged(@Param("status") Status status, Pageable pageable);

    // Native pagination needs an explicit countQuery
    @Query(
        value = "SELECT * FROM tasks WHERE status = :status",
        countQuery = "SELECT COUNT(*) FROM tasks WHERE status = :status",
        nativeQuery = true
    )
    Page<Task> findByStatusPagedNative(@Param("status") String status, Pageable pageable);

    // ─────────────────────────────────────────
    // NAMED PARAMETERS (preferred over indexed ?1 ?2)
    // ─────────────────────────────────────────

    @Query("SELECT t FROM Task t WHERE t.status = :status AND t.priority = :priority")
    List<Task> findByStatusAndPriority(
        @Param("status") Status status,
        @Param("priority") Priority priority
    );

    // ─────────────────────────────────────────
    // COLLECTION PARAMETER — IN clause
    // Pass a List, JPA generates WHERE status IN ('TODO', 'IN_PROGRESS', ...)
    // ─────────────────────────────────────────

    @Query("SELECT t FROM Task t WHERE t.status IN :statuses")
    List<Task> findByStatuses(@Param("statuses") List<Status> statuses);

    // ─────────────────────────────────────────
    // @MODIFYING — UPDATE and DELETE
    // @Transactional goes on the SERVICE method that calls this
    // ─────────────────────────────────────────

    @Modifying
    @Query("UPDATE Task t SET t.status = :newStatus WHERE t.id = :id")
    int updateTaskStatus(@Param("id") Long id, @Param("newStatus") Status newStatus);

    @Modifying
    @Query("DELETE FROM Task t WHERE t.status = :status AND t.dueDate < :date")
    int deleteCompletedTasksBefore(@Param("status") Status status, @Param("date") LocalDate date);

    // ─────────────────────────────────────────
    // OVERDUE — Native
    // ─────────────────────────────────────────

    @Query(value = "SELECT * FROM tasks WHERE due_date < :date AND status != :status",
           nativeQuery = true)
    List<Task> findOverdueTasks(@Param("date") LocalDate date, @Param("status") String status);

    // ─────────────────────────────────────────
    // SCHEDULING & DASHBOARD
    // ─────────────────────────────────────────

    @Query("SELECT t FROM Task t JOIN FETCH t.assignee WHERE t.dueDate <= :date AND t.status != 'DONE' AND t.assignee IS NOT NULL")
    List<Task> findDueOrOverdueTasksWithAssignees(@Param("date") LocalDate date);

    @Query("SELECT t FROM Task t WHERE t.dueDate <= :date AND t.status != 'DONE' AND t.assignee.email = :email")
    List<Task> findDueOrOverdueTasksByUserEmail(@Param("date") LocalDate date, @Param("email") String email);
}
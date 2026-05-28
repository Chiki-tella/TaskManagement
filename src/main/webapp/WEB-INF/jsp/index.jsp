<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Management Dashboard</title>
    <!-- Modern Bootstrap CSS for UI -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background-color: #f8f9fa; }
        .navbar { background-color: #0d6efd; }
        .navbar-brand { color: white !important; font-weight: bold; }
        .card { box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    </style>
</head>
<body>

    <nav class="navbar navbar-expand-lg mb-4">
        <div class="container">
            <a class="navbar-brand" href="/">Task Management</a>
            <div class="d-flex">
                <a href="/logout" class="btn btn-outline-light btn-sm">Logout</a>
            </div>
        </div>
    </nav>

    <div class="container">
        <div class="row mb-3">
            <div class="col">
                <h2 class="fw-bold">My Dashboard</h2>
                <p class="text-muted">Viewing tasks for status: <strong>${currentStatus}</strong></p>
            </div>
            <div class="col text-end">
                <a href="/?status=TODO" class="btn btn-secondary btn-sm">TODO</a>
                <a href="/?status=IN_PROGRESS" class="btn btn-primary btn-sm">IN PROGRESS</a>
                <a href="/?status=DONE" class="btn btn-success btn-sm">DONE</a>
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <table class="table table-hover align-middle">
                    <thead class="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Priority</th>
                            <th>Due Date</th>
                            <th>Assignee</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Loop through the 'tasks' list passed from the Spring Controller -->
                        <c:forEach var="task" items="${tasks}">
                            <tr>
                                <td>#${task.id}</td>
                                <td><strong>${task.title}</strong></td>
                                <td>${task.description}</td>
                                <td>
                                    <span class="badge 
                                        ${task.priority == 'HIGH' ? 'bg-danger' : (task.priority == 'MEDIUM' ? 'bg-warning text-dark' : 'bg-info text-dark')}">
                                        ${task.priority}
                                    </span>
                                </td>
                                <td>${task.dueDate}</td>
                                <td>${task.assignee != null ? task.assignee.name : 'Unassigned'}</td>
                            </tr>
                        </c:forEach>
                        
                        <!-- Empty state -->
                        <c:if test="${empty tasks}">
                            <tr>
                                <td colspan="6" class="text-center text-muted py-4">No tasks found for this status.</td>
                            </tr>
                        </c:if>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>

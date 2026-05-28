<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - Task Management</title>
    <!-- Modern Bootstrap CSS for UI -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background-color: #f8f9fa; height: 100vh; display: flex; align-items: center; justify-content: center; }
        .card { box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
        .brand-color { color: #0d6efd; font-weight: bold; }
    </style>
</head>
<body>

    <div class="card">
        <div class="card-body p-4">
            <h3 class="text-center brand-color mb-4">Task Management</h3>
            <h5 class="text-center mb-4">Create an Account</h5>
            
            <form action="/register" method="POST">
                <div class="mb-3">
                    <label class="form-label fw-bold">Full Name</label>
                    <input type="text" name="name" class="form-control" required placeholder="John Doe">
                </div>
                
                <div class="mb-3">
                    <label class="form-label fw-bold">Email address</label>
                    <input type="email" name="email" class="form-control" required placeholder="name@example.com">
                </div>
                
                <div class="mb-4">
                    <label class="form-label fw-bold">Password</label>
                    <input type="password" name="password" class="form-control" required placeholder="Create a strong password">
                </div>
                
                <button type="submit" class="btn btn-primary w-100 fw-bold">Sign Up</button>
            </form>
            
            <div class="text-center mt-3">
                <p class="text-muted small">Already have an account? <a href="/login">Login here</a></p>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>

# TaskFlow: Gamified Task Management

TaskFlow is a modern, full-stack Task Management application that transforms boring to-do lists into an engaging, gamified experience. It tracks daily streaks, grants experience points (XP) for completed tasks, and allows users to level up as they stay productive.

## 🏗️ Architecture Overview

The project follows a standard decoupled **Client-Server Architecture**:
- **Backend**: A robust API built with Java and Spring Boot.
- **Frontend**: A fast, interactive Single Page Application (SPA) built with React and Vite.
- **Database**: PostgreSQL handles persistent data storage using Hibernate/JPA as the ORM.

---

## ☕ Backend (Spring Boot)

The backend provides secure RESTful APIs to manage users and tasks.

### Key Technologies
- **Java 21 & Spring Boot 4**
- **Spring Security**: Manages authentication via standard Session Cookies (`JSESSIONID`).
- **Spring Data JPA & Hibernate**: Maps Java classes directly to PostgreSQL tables.
- **JUnit 5 & Mockito**: Comprehensive unit testing.

### Standout Features
- **3-Tier Architecture**: Clean separation of logic (`Controllers` -> `Services` -> `Repositories`).
- **Automated Cron Jobs**: A `@Scheduled` task runs automatically every morning to alert users.
- **Null-Safe Gamification Engine**: Handles XP accumulation, level thresholds, and daily streak tracking safely on the server side.

### How to Run the Backend
1. Ensure PostgreSQL is running locally on port `5432` with a database named `taskdb` (credentials: `postgres` / `Munezero`).
2. Navigate to the root directory.
3. Start the Spring Boot application using Maven:
   ```bash
   mvn spring-boot:run
   ```
4. The API will be available at `http://localhost:8080/api/`.

### 📚 API Documentation
This project automatically generates OpenAPI (Swagger) documentation! Once the backend is running, you can explore and interact with the API endpoints here:
- **Interactive Swagger UI**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **Raw OpenAPI JSON**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

---

## ⚛️ Frontend (React)

The frontend is designed to be beautiful, engaging, and highly responsive.

### Key Technologies
- **React & Vite**: Extremely fast development experience.
- **React Router**: Seamless client-side routing.
- **Context API**: Global state management to share the user's XP and Level across components without prop-drilling.

### Standout Features
- **Glassmorphism UI**: Uses modern CSS `backdrop-filter` effects and customized color palettes.
- **Celebration Feedback**: Triggers a massive confetti burst (`react-confetti`) whenever a task is completed.
- **Dynamic Empty States**: Instead of a blank page, users are greeted with motivational quotes and gold stars when their to-do list is empty.

### How to Run the Frontend
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. The application will be accessible at `http://localhost:5173/`. *(Vite is configured to proxy `/api` and `/login` requests directly to the Spring Boot backend).*

---

## 🧪 Testing
The backend includes a suite of automated Unit Tests (focusing on the `TaskService`).
To run the test suite, navigate to the root directory and run:
```bash
mvn test
```
